const { Client, Events, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const crypto = require('crypto');

const { ENV } = require('./config');
const { debug, safeReply, safeShowModal, safeDeferReply } = require('./utils');
const { criarModal } = require('./modals');
const { obterOpcoesDoCanal } = require('./menu');
const { obterDestinoPorTipo, resolverCanalDestino } = require('./destinos');
const { criarMensagemSolicitacao } = require('./formatter');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Evitar processar o mesmo interaction múltiplas vezes (Discord às vezes reenviando)
const processedInteractions = new Map();
// Evitar envio duplicado baseado no conteúdo (hash) por canal
const recentSends = new Map();
const CLEANUP_INTERVAL_MS = 30_000;
const INTERACTION_RETENTION_MS = 30_000;
const SEND_RETENTION_MS = 60_000;

/**
 * Converte uma data brasileira, com ou sem separadores, em uma data UTC válida.
 * Retorna null para valores impossíveis ou que não tenham oito dígitos.
 */
function interpretarDataBrasileira(valor) {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length !== 8) return null;

    const dia = Number(numeros.slice(0, 2));
    const mes = Number(numeros.slice(2, 4));
    const ano = Number(numeros.slice(4));
    const data = new Date(Date.UTC(ano, mes - 1, dia));

    if (
        data.getUTCFullYear() !== ano ||
        data.getUTCMonth() !== mes - 1 ||
        data.getUTCDate() !== dia
    ) {
        return null;
    }

    return data;
}

/** Retorna a data civil atual de São Paulo representada à meia-noite em UTC. */
function obterHojeEmSaoPaulo() {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());
    const valor = tipo => Number(partes.find(parte => parte.type === tipo).value);

    return new Date(Date.UTC(valor('year'), valor('month') - 1, valor('day')));
}

/**
 * Calcula a data mínima de uma mensalidade: o mesmo dia do mês seguinte mais um dia.
 * Ajusta automaticamente meses que não possuem o dia original (por exemplo, dia 31).
 */
function obterDataMinimaMensalidade(hoje) {
    const ano = hoje.getUTCFullYear();
    const mesSeguinte = hoje.getUTCMonth() + 1;
    const ultimoDiaDoMes = new Date(Date.UTC(ano, mesSeguinte + 1, 0)).getUTCDate();
    const mesmoDiaNoMesSeguinte = new Date(Date.UTC(
        ano,
        mesSeguinte,
        Math.min(hoje.getUTCDate(), ultimoDiaDoMes)
    ));

    mesmoDiaNoMesSeguinte.setUTCDate(mesmoDiaNoMesSeguinte.getUTCDate() + 1);
    return mesmoDiaNoMesSeguinte;
}

/** Formata uma data UTC como DD/MM/AAAA. */
function formatarDataBrasileira(data) {
    const dia = String(data.getUTCDate()).padStart(2, '0');
    const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${data.getUTCFullYear()}`;
}

/** Remove dos caches as interações e os envios que já passaram do prazo de retenção. */
function cleanupCaches() {
    const agora = Date.now();

    for (const [interactionId, timestamp] of processedInteractions) {
        if (agora - timestamp > INTERACTION_RETENTION_MS) {
            processedInteractions.delete(interactionId);
        }
    }

    for (const [sendKey, timestamp] of recentSends) {
        if (agora - timestamp > SEND_RETENTION_MS) {
            recentSends.delete(sendKey);
        }
    }
}

const cleanupInterval = setInterval(cleanupCaches, CLEANUP_INTERVAL_MS);
cleanupInterval.unref();

// Confirma no log de depuração que o cliente concluiu a conexão com o Discord.
client.once(Events.ClientReady, bot => {
    debug('Bot conectado como', bot.user.tag);
});

// Fluxo principal: abre o menu, exibe o modal selecionado, valida os dados e envia
// a solicitação ao canal da equipe responsável.
client.on('interactionCreate', async interaction => {
    try {
        if (processedInteractions.has(interaction.id)) {
            debug('Ignored duplicate interaction:', interaction.id, interaction.type);
            return;
        }

        processedInteractions.set(interaction.id, Date.now());

        // Etapa 1: o comando /solicitar apresenta as opções permitidas neste canal.
        if (
            interaction.isChatInputCommand() &&
            interaction.commandName === 'solicitar'
        ) {
            debug('Interaction: chat command /solicitar by', interaction.user.id, 'channel', interaction.channelId);
            const opcoesDoCanal = obterOpcoesDoCanal(interaction, ENV);
            const menu = new StringSelectMenuBuilder()
                .setCustomId('menu_solicitacao')
                .setPlaceholder('Escolha o tipo de solicitação')
                .addOptions(
                    ...opcoesDoCanal.map(opcao =>
                        new StringSelectMenuOptionBuilder()
                            .setLabel(opcao.label)
                            .setDescription(opcao.description)
                            .setValue(opcao.value)
                            .setEmoji(opcao.emoji)
                    )
                );

            const linha = new ActionRowBuilder().addComponents(menu);

            const embed = new EmbedBuilder()
                .setTitle('Solicitações do bot')
                .setDescription([
                    'Selecione abaixo o tipo de solicitação desejado.',
                    '',
                    'Depois, preencha o formulário com os dados da solicitação.'
                ].join('\n'));

            const replyResult = await safeReply(interaction, {
                embeds: [embed],
                components: [linha],
                flags: MessageFlags.Ephemeral
            });

            if (!replyResult) {
                debug('Failed to reply to /solicitar interaction, aborting:', interaction.id);
            }
            return;
        }

        // Etapa 2: a escolha do menu é transformada no formulário correspondente.
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === 'menu_solicitacao'
        ) {
            debug('Interaction: select menu opened by', interaction.user.id, 'values', interaction.values, 'channel', interaction.channelId);
            const tipoSelecionado = interaction.values[0];
            const modal = criarModal(tipoSelecionado);

            if (!modal) {
                await safeReply(interaction, {
                    content: 'Tipo de solicitação inválido.',
                    flags: MessageFlags.Ephemeral
                });
                return;
            }

            debug('Showing modal:', modal?.data?.custom_id || modal?.customId || tipoSelecionado);
            const showResult = await safeShowModal(interaction, modal);
            if (!showResult) {
                debug('Failed to show modal, aborting select interaction:', interaction.id);
                await safeReply(interaction, {
                    content: 'Não foi possível abrir o formulário. Tente novamente em alguns instantes.',
                    flags: MessageFlags.Ephemeral
                });
            }
            return;
        }

        // Etapa 3: o formulário enviado é validado, formatado e encaminhado ao suporte.
        if (
            interaction.isModalSubmit() &&
            interaction.customId.startsWith('modal_')
        ) {
            debug('Interaction: modal submit received', interaction.id, interaction.customId, 'by', interaction.user.id, 'channel', interaction.channelId);
            const deferResult = await safeDeferReply(interaction, {
                flags: MessageFlags.Ephemeral
            });

            if (!deferResult) {
                debug('Failed to defer modal submit interaction, aborting:', interaction.id);
                return;
            }

            if (interaction.customId === 'modal_renovacao_registro') {
                const dataValidade = interpretarDataBrasileira(
                    interaction.fields.getTextInputValue('data_validade')
                );
                const tipoRegistro = interaction.fields.getStringSelectValues('tipo_registro')[0];

                if (!dataValidade) {
                    await interaction.editReply('A solicitação não foi enviada. Informe uma data válida usando **DDMMAAAA** ou **DD/MM/AAAA**.');
                    return;
                }

                if (tipoRegistro === 'Mensalidade') {
                    const dataMinima = obterDataMinimaMensalidade(obterHojeEmSaoPaulo());

                    if (dataValidade < dataMinima) {
                        await interaction.editReply(`A solicitação não foi enviada. Para **Mensalidade**, a data mínima permitida é **${formatarDataBrasileira(dataMinima)}**.`);
                        return;
                    }
                }
            }

            const destino = obterDestinoPorTipo(interaction.customId, ENV);
            const canalId = destino.channelId;

            if (!canalId) {
                await interaction.editReply('Não foi possível determinar o canal de destino para esta solicitação.');
                return;
            }

            const canal = await resolverCanalDestino(client, {
                channelId: canalId,
                guildId: destino.guildId
            });

            if (!canal || !canal.isTextBased()) {
                await interaction.editReply(`O canal configurado para ${destino.nome} não é válido.`);
                return;
            }

            const suporteRoleId = interaction.customId === 'modal_licenca_facial'
                ? ENV.SUPORTE_LICENCA_ID
                : process.env.SUPORTE_ROLE_ID;
            const mensagemSolicitacao = criarMensagemSolicitacao(interaction, interaction.customId, suporteRoleId);
            if (!mensagemSolicitacao) {
                await interaction.editReply('Não foi possível identificar o tipo da solicitação.');
                return;
            }

            const embed = new EmbedBuilder()
                .setDescription(mensagemSolicitacao);

            // O hash impede que o mesmo conteúdo seja enviado duas vezes em sequência.
            const payloadFingerprint = crypto
                .createHash('md5')
                .update(JSON.stringify({ channel: destino.channelId, tipo: interaction.customId, autor: interaction.user.id, embed }))
                .digest('hex');

            const sendKey = `${destino.channelId}:${payloadFingerprint}`;
            if (recentSends.has(sendKey)) {
                debug('Duplicate send suppressed for key:', sendKey);
                await interaction.editReply('Solicitação já enviada — evitando duplicata.');
                return;
            }

            recentSends.set(sendKey, Date.now());
            debug('Registered send fingerprint:', sendKey);

            const mensagemEnviada = await canal.send({
                content: `<@&${suporteRoleId}>`,
                embeds: [embed],
                allowedMentions: {
                    roles: [suporteRoleId],
                    users: [interaction.user.id]
                }
            });

            debug('Message sent:', mensagemEnviada.id, mensagemEnviada.url, 'for', sendKey);
            await interaction.editReply(`Solicitação enviada com sucesso para ${destino.nome}: ${mensagemEnviada.url}`);
        }
    } catch (erro) {
        if (erro && erro.code && (erro.code === 10062 || erro.code === 40060)) {
            debug('Ignored Discord interaction error:', erro.code, erro.message);
            return;
        }

        console.error('Erro ao processar interação:', erro);

        const mensagemErro = 'Ocorreu um erro ao processar a solicitação. Verifique o console do bot.';

        try {
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply(mensagemErro).catch(() => {});
            } else {
                await interaction.reply({
                    content: mensagemErro,
                    flags: MessageFlags.Ephemeral
                }).catch(() => {});
            }
        } catch (err2) {
            console.error('Erro ao tentar notificar usuário sobre erro:', err2);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
