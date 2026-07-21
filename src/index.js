const { Client, GatewayIntentBits, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
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
client.once('ready', bot => {
    debug('Bot conectado como', bot.user.tag);
});

client.on('interactionCreate', async interaction => {
    try {
        if (processedInteractions.has(interaction.id)) {
            debug('Ignored duplicate interaction:', interaction.id, interaction.type);
            return;
        }

        processedInteractions.set(interaction.id, Date.now());

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
            }
            return;
        }

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

            const mensagem = criarMensagemSolicitacao(interaction, interaction.customId, process.env.SUPORTE_ROLE_ID);
            if (!mensagem) {
                await interaction.editReply('Não foi possível identificar o tipo da solicitação.');
                return;
            }

            const payloadFingerprint = crypto
                .createHash('md5')
                .update(JSON.stringify({ channel: destino.channelId, tipo: interaction.customId, autor: interaction.user.id, mensagem }))
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
                content: mensagem,
                allowedMentions: {
                    roles: [process.env.SUPORTE_ROLE_ID],
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
