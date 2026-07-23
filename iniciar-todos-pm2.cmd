@echo off
setlocal

where pm2 >nul 2>nul
if errorlevel 1 (
  echo PM2 nao foi encontrado no PATH deste terminal.
  echo Instale com: npm install pm2@latest -g
  exit /b 1
)

cd /d "C:\Programas suporte\Programinhas licencas"
call pm2 startOrRestart ecosystem.config.js --update-env
if errorlevel 1 exit /b 1

cd /d "C:\Programas suporte\Bot Discord - Suporte\bot_discord-main"
call pm2 startOrRestart ecosystem.config.js --update-env
if errorlevel 1 exit /b 1

call pm2 save
call pm2 status

endlocal
