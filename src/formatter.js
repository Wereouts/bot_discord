const { obterCampo, formatarEquipamentos } = require('./utils');

function criarMensagemSolicitacao(interaction, tipo, suporteRoleId) {
    if (tipo === 'modal_criacao_id_cloud') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
            'Por gentileza, criar este **iD Cloud**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_criacao_secullum') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
            'Por gentileza, criar este **Secullum Comunicador**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_criacao_acesso_nuvem') {
        const caseServico = obterCampo(interaction, 'case');
        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
            'Por gentileza, criar este **Acesso Nuvem**:',
            caseServico,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_renovacao_registro') {
        const revenda = obterCampo(interaction, 'revenda');
        const linkCliente = obterCampo(interaction, 'link_cliente');
        const dataValidade = obterCampo(interaction, 'data_validade');
        const tipoRegistro = obterCampo(interaction, 'tipo_registro');
        const observacoes = obterCampo(interaction, 'observacoes');

        const observacoesFormatadas = observacoes
            ? observacoes
            : 'Técnico / Case / Ticket não informados';

        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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

    if (tipo === 'modal_cancelamento_acesso_nuvem') {
        const linkCliente = obterCampo(interaction, 'link_cliente');
        const ticketCancelamento = obterCampo(interaction, 'ticket_cancelamento');
        const caseServicoDetalhe = obterCampo(interaction, 'case');

        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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

        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
            '**Reinício de agente**',
            '',
            `**Banco**: ${banco}`,
            '',
            `**Revenda**: ${revenda}`,
            '',
            `**Equipamento**: ${equipamento}`,
            '',
            `Solicitado por: <@${interaction.user.id}>`
        ].join('\n');
    }

    if (tipo === 'modal_cancelamento_agente') {
        const banco = obterCampo(interaction, 'banco');
        const ticketCancelamento = obterCampo(interaction, 'ticket_cancelamento');
        const caseOriginal = obterCampo(interaction, 'case');

        return [
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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
            `Bom dia/Boa tarde <@&${suporteRoleId}>`,
            '',
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