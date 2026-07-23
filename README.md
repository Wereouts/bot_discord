# 🤖 Bot de Solicitações para Discord

Bot desenvolvido para padronizar e automatizar o envio de solicitações técnicas através de um comando no Discord.

O objetivo é reduzir erros de preenchimento, manter um padrão nas solicitações e agilizar o atendimento da equipe responsável.

---

## ✨ Funcionalidades

- ✅ Comando `/solicitar`
- ✅ Formulário interativo (Modal)
- ✅ Campos obrigatórios
- ✅ Mensagens padronizadas
- ✅ Embeds organizados
- ✅ Menção automática ao cargo de suporte
- ✅ Evita solicitações incompletas

---

# 📋 Como utilizar

Digite no canal autorizado:

```text
/solicitar
```

Será aberto um formulário para preenchimento.

Após preencher todas as informações, clique em **Enviar**.

O bot publicará automaticamente uma solicitação organizada no canal configurado.

---

# 📝 Informações solicitadas

Dependendo do tipo de solicitação, poderão ser solicitados campos como:

- Técnico responsável
- Link da Case
- Número do Ticket
- Banco
- Empresa
- Equipamento
- Observações

Exemplo:

```text
Técnico:
William

Link:
https://...

Ticket:
253781
```

---

# 📨 Exemplo de saída

O bot enviará uma mensagem semelhante a:

> 📌 Nova Solicitação
>
> **Tipo:** Criação
>
> **Técnico:** William
>
> **Ticket:** 253781
>
> **Case:** https://...
>
> **Banco:** Empresa X
>
> @Suporte

---

# 🚀 Instalação

## 1. Clone o repositório

```bash
git clone https://github.com/Wereouts/bot_discord.git
```

---

## 2. Entre na pasta

```bash
cd bot_discord
```

---

## 3. Instale as dependências

```bash
npm install
```

---

## 4. Configure o arquivo `.env`

Exemplo:

```env
DISCORD_TOKEN=SEU_TOKEN
CLIENT_ID=SEU_CLIENT_ID
GUILD_ID=SEU_SERVIDOR
CHANNEL_ID=CANAL_DESTINO
SUPORTE_ROLE_ID=CARGO_SUPORTE
```

---

## 5. Registrar os comandos

Execute apenas uma vez (ou quando alterar comandos):

```bash
node registrar-comandos.js
```

---

## 6. Iniciar o bot

```bash
node index.js
```

ou

```bash
npm start
```

(se configurado no `package.json`)

---

# ⚙️ Requisitos

- Node.js 20 ou superior
- Bot criado no Discord Developer Portal
- Permissão para registrar Slash Commands
- Permissão para enviar mensagens no canal

---

# 🔑 Permissões necessárias

O bot deve possuir, no mínimo:

- Ver canais
- Enviar mensagens
- Incorporar links (Embed Links)
- Usar comandos de aplicativo
- Mencionar cargos (caso utilize)

---

# 📂 Estrutura do projeto

```text
bot_discord/
│
├── src/
├── index.js
├── registrar-comandos.js
├── package.json
├── .env
└── README.md
```

---

# 💡 Fluxo de utilização

```text
Usuário
   │
   ▼
/solicitar
   │
   ▼
Formulário
   │
   ▼
Validação
   │
   ▼
Embed
   │
   ▼
Canal de Solicitações
   │
   ▼
Equipe de Suporte
```

---

# ❓ Problemas comuns

## O comando não aparece

Execute novamente:

```bash
node registrar-comandos.js
```

---

## Erro 401 Unauthorized

Verifique se o `DISCORD_TOKEN` está correto.

> O Token **não é** o link de convite do bot.

---

## Missing Access

Verifique se:

- o bot está no servidor;
- possui permissões;
- o `CLIENT_ID`;
- o `GUILD_ID`.

---

## O bot não envia mensagens

Confira:

- `CHANNEL_ID`
- permissões do canal
- cargo do bot

---

# 🛠 Tecnologias utilizadas

- Node.js
- discord.js
- dotenv

---

# 📄 Licença

Este projeto é disponibilizado para uso interno e pode ser adaptado conforme a necessidade da equipe.

---

Desenvolvido para facilitar o gerenciamento de solicitações através do Discord.
