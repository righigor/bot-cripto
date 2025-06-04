require("dotenv").config();
const { google } = require("googleapis");
const credentials = require("./credentials.json");

async function appendLogErrorToSheet(errorDetails) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.ID_SHEETS;
  const range = "errors!A:E";

  const values = [[
    errorDetails.errorType,
    errorDetails.description,
    errorDetails.status,
    errorDetails.data,
    new Date().toISOString()
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values
    }
  });

  console.log("✅ Log registrado no Google Sheets.");
}

module.exports = appendLogErrorToSheet;