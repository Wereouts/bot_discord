/** Retorna se as mensagens de diagnóstico foram habilitadas por DEBUG=true. */
function isDebugMode() {
    return process.env.DEBUG === 'true';
}

/** Escreve uma mensagem com data/hora no console somente durante o modo de depuração. */
function debug(...args) {
    if (!isDebugMode()) {
        return;
    }

    console.log(new Date().toISOString(), ...args);
}

/**
 * Responde a uma interação do Discord sem propagar erros de interação expirada ou já respondida.
 * Retorna o resultado da API ou null quando o envio falha.
 */
async function safeReply(interaction, options) {
    try {
        return await interaction.reply(options);
    } catch (err) {
        debug('safeReply error:', err && err.code ? `${err.code} ${err.message}` : err);
        return null;
    }
}

/** Exibe um modal com tratamento seguro de erros e retorna null em caso de falha. */
async function safeShowModal(interaction, modal) {
    try {
        return await interaction.showModal(modal);
    } catch (err) {
        console.error('Erro ao exibir modal:', err);
        return null;
    }
}

/** Adia a resposta de uma interação com tratamento seguro de erros. */
async function safeDeferReply(interaction, options) {
    try {
        return await interaction.deferReply(options);
    } catch (err) {
        debug('safeDeferReply error:', err && err.code ? `${err.code} ${err.message}` : err);
        return null;
    }
}

/**
 * Remove espaços externos e neutraliza menções que poderiam notificar usuários ou cargos.
 */
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

/** Obtém um campo de texto do modal e devolve seu conteúdo já higienizado. */
function obterCampo(interaction, id) {
    return limparTexto(interaction.fields.getTextInputValue(id));
}

/** Converte uma lista de equipamentos, um por linha, em uma lista Markdown. */
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
