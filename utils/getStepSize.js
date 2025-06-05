const axios = require('axios');

async function getStepSize(symbol) {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/exchangeInfo?symbol=${symbol}`);
    const filters = response.data.symbols[0].filters;
    const lotSizeFilter = filters.find(f => f.filterType === "LOT_SIZE");
    return parseFloat(lotSizeFilter.stepSize);
  } catch (error) {
    console.error(`Erro ao buscar stepSize para ${symbol}:`, error.message);
    throw error;
  }
}
module.exports = getStepSize;