module.exports = {
  apps: [
    {
      name: "bot-discord-suporte",
      script: "index.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_restarts: 10,
      out_file: "./logs/bot-out.log",
      error_file: "./logs/bot-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
