const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 103160;
const SELL_PRICE = 106370;

const API_URL = "https://testnet.binance.vision"; //https://api.binance.com

let isOpened = false;

function calcSMA(data) {
  const closes = data.map((c) => parseFloat(c[4]));
  const sum = closes.reduce((a, b) => a + b, 0);
  return sum / data.length;
}

async function start() {
  let data;
  try {
    const response = await axios.get(
      API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL
    );
    data = response.data;
  } catch (error) {
    console.error("Error fetching data from Binance API:", error.message);
  }
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);

  console.clear();
  console.log(price);

  const sma13 = calcSMA(data.slice(5));
  const sma21 = calcSMA(data);
  console.log("sma13: " + sma13);
  console.log("sma21: " + sma21);

  if (sma13 > sma21 && isOpened === false) {
    console.log("comprar");
    isOpened = true;
  } else if (sma13 < sma21 && isOpened === true) {
    console.log("vender");
    isOpened = false;
  } else {
    console.log("aguardar");
  }
}

setInterval(start, 3000);
start();
