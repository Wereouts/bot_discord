require('dotenv').config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const variaveisObrigatorias = [
    'DISCORD_TOKEN',
    'CLIENT_ID'
];

for (const variavel of variaveisObrigatorias) {
    if (!process.env[variavel]) {
        throw new Error(`A variável ${variavel} não foi configurada no arquivo .env.`);
    }
}

const comandos = [
    new SlashCommandBuilder()
        .setName('solicitar')
        .setDescription('Abre o painel de solicitações do bot')
        .toJSON()
];

const guildIds = [
    process.env.GUILD_ID_IDCLOUD,
    process.env.GUILD_ID_ACESSO_NUVEM,
    process.env.GUILD_ID_COMUNICADOR,
    process.env.GUILD_ID_CRIACAO_VM
].filter(Boolean);

const rest = new REST({ version: '10' })
    .setToken(process.env.DISCORD_TOKEN);

async function registrarComandos() {
    try {
        console.log('Registrando o comando /solicitar...');

        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                {
                    body: comandos
                }
            );

            console.log(`Comando registrado no guild ${guildId}.`);
        }

        console.log('Comando registrado com sucesso.');
    } catch (erro) {
        console.error('Não foi possível registrar o comando:', erro);
        process.exitCode = 1;
    }
}

registrarComandos();