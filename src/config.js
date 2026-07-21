require('dotenv').config();

const variaveisObrigatorias = [
    'DISCORD_TOKEN',
    'SUPORTE_ROLE_ID'
];

for (const variavel of variaveisObrigatorias) {
    if (!process.env[variavel]) {
        throw new Error(`A variável ${variavel} não foi configurada no arquivo .env.`);
    }
}

const ENV = {
    GUILD_ID_ACESSO_NUVEM: (process.env.GUILD_ID_ACESSO_NUVEM || '').trim(),
    CHANNEL_ID_ACESSO_NUVEM: (process.env.CHANNEL_ID_ACESSO_NUVEM || '').trim(),
    GUILD_ID_COMUNICADOR: (process.env.GUILD_ID_COMUNICADOR || '').trim(),
    CHANNEL_ID_COMUNICADOR: (process.env.CHANNEL_ID_COMUNICADOR || '').trim(),
    GUILD_ID_CRIACAO_VM: (process.env.GUILD_ID_CRIACAO_VM || '').trim(),
    CHANNEL_ID_CRIACAO_VM: (process.env.CHANNEL_ID_CRIACAO_VM || '').trim(),
    GUILD_ID_IDCLOUD: (process.env.GUILD_ID_IDCLOUD || '').trim(),
    CHANNEL_ID_IDCLOUD: (process.env.CHANNEL_ID_IDCLOUD || process.env.CHANNEL_ID || '').trim(),
    CHANNEL_ID: (process.env.CHANNEL_ID || '').trim()
};

module.exports = {
    ENV
};
