require("dotenv").config();
const { google } = require("googleapis");
const credentials = require("./credentials.json");
const getBrazilDateTimeFormatted = require("./utils/getBrazilTimeISO");

async function appendLogToSheet(orderDetails) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.ID_SHEETS;
  const range = "logs!A:F";
  const { date, time } = getBrazilDateTimeFormatted();
  const values = [
    [
      orderDetails.type,
      orderDetails.symbol,
      orderDetails.amount,
      orderDetails.price,
      date,
      time,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values,
    },
  });

  console.log("✅ Log registrado no Google Sheets.");
}

module.exports = appendLogToSheet;
