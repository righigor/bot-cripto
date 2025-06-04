const crypto = require("crypto");
const axios = require("axios");

async function getBalance(coin) {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}`;

  const signature = crypto
    .createHmac("sha256", process.env.SECRET_KEY_PROD)
    .update(query)
    .digest("hex");

  try {
    const { data } = await axios.get(
      `${process.env.API_URL_PROD}/api/v3/account?${query}&signature=${signature}`,
      {
        headers: {
          "X-MBX-APIKEY": process.env.API_KEY_PROD,
        },
      }
    );

    const usdtBalance = data.balances.find((b) => b.asset === coin);
    return parseFloat(usdtBalance.free);
  } catch (error) {
    console.error("Erro ao obter saldo:", error.response?.data || error.message);
    return 0;
  }
}

module.exports = getBalance;