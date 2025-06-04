require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");

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
      process.env.API_URL_TEST + "/api/v3/klines?limit=21&interval=15m&symbol=" + process.env.SYMBOL
    );
    data = response.data;
  } catch (error) {
    console.error("Error fetching data from Binance API:", error.message);
  }
  const candle = data[data.length - 1];
  const price = parseFloat(candle[4]);

  console.clear();
  console.log(price);

  const sma13 = calcSMA(data.slice(8));
  const sma21 = calcSMA(data);
  console.log("sma13: " + sma13);
  console.log("sma21: " + sma21);

  if (sma13 > sma21 && isOpened === false) {
    console.log("comprar");
    isOpened = true;
    newOrder(process.env.SYMBOL, process.env.QUANTITY, "buy");
  } else if (sma13 < sma21 && isOpened === true) {
    console.log("vender");
    newOrder(process.env.SYMBOL, process.env.QUANTITY, "sell");
    isOpened = false;
  } else {
    console.log("aguardar");
  }
}

async function newOrder(symbol, quantity, side) {
  const order = {
    symbol,
    quantity,
    side,
  };
  order.type = "MARKET";
  order.timestamp = Date.now();

  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(new URLSearchParams(order).toString())
    .digest("hex");

  order.signature = signature;

  try {
    // const { data } = await axios.post(
    //   process.env.API_URL_TEST + "/api/v3/order",
    //   new URLSearchParams(order).toString(),
    //   { headers: { "X-MBX-APIKEY": process.env.API_KEY } }
    // );

    // console.log(data);
    console.log(order)
  } catch (error) {
    console.error(error.resonse.data);
  }
}

setInterval(start, 3000);
start();
