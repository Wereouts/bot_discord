const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require('discord.js');

function criarCampo({
    id,
    titulo,
    placeholder,
    estilo = TextInputStyle.Short,
    obrigatorio = true,
    tamanhoMaximo = 1000
}) {
    return new TextInputBuilder()
        .setCustomId(id)
        .setLabel(titulo)
        .setPlaceholder(placeholder)
        .setStyle(estilo)
        .setRequired(obrigatorio)
        .setMaxLength(tamanhoMaximo);
}

function adicionarCamposAoModal(modal, campos) {
    const linhas = campos.map(campo => new ActionRowBuilder().addComponents(campo));
    modal.addComponents(...linhas);
    return modal;
}

function criarModal(tipo) {
    switch (tipo) {
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
            const modal = new ModalBuilder()
                .setCustomId('modal_renovacao_registro')
                .setTitle('Renovação de registro');

            return adicionarCamposAoModal(modal, [
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
                    titulo: 'Data da validade',
                    placeholder: 'Exemplo: 08/06/2027'
                }),
                criarCampo({
                    id: 'tipo_registro',
                    titulo: 'Tipo de registro',
                    placeholder: 'mensalidade ou anuidade'
                }),
                criarCampo({
                    id: 'observacoes',
                    titulo: 'Observações (técnico / case / ticket)',
                    placeholder: 'William;\nhttps://...;\n253781',
                    estilo: TextInputStyle.Paragraph,
                    tamanhoMaximo: 1500
                })
            ]);
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

            return adicionarCamposAoModal(modal, [
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
        }

        case 'adicao': {
            const modal = new ModalBuilder()
                .setCustomId('modal_adicao')
                .setTitle('Adicionar equipamentos');

            return adicionarCamposAoModal(modal, [
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
        }

        case 'remocao': {
            const modal = new ModalBuilder()
                .setCustomId('modal_remocao')
                .setTitle('Remover equipamentos');

            return adicionarCamposAoModal(modal, [
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
        }

        default:
            return null;
    }
}

module.exports = {
    criarModal
};
