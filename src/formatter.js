const { obterCampo, formatarEquipamentos } = require('./utils');

/** Normaliza uma data com oito dígitos para o formato brasileiro DD/MM/AAAA. */
function formatarData(data) {
    const somenteNumeros = data.replace(/\D/g, '');

    if (somenteNumeros.length === 8) {
        return `${somenteNumeros.slice(0, 2)}/${somenteNumeros.slice(2, 4)}/${somenteNumeros.slice(4)}`;
    }

    return data;
}

/**
 * Lê e higieniza os campos do modal e monta a mensagem Markdown enviada ao suporte.
 * Retorna null caso o identificador do modal não seja reconhecido.
 */
function criarMensagemSolicitacao(interaction, tipo, suporteRoleId) {
    if (tipo === 'modal_licenca_facial') {
        const acaoSelecionada = interaction.fields.getCheckboxGroup('acao_licenca')[0];
        const nomesDasAcoes = {
            envio: 'Envio de licença',
            troca: 'Troca de licença',
            cancelamento: 'Cancelamento de licença'
        };
        const ticket = obterCampo(interaction, 'ticket');
        const prioridade = interaction.fields.getCheckbox('prioridade');

        const linhas = [
            '**Solicitação de licença facial**'
        ];

        if (prioridade) {
            linhas.push('', '# 🚨 PRIORIDADE 🚨', '', '**ATENDIMENTO PRIORITÁRIO SOLICITADO**');
        }

        linhas.push(
            '',
            `**Ação**: ${nomesDasAcoes[acaoSelecionada] || acaoSelecionada}`,
            '',
            `**Ticket**: ${ticket}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        );

        return linhas.join('\n');
    }

    if (tipo === 'modal_criacao_id_cloud') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            'Por gentileza, criar este **iD Cloud**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_criacao_secullum') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            'Por gentileza, criar este **Secullum Comunicador**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_criacao_acesso_nuvem') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            'Por gentileza, criar este **Acesso Nuvem**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_renovacao_registro') {
        const revenda = obterCampo(interaction, 'revenda');
        const linkCliente = obterCampo(interaction, 'link_cliente');
        const dataValidade = formatarData(obterCampo(interaction, 'data_validade'));
        const tipoRegistro = interaction.fields.getStringSelectValues('tipo_registro')[0];
        const observacoes = obterCampo(interaction, 'observacoes');

        const observacoesFormatadas = observacoes
            ? observacoes
            : 'Técnico / Case / Ticket não informados';

        return [
            '**Renovação de registro**',
            '',
            `**Revenda**: ${revenda}`,
            '',
            `**Link do cliente**: ${linkCliente}`,
            '',
            `**Data da validade**: ${dataValidade}`,
            '',
            `**Tipo de registro**: ${tipoRegistro}`,
            '',
            `**Técnico / Case / Ticket**: ${observacoesFormatadas}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (
        tipo === 'modal_adicao_equipamento_acesso_nuvem' ||
        tipo === 'modal_remocao_equipamento_acesso_nuvem'
    ) {
        const adicionando = tipo === 'modal_adicao_equipamento_acesso_nuvem';
        const equipamento = obterCampo(interaction, 'equipamento');
        const linkCliente = obterCampo(interaction, 'link_cliente');
        const caseServico = obterCampo(interaction, 'case');
        const ticket = obterCampo(interaction, 'ticket');

        return [
            adicionando ? '**Adicionar equipamento no Acesso Nuvem**' : '**Remover equipamento do Acesso Nuvem**',
            '',
            `**Nome e número do equipamento**: ${equipamento}`,
            '',
            `**Link**: ${linkCliente}`,
            '',
            `**Case**: ${caseServico}`,
            '',
            `**Ticket**: ${ticket}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_cancelamento_acesso_nuvem') {
        const linkCliente = obterCampo(interaction, 'link_cliente');
        const ticketCancelamento = obterCampo(interaction, 'ticket_cancelamento');
        const caseServicoDetalhe = obterCampo(interaction, 'case');

        return [
            '**Cancelamento de acesso nuvem**',
            '',
            `**Link do cliente**: ${linkCliente}`,
            '',
            `**Ticket de Cancelamento**: ${ticketCancelamento}`,
            '',
            `**Case**: ${caseServicoDetalhe}`,
            '',
            `**Solicitado por**: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_reinicio_agente') {
        const banco = obterCampo(interaction, 'banco');
        const revenda = obterCampo(interaction, 'revenda');
        const equipamento = obterCampo(interaction, 'equipamento') || 'todos';
        const verificacaoWebService = interaction.fields
            .getCheckboxGroup('verificacao_web_service')[0];
        const statusVerificacao = verificacaoWebService === 'sim'
            ? 'Sim, foi verificado'
            : 'Não foi verificado';

        return [
            '**Reinício de agente**',
            '',
            `**Banco**: ${banco}`,
            '',
            `**Revenda**: ${revenda}`,
            '',
            `**Equipamento**: ${equipamento}`,
            '',
            `**Configurações do Web Service verificadas**: ${statusVerificacao}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (
        tipo === 'modal_adicao_equipamento_comunicador' ||
        tipo === 'modal_cancelamento_equipamento_comunicador'
    ) {
        const adicionando = tipo === 'modal_adicao_equipamento_comunicador';
        const revenda = obterCampo(interaction, 'revenda');
        const banco = obterCampo(interaction, 'banco');
        const equipamento = obterCampo(interaction, 'equipamento');
        const portaServidor = adicionando ? null : obterCampo(interaction, 'porta_servidor');

        const linhas = [
            adicionando ? '**Adicionar equipamento no Comunicador**' : '**Cancelar equipamento no Comunicador**',
            '',
            `**Revenda**: ${revenda}`,
            '',
            `**Banco**: ${banco}`,
            '',
            `**Equipamento**: ${equipamento}`
        ];

        if (portaServidor) {
            linhas.push('', `**Porta do servidor**: ${portaServidor}`);
        }

        linhas.push('', `Solicitado por: <@${interaction.user.id}>`);

        return linhas.join('\n');
    }

    if (tipo === 'modal_cancelamento_agente') {
        const banco = obterCampo(interaction, 'banco');
        const ticketCancelamento = obterCampo(interaction, 'ticket_cancelamento');
        const caseOriginal = obterCampo(interaction, 'case');

        return [
            '**Cancelamento de agente**',
            '',
            `**Banco**: ${banco}`,
            '',
            `**Ticket da solicitação de cancelamento**: ${ticketCancelamento}`,
            '',
            `**Case original**: ${caseOriginal}`,
            '',
            `**Solicitado por**: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_cancelamento') {
        const banco = obterCampo(interaction, 'banco');
        const ticketContratacao = obterCampo(interaction, 'ticket_contratacao');
        const ticketCancelamento = obterCampo(interaction, 'ticket_cancelamento');
        const caseServicoDetalhe = obterCampo(interaction, 'case');

        const linhas = [
            'Por gentileza, cancelar este **iD Cloud**.',
            '',
            `**Banco:** ${banco}`,
            '',
            `**Ticket de contratação:** ${ticketContratacao}`
        ];

        if (ticketCancelamento && ticketCancelamento !== ticketContratacao) {
            linhas.push('', `**Ticket de cancelamento:** ${ticketCancelamento}`);
        }

        linhas.push('', `**Case:** ${caseServicoDetalhe}`, '', `**Solicitado por**: <@${interaction.user.id}>`);

        return linhas.join('\n');
    }

    if (tipo === 'modal_adicao') {
        const banco = obterCampo(interaction, 'banco');
        const equipamentos = obterCampo(interaction, 'equipamentos');
        const ticket = obterCampo(interaction, 'ticket');
        const caseServicoDetalhe = obterCampo(interaction, 'case');

        return [
            'Por gentileza, adicionar os seguintes equipamentos neste **iD Cloud**:',
            '',
            formatarEquipamentos(equipamentos),
            '',
            `**Banco:** ${banco}`,
            '',
            `**Ticket da solicitação:** ${ticket}`,
            '',
            `**Case:** ${caseServicoDetalhe}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_remocao') {
        const banco = obterCampo(interaction, 'banco');
        const equipamentos = obterCampo(interaction, 'equipamentos');
        const ticket = obterCampo(interaction, 'ticket');
        const caseServicoDetalhe = obterCampo(interaction, 'case');

        return [
            'Por gentileza, remover os seguintes equipamentos deste **iD Cloud**:',
            '',
            formatarEquipamentos(equipamentos),
            '',
            `**Banco:** ${banco}`,
            '',
            `**Ticket da solicitação:** ${ticket}`,
            '',
            `**Case:** ${caseServicoDetalhe}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    return null;
}

module.exports = {
    criarMensagemSolicitacao
};
