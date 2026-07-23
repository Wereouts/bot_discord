# Como iniciar o bot com PM2

Este projeto e um bot Node.js para Discord. O arquivo principal e `index.js`, e o PM2 deve iniciar o bot usando o arquivo `ecosystem.config.js` da raiz.

## 1. Entrar na pasta do projeto

```cmd
cd "C:\Programas suporte\Bot Discord - Suporte\bot_discord-main"
```

## 2. Instalar as dependencias

```cmd
npm install
```

## 3. Configurar o arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto. Voce pode usar o `.env.example` como modelo.

Variaveis obrigatorias:

```env
DISCORD_TOKEN=cole_o_token_do_bot_aqui
SUPORTE_ROLE_ID=cole_o_id_do_cargo_de_suporte_aqui
SUPORTE_LICENCA_ID=cole_o_id_do_cargo_ou_permissao_de_licenca_aqui
```

Sem essas variaveis, o bot inicia e para em seguida. O erro esperado nos logs sera parecido com:

```text
Error: A variavel DISCORD_TOKEN nao foi configurada no arquivo .env.
```

## 4. Instalar ou atualizar o PM2

```cmd
npm install pm2@latest -g
pm2 update
```

Se o PM2 estiver travado ou com versao antiga em memoria, use:

```cmd
pm2 kill
pm2 update
```

## 5. Criar a pasta de logs

```cmd
mkdir logs
```

Se a pasta ja existir, pode ignorar o aviso.

## 6. Iniciar o bot

```cmd
pm2 start ecosystem.config.js
```

Opcionalmente, use o script do npm:

```cmd
npm run pm2:start
```

## 6.1. Iniciar tambem o sistema de licencas

Existe outro projeto que tambem roda no PM2:

```text
C:\Programas suporte\Programinhas licencas
```

Ele deve usar o nome de processo:

```text
licencas
```

Este bot usa:

```text
bot-discord-suporte
```

Para subir os dois sem colisao:

```cmd
cd "C:\Programas suporte\Programinhas licencas"
pm2 start ecosystem.config.js

cd "C:\Programas suporte\Bot Discord - Suporte\bot_discord-main"
pm2 start ecosystem.config.js

pm2 save
pm2 status
```

Depois disso, os dois processos ficam salvos no PM2.

Tambem existe um script pronto neste projeto:

```cmd
iniciar-todos-pm2.cmd
```

Ele inicia ou reinicia `licencas` e `bot-discord-suporte`, executa `pm2 save` e mostra o status final.

No Windows, esse script usa `call pm2 ...` internamente. Isso e importante porque o PM2 costuma ser executado por `pm2.cmd`; sem `call`, um arquivo `.cmd` pode parar antes de iniciar os dois processos.

## 7. Verificar status e logs

```cmd
pm2 status
pm2 logs bot-discord-suporte
```

Os logs tambem ficam salvos em:

```text
logs\bot-out.log
logs\bot-error.log
```

## 8. Comandos uteis

Reiniciar:

```cmd
pm2 restart bot-discord-suporte
```

Ou:

```cmd
npm run pm2:restart
```

Parar:

```cmd
pm2 stop bot-discord-suporte
```

Ou:

```cmd
npm run pm2:stop
```

Remover do PM2:

```cmd
pm2 delete bot-discord-suporte
```

Salvar a lista de processos:

```cmd
pm2 save
```

Restaurar os processos salvos:

```cmd
pm2 resurrect
```

Se um `pm2 kill` derrubar tudo, suba os dois novamente com os comandos da secao `6.1` e rode `pm2 save`.

## 9. Iniciar junto com o Windows

Em Windows, instale o helper:

```cmd
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

Depois disso, o PM2 deve restaurar o processo salvo quando o Windows iniciar.

## Observacao sobre o erro EPERM nos logs

Se aparecer erro parecido com:

```text
EPERM: operation not permitted, open 'C:\Users\toliveira\.pm2\logs\bot-discord-suporte-out.log'
```

Use o `ecosystem.config.js` deste projeto, pois ele grava os logs na pasta local `logs`, evitando a pasta global do PM2.

## Observacao sobre o erro EPERM no pipe do PM2

Se aparecer erro parecido com:

```text
connect EPERM \\.\pipe\rpc.sock
```

Feche os terminais abertos, abra um novo CMD como Administrador e rode:

```cmd
pm2 kill
pm2 update
pm2 start ecosystem.config.js
```

Esse erro acontece antes do bot iniciar; e um problema de comunicacao com o daemon do PM2 no Windows.
