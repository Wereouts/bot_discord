async function resolverCanalDestino(client, destino) {
    if (destino.channelId) {
        try {
            const canal = await client.channels.fetch(destino.channelId);
            if (canal && canal.isTextBased()) {
                return canal;
            }
        } catch {
            // continua para o fallback de guilda
        }
    }

    if (!destino.guildId) {
        return null;
    }

    try {
        const guild = await client.guilds.fetch(destino.guildId);
        return guild.channels.cache.find(canal => canal.isTextBased()) || null;
    } catch {
        return null;
    }
}

function obterDestinoPorTipo(tipo, ENV) {
    switch (tipo) {
        case 'modal_licenca_facial':
            return {
                nome: 'Licença Facial',
                guildId: '',
                channelId: ENV.CHANNEL_ID_LICENCA
            };
        case 'modal_renovacao_registro':
        case 'modal_cancelamento_acesso_nuvem':
        case 'modal_adicao_equipamento_acesso_nuvem':
        case 'modal_remocao_equipamento_acesso_nuvem':
            return {
                nome: 'Acesso Nuvem',
                guildId: ENV.GUILD_ID_ACESSO_NUVEM,
                channelId: ENV.CHANNEL_ID_ACESSO_NUVEM || ENV.CHANNEL_ID_IDCLOUD || ENV.CHANNEL_ID
            };
        case 'modal_reinicio_agente':
        case 'modal_cancelamento_agente':
        case 'modal_adicao_equipamento_comunicador':
        case 'modal_cancelamento_equipamento_comunicador':
            return {
                nome: 'Comunicador',
                guildId: ENV.GUILD_ID_COMUNICADOR,
                channelId: ENV.CHANNEL_ID_COMUNICADOR || ENV.CHANNEL_ID_IDCLOUD || ENV.CHANNEL_ID
            };
        case 'modal_criacao_secullum':
        case 'modal_criacao_acesso_nuvem':
        case 'modal_criacao_id_cloud':
            return {
                nome: 'Criação VM',
                guildId: ENV.GUILD_ID_CRIACAO_VM,
                channelId: ENV.CHANNEL_ID_CRIACAO_VM || ENV.CHANNEL_ID_IDCLOUD || ENV.CHANNEL_ID
            };
        default:
            return {
                nome: 'iD Cloud',
                guildId: ENV.GUILD_ID_IDCLOUD,
                channelId: ENV.CHANNEL_ID_IDCLOUD || ENV.CHANNEL_ID
            };
    }
}

module.exports = {
    obterDestinoPorTipo,
    resolverCanalDestino
};
