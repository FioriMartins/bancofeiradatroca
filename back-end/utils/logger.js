const chalk = require('chalk');

const log = (level, message, data = null) => {
  const colors = {
    INFO: { text: chalk.green, bg: chalk.bgGreen.black },
    WARN: { text: chalk.yellow, bg: chalk.bgYellow.black },
    ERROR: { text: chalk.red, bg: chalk.bgRed.white },
    DEBUG: { text: chalk.blue, bg: chalk.bgBlue.white },
  };

  const now = new Date()
  const timestamp = now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })

  const color = colors[level.toUpperCase()] || { text: chalk.white, bg: chalk.bgWhite.black }

  console.log(
    color.text(`[${level}] ${timestamp} - `) +
    color.bg(` ${message} `) // Mensagem com fundo colorido
  );
  if (data) console.log(chalk.gray(`Detalhes: ${JSON.stringify(data, null, 2)}`))
};

module.exports = log;