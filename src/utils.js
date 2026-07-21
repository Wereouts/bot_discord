function isDebugMode() {
    return process.env.DEBUG === 'true';
}

function debug(...args) {
    if (!isDebugMode()) {
        return;
    }

    console.log(new Date().toISOString(), ...args);
}

async function safeReply(interaction, options) {
    try {
        return await interaction.reply(options);
    } catch (err) {
        debug('safeReply error:', err && err.code ? `${err.code} ${err.message}` : err);
        return null;
    }
}

async function safeShowModal(interaction, modal) {
    try {
        return await interaction.showModal(modal);
    } catch (err) {
        debug('safeShowModal error:', err && err.code ? `${err.code} ${err.message}` : err);
        return null;
    }
}

async function safeDeferReply(interaction, options) {
    try {
        return await interaction.deferReply(options);
    } catch (err) {
        debug('safeDeferReply error:', err && err.code ? `${err.code} ${err.message}` : err);
        return null;
    }
}

function limparTexto(texto) {
    if (!texto) {
        return '';
    }

    return texto
        .replaceAll('@everyone', '@everyone')
        .replaceAll('@here', '@here')
        .replaceAll('<@', '<@')
        .trim();
}

function obterCampo(interaction, id) {
    return limparTexto(interaction.fields.getTextInputValue(id));
}

function formatarEquipamentos(texto) {
    const equipamentos = texto
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);

    if (equipamentos.length === 0) {
        return 'Não informado';
    }

    return equipamentos
        .map(item => `• ${item}`)
        .join('\n');
}

module.exports = {
    debug,
    safeReply,
    safeShowModal,
    safeDeferReply,
    limparTexto,
    obterCampo,
    formatarEquipamentos
};
