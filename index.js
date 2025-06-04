require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");
const getBalance = require("./getSaldo");
const appendLogToSheet = require("./appendLogsSheet");
const appendLogErrorToSheet = require("./appendLogsErrorsSheet");

let isOpened = false;

function calcSMA(data) {
  const closes = data.map((c) => parseFloat(c[4]));
  const sum = closes.reduce((a, b) => a + b, 0);
  return sum / data.length;
}

async function start() {
  console.log();

  const usdtBalance = await getBalance("USDT");
  const btcBalance = await getBalance("BTC");

  console.log("Saldo USDT:", usdtBalance);
  console.log("Saldo BTC:", btcBalance);

  let data;
  try {
    const response = await axios.get(
      process.env.API_URL_PROD +
        "/api/v3/klines?limit=21&interval=15m&symbol=" +
        process.env.SYMBOL
    );
    data = response.data;
  } catch (error) {
    console.error("Error fetching data from Binance API:", error.message);
  }
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);

  console.log("Preço atual de " + process.env.SYMBOL + ": " + price);

  const sma13 = calcSMA(data.slice(8));
  const sma21 = calcSMA(data);
  console.log("SMA13: " + sma13);
  console.log("SMA21: " + sma21);

  if (sma13 > sma21 && isOpened === false) {
    console.log("Hora de comprar!");

    if (usdtBalance < process.env.USD_TO_SPEND) {
      console.log(
        `❌ Saldo insuficiente: ${usdtBalance} USDT. Necessário: ${process.env.USD_TO_SPEND} USDT`
      );
      appendLogErrorToSheet({
        errorType: "Sem fundos",
        description: `❌ Saldo insuficiente: ${usdtBalance} USDT. Necessário: ${process.env.USD_TO_SPEND} USDT`,
        status: "-",
        data: "-",
      });
      return;
    }
    newOrder(process.env.SYMBOL, usdtBalance * 0.9, "buy");
    isOpened = true;
  } else if (sma13 < sma21 && isOpened === true && btcBalance > 0.0009) {
    console.log("Hora de vender!");
    newOrder(process.env.SYMBOL, btcBalance * 0.9, "sell");
    isOpened = false;
  } else {
    console.log("Aguardar!");
  }
}

async function newOrder(symbol, balance, side) {
  const { data: ticker } = await axios.get(
    `${process.env.API_URL_PROD}/api/v3/ticker/price?symbol=${symbol}`
  );
  const price = parseFloat(ticker.price);
  let quantity;
  if (side === "buy") {
    quantity = (balance / price).toFixed(6);
  } else {
    quantity = balance;
  }
  const order = {
    symbol,
    quantity,
    side,
  };
  order.type = "MARKET";
  order.timestamp = Date.now();

  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY_PROD)
    .update(new URLSearchParams(order).toString())
    .digest("hex");

  order.signature = signature;

  const body = new URLSearchParams(order).toString();
  const headers = {
    "X-MBX-APIKEY": process.env.API_KEY_PROD,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  console.log(
    "\n📤 Enviando requisição para:",
    process.env.API_URL_PROD + "/api/v3/order"
  );
  console.log("📄 Headers:", headers);
  console.log("📦 Body:", body);

  try {
    const response = await axios.post(
      process.env.API_URL_PROD + "/api/v3/order",
      body,
      { headers }
    );
    console.log("✅ Sucesso:", response.data);
    await appendLogToSheet({
      type: side,
      symbol,
      amount: quantity,
      price: quantity * price,
    });
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ Erro da API:",
        error.response.status,
        error.response.data
      );
      appendLogErrorToSheet({
        errorType: "API Error",
        description: "Erro ao tentar acessar a API",
        status: error.response.status,
        data: error.response.data,
      });
    } else {
      console.error("❌ Erro de rede ou configuração:", error.message);
      appendLogErrorToSheet({
        errorType: "Error",
        description: "❌ Erro de rede ou configuração",
        status: "-",
        data: error.message,
      });
    }
  }
}

setInterval(start, 5000);
start();
// appendLogToSheet({
//   type: "TESTE",
//   symbol: process.env.SYMBOL,
//   amount: 0.00001000,
//   price: 68000,
//   timestamp: new Date().toISOString(),
// });
// appendLogErrorToSheet({
//   errorType: "error test",
//   description: "uma descricao de teste",
//   status: "-",
//   data: "-"
// })
