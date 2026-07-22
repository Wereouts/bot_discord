const {
    ActionRowBuilder,
    CheckboxBuilder,
    CheckboxGroupBuilder,
    CheckboxGroupOptionBuilder,
    LabelBuilder,
    ModalBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

function criarCampo({
    id,
    titulo,
    placeholder,
    estilo = TextInputStyle.Short,
    obrigatorio = true,
    tamanhoMinimo,
    tamanhoMaximo = 1000
}) {
    const campo = new TextInputBuilder()
        .setCustomId(id)
        .setLabel(titulo)
        .setPlaceholder(placeholder)
        .setStyle(estilo)
        .setRequired(obrigatorio)
        .setMaxLength(tamanhoMaximo);

    if (tamanhoMinimo !== undefined) {
        campo.setMinLength(tamanhoMinimo);
    }

    return campo;
}

function adicionarCamposAoModal(modal, campos) {
    const linhas = campos.map(campo => new ActionRowBuilder().addComponents(campo));
    modal.addComponents(...linhas);
    return modal;
}

function adicionarStatusAtualizacaoCase(modal) {
    const opcaoAtualizada = new CheckboxGroupOptionBuilder()
        .setLabel('Confirmo que a case foi atualizada')
        .setValue('atualizada');

    const checkbox = new CheckboxGroupBuilder()
        .setCustomId('case_atualizada')
        .addOptions(opcaoAtualizada)
        .setMinValues(1)
        .setMaxValues(1)
        .setRequired(true);

    const label = new LabelBuilder()
        .setLabel('⚠ Atualização obrigatória da case')
        .setDescription('Marque a confirmação abaixo para enviar a solicitação.')
        .setCheckboxGroupComponent(checkbox);

    modal.addLabelComponents(label);
    return modal;
}

function obterDataMinimaMensalidadeFormatada() {
    const partes = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());
    const valor = tipo => Number(partes.find(parte => parte.type === tipo).value);
    const hoje = new Date(Date.UTC(valor('year'), valor('month') - 1, valor('day')));
    const ano = hoje.getUTCFullYear();
    const mesSeguinte = hoje.getUTCMonth() + 1;
    const ultimoDia = new Date(Date.UTC(ano, mesSeguinte + 1, 0)).getUTCDate();
    const dataMinima = new Date(Date.UTC(
        ano,
        mesSeguinte,
        Math.min(hoje.getUTCDate(), ultimoDia)
    ));
    dataMinima.setUTCDate(dataMinima.getUTCDate() + 1);

    const dia = String(dataMinima.getUTCDate()).padStart(2, '0');
    const mes = String(dataMinima.getUTCMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${dataMinima.getUTCFullYear()}`;
}

function criarModal(tipo) {
    switch (tipo) {
        case 'licenca_facial': {
            const modal = new ModalBuilder()
                .setCustomId('modal_licenca_facial')
                .setTitle('Solicitação de licença facial');

            const opcoes = [
                ['Envio de licença', 'envio'],
                ['Troca de licença', 'troca'],
                ['Cancelamento de licença', 'cancelamento']
            ].map(([label, value]) =>
                new CheckboxGroupOptionBuilder()
                    .setLabel(label)
                    .setValue(value)
            );

            const acoes = new CheckboxGroupBuilder()
                .setCustomId('acao_licenca')
                .addOptions(...opcoes)
                .setMinValues(1)
                .setMaxValues(1)
                .setRequired(true);

            const labelAcoes = new LabelBuilder()
                .setLabel('O que gostaria de fazer?')
                .setDescription('Marque somente uma opção.')
                .setCheckboxGroupComponent(acoes);

            modal.addLabelComponents(labelAcoes);

            const prioridade = new CheckboxBuilder()
                .setCustomId('prioridade')
                .setDefault(false);

            const labelPrioridade = new LabelBuilder()
                .setLabel('Prioridade')
                .setDescription('Marque somente se esta solicitação for prioritária.')
                .setCheckboxComponent(prioridade);

            modal.addLabelComponents(labelPrioridade);
            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'ticket',
                    titulo: 'Ticket',
                    placeholder: 'https://app.octadesk.com/ticket/edit/111111'
                })
            ]);

            return modal;
        }

        case 'criacao':
        case 'criacao_id_cloud': {
            const modal = new ModalBuilder()
                .setCustomId('modal_criacao_id_cloud')
                .setTitle('Criação de iD Cloud');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'case',
                    titulo: 'Case contratação',
                    placeholder: 'Cole o link da case'
                })
            ]);
        }

        case 'criacao_secullum': {
            const modal = new ModalBuilder()
                .setCustomId('modal_criacao_secullum')
                .setTitle('Criação de Secullum Comunicador');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'case',
                    titulo: 'Case contratação',
                    placeholder: 'Cole o link da case'
                })
            ]);
        }

        case 'criacao_acesso_nuvem': {
            const modal = new ModalBuilder()
                .setCustomId('modal_criacao_acesso_nuvem')
                .setTitle('Criação de Acesso Nuvem');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'case',
                    titulo: 'Case contratação',
                    placeholder: 'Cole o link da case'
                })
            ]);
        }

        case 'renovacao_registro': {
            const dataMinimaMensalidade = obterDataMinimaMensalidadeFormatada();
            const modal = new ModalBuilder()
                .setCustomId('modal_renovacao_registro')
                .setTitle('Renovação de registro');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'revenda',
                    titulo: 'Revenda',
                    placeholder: 'Exemplo: Controle Soluções'
                }),
                criarCampo({
                    id: 'link_cliente',
                    titulo: 'Link do cliente',
                    placeholder: 'Cole o link do cliente'
                }),
                criarCampo({
                    id: 'data_validade',
                    titulo: `Data (Mensalidade: mín. ${dataMinimaMensalidade})`,
                    placeholder: 'Ex.: 22072026 será formatado como 22/07/2026',
                    tamanhoMaximo: 10
                })
            ]);

            const seletorTipoRegistro = new StringSelectMenuBuilder()
                .setCustomId('tipo_registro')
                .setPlaceholder('Selecione Mensalidade ou Anuidade')
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Mensalidade')
                        .setValue('Mensalidade'),
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Anuidade')
                        .setValue('Anuidade')
                );

            const labelTipoRegistro = new LabelBuilder()
                .setLabel('Tipo de registro')
                .setDescription(`Mensalidade exige no mínimo ${dataMinimaMensalidade}.`)
                .setStringSelectMenuComponent(seletorTipoRegistro);

            modal.addLabelComponents(labelTipoRegistro);

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'observacoes',
                    titulo: 'Observações (técnico / case / ticket)',
                    placeholder: 'William;\nhttps://...;\n253781',
                    estilo: TextInputStyle.Paragraph,
                    tamanhoMaximo: 1500
                })
            ]);

            return modal;
        }

        case 'adicao_equipamento_acesso_nuvem':
        case 'remocao_equipamento_acesso_nuvem': {
            const adicionando = tipo === 'adicao_equipamento_acesso_nuvem';
            const modal = new ModalBuilder()
                .setCustomId(adicionando
                    ? 'modal_adicao_equipamento_acesso_nuvem'
                    : 'modal_remocao_equipamento_acesso_nuvem')
                .setTitle(adicionando
                    ? '⚠ ADICIONAR — ATUALIZE A CASE'
                    : '⚠ REMOVER — ATUALIZE A CASE');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'equipamento',
                    titulo: 'Nome e número do equipamento',
                    placeholder: 'Exemplo: Evo REP-C - 123456'
                }),
                criarCampo({
                    id: 'link_cliente',
                    titulo: 'Link',
                    placeholder: 'Cole o link do cliente'
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case',
                    placeholder: 'Cole o link da case'
                }),
                criarCampo({
                    id: 'ticket',
                    titulo: 'Ticket',
                    placeholder: 'Cole o link ou número do ticket'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        case 'cancelamento_acesso_nuvem': {
            const modal = new ModalBuilder()
                .setCustomId('modal_cancelamento_acesso_nuvem')
                .setTitle('Cancelamento de acesso nuvem');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'link_cliente',
                    titulo: 'Link do cliente',
                    placeholder: 'Cole o link do cliente'
                }),
                criarCampo({
                    id: 'ticket_cancelamento',
                    titulo: 'Ticket de cancelamento',
                    placeholder: 'Exemplo: 246402'
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case',
                    placeholder: 'Cole o link da case'
                })
            ]);
        }

        case 'reinicio_agente': {
            const modal = new ModalBuilder()
                .setCustomId('modal_reinicio_agente')
                .setTitle('Reinício de agente');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'banco',
                    titulo: 'Banco',
                    placeholder: 'Exemplo: 49788 - SARTOR INTERNET LTDA'
                }),
                criarCampo({
                    id: 'revenda',
                    titulo: 'Revenda',
                    placeholder: 'Exemplo: Casa do Computador'
                }),
                criarCampo({
                    id: 'equipamento',
                    titulo: 'Equipamento',
                    placeholder: 'Informe o equipamento ou todos'
                })
            ]);
        }

        case 'adicao_equipamento_comunicador': {
            const modal = new ModalBuilder()
                .setCustomId('modal_adicao_equipamento_comunicador')
                .setTitle('⚠ ADICIONAR — ATUALIZE A CASE');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'revenda',
                    titulo: 'Revenda',
                    placeholder: 'Exemplo: Digimatec'
                }),
                criarCampo({
                    id: 'banco',
                    titulo: 'Banco',
                    placeholder: 'Exemplo: 76741 - MERCADO TUDO BOM'
                }),
                criarCampo({
                    id: 'equipamento',
                    titulo: 'Equipamento',
                    placeholder: 'Exemplo: Evo - REP C / EVO REP-C FACIAL'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        case 'cancelamento_equipamento_comunicador': {
            const modal = new ModalBuilder()
                .setCustomId('modal_cancelamento_equipamento_comunicador')
                .setTitle('⚠ CANCELAR — ATUALIZE A CASE');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'revenda',
                    titulo: 'Revenda',
                    placeholder: 'Exemplo: Digimatec'
                }),
                criarCampo({
                    id: 'banco',
                    titulo: 'Banco',
                    placeholder: 'Exemplo: 76741 - MERCADO TUDO BOM'
                }),
                criarCampo({
                    id: 'equipamento',
                    titulo: 'Equipamento',
                    placeholder: 'Exemplo: Evo - REP C'
                }),
                criarCampo({
                    id: 'porta_servidor',
                    titulo: 'Porta do servidor',
                    placeholder: 'Exemplo: 111111'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        case 'cancelamento_agente': {
            const modal = new ModalBuilder()
                .setCustomId('modal_cancelamento_agente')
                .setTitle('Cancelamento de agente');

            return adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'banco',
                    titulo: 'Banco',
                    placeholder: 'Exemplo: 49788 - SARTOR INTERNET LTDA'
                }),
                criarCampo({
                    id: 'ticket_cancelamento',
                    titulo: 'Ticket da solicitação de cancelamento',
                    placeholder: 'Cole o link do ticket'
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case original',
                    placeholder: 'Cole o link da case'
                })
            ]);
        }

        case 'cancelamento': {
            const modal = new ModalBuilder()
                .setCustomId('modal_cancelamento')
                .setTitle('Cancelamento de iD Cloud');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'banco',
                    titulo: 'Número do banco',
                    placeholder: 'Exemplo: 123456',
                    tamanhoMaximo: 30
                }),
                criarCampo({
                    id: 'ticket_contratacao',
                    titulo: 'Ticket de contratação',
                    placeholder: 'Cole o link do ticket'
                }),
                criarCampo({
                    id: 'ticket_cancelamento',
                    titulo: 'Ticket de cancelamento',
                    placeholder: 'Deixe vazio se for o mesmo ticket',
                    obrigatorio: false
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case do serviço',
                    placeholder: 'Cole o link da case'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        case 'adicao': {
            const modal = new ModalBuilder()
                .setCustomId('modal_adicao')
                .setTitle('Adicionar equipamentos');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'banco',
                    titulo: 'Número do banco',
                    placeholder: 'Exemplo: 123456',
                    tamanhoMaximo: 30
                }),
                criarCampo({
                    id: 'equipamentos',
                    titulo: 'Equipamentos que serão adicionados',
                    placeholder: 'Informe um equipamento por linha',
                    estilo: TextInputStyle.Paragraph,
                    tamanhoMaximo: 1500
                }),
                criarCampo({
                    id: 'ticket',
                    titulo: 'Ticket da solicitação',
                    placeholder: 'Cole o link do ticket'
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case do serviço',
                    placeholder: 'Cole o link da case'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        case 'remocao': {
            const modal = new ModalBuilder()
                .setCustomId('modal_remocao')
                .setTitle('Remover equipamentos');

            adicionarCamposAoModal(modal, [
                criarCampo({
                    id: 'banco',
                    titulo: 'Número do banco',
                    placeholder: 'Exemplo: 123456',
                    tamanhoMaximo: 30
                }),
                criarCampo({
                    id: 'equipamentos',
                    titulo: 'Equipamentos que serão removidos',
                    placeholder: 'Informe um equipamento por linha',
                    estilo: TextInputStyle.Paragraph,
                    tamanhoMaximo: 1500
                }),
                criarCampo({
                    id: 'ticket',
                    titulo: 'Ticket da solicitação',
                    placeholder: 'Cole o link do ticket'
                }),
                criarCampo({
                    id: 'case',
                    titulo: 'Case do serviço',
                    placeholder: 'Cole o link da case'
                })
            ]);

            return adicionarStatusAtualizacaoCase(modal);
        }

        default:
            return null;
    }
}

module.exports = {
    criarModal
};
