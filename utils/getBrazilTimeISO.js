function getBrazilDateTimeFormatted() {
  const date = new Date();

  const optionsDate = {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  };

  const optionsTime = {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  const formattedDate = new Intl.DateTimeFormat('pt-BR', optionsDate).format(date); // ex: 04/06/2025
  const formattedTime = new Intl.DateTimeFormat('pt-BR', optionsTime).format(date); // ex: 19:07:33

  return { date: formattedDate, time: formattedTime };
}

module.exports = getBrazilDateTimeFormatted;
