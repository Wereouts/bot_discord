const { debug } = require('./utils');

function obterOpcoesDoCanal(interaction, ENV) {
    const canalId = interaction.channelId;
    const guildId = interaction.guildId;

    debug('Building menu for channel:', canalId, 'guild:', guildId);

    if (canalId && canalId === ENV.CHANNEL_ID_LICENCA) {
        debug('Menu: matched Licença Facial');
        return [
            {
                label: 'Solicitação de licença facial',
                description: 'Envio, troca ou cancelamento de licença',
                value: 'licenca_facial',
                emoji: '🪪'
            }
        ];
    }

    if (
        (canalId && canalId === ENV.CHANNEL_ID_ACESSO_NUVEM) ||
        (guildId && guildId === ENV.GUILD_ID_ACESSO_NUVEM)
    ) {
        debug('Menu: matched Acesso Nuvem');
        return [
            {
                label: 'Adicionar equipamento',
                description: 'Adicionar equipamento ao Acesso Nuvem',
                value: 'adicao_equipamento_acesso_nuvem',
                emoji: '➕'
            },
            {
                label: 'Remover equipamento',
                description: 'Remover equipamento do Acesso Nuvem',
                value: 'remocao_equipamento_acesso_nuvem',
                emoji: '➖'
            },
            {
                label: 'Renovação de registro',
                description: 'Renovação de registro',
                value: 'renovacao_registro',
                emoji: '📝'
            },
            {
                label: 'Cancelamento de acesso nuvem',
                description: 'Cancelamento de acesso nuvem',
                value: 'cancelamento_acesso_nuvem',
                emoji: '❌'
            }
        ];
    }

    if (
        (canalId && canalId === ENV.CHANNEL_ID_COMUNICADOR) ||
        (guildId && guildId === ENV.GUILD_ID_COMUNICADOR)
    ) {
        debug('Menu: matched Comunicador');
        return [
            {
                label: 'Adicionar equipamento',
                description: 'Adicionar equipamento no Comunicador',
                value: 'adicao_equipamento_comunicador',
                emoji: '➕'
            },
            {
                label: 'Cancelar equipamento',
                description: 'Cancelar equipamento no Comunicador',
                value: 'cancelamento_equipamento_comunicador',
                emoji: '➖'
            },
            {
                label: 'Reinício de agente de comunicação',
                description: 'Reinício de agente de comunicação',
                value: 'reinicio_agente',
                emoji: '🔄'
            },
            {
                label: 'Cancelamento de agente de comunicação',
                description: 'Cancelamento de agente de comunicação',
                value: 'cancelamento_agente',
                emoji: '🛑'
            }
        ];
    }

    if (
        (canalId && canalId === ENV.CHANNEL_ID_CRIACAO_VM) ||
        (guildId && guildId === ENV.GUILD_ID_CRIACAO_VM)
    ) {
        debug('Menu: matched Criacao VM');
        return [
            {
                label: 'Criar Secullum Comunicador',
                description: 'Criação de Secullum Comunicador',
                value: 'criacao_secullum',
                emoji: '📢'
            },
            {
                label: 'Criar Acesso Nuvem',
                description: 'Criação de Acesso Nuvem',
                value: 'criacao_acesso_nuvem',
                emoji: '☁️'
            },
            {
                label: 'Criar iD Cloud',
                description: 'Criação de iD Cloud',
                value: 'criacao_id_cloud',
                emoji: '💻'
            }
        ];
    }

    debug('Menu: matched Default');

    return [
        {
            label: 'Cancelamento',
            description: 'Cancelar um iD Cloud',
            value: 'cancelamento',
            emoji: '🗑️'
        },
        {
            label: 'Adicionar equipamento',
            description: 'Adicionar equipamentos ao iD Cloud',
            value: 'adicao',
            emoji: '➕'
        },
        {
            label: 'Remover equipamento',
            description: 'Remover equipamentos do iD Cloud',
            value: 'remocao',
            emoji: '➖'
        }
    ];
}

module.exports = {
    obterOpcoesDoCanal
};
