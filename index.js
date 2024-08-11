import express from "express";
import ejs from "ejs";
import fs from "fs";
import { google } from "googleapis";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 8080;

const sheetId = "1Bclbev44BoVoBnjq3VRsj7xSiVZNz1glAYr8NA2hoTg";
const tabName = "score";
const range = "A:C";
const serviceAccountKeyFile = "./simon2-432115-37b7ee736007.json";
const scope = "https://www.googleapis.com/auth/spreadsheets";

app.set("view engine", "ejs");
app.engine("ejs", ejs.__express); // Add this line to set the templating engine
app.set("views", path.join(__dirname, "./views")); // Assuming 'views' is in same level as root folder

app.use(express.static(__dirname + "/public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Got a request for index.html");
  res.sendFile("index.html");
});

app.get("/home", (req, res) => {
  console.log(`__directory name is ${__dirname}`);
  console.log("Got a request for home");
  res.render("home.ejs", { title: "Simon", pageId: "home" });
});

app.get("/game", (req, res) => {
  res.render("game.ejs", { title: "", pageId: "game" });
});

app.get("/leaderboard", async (req, res) => {
  let scores = [];
  let rankedScores = [];
  const googleSheetClient = await _getGoogleSheetClient();
  scores = await _getScores(googleSheetClient, sheetId, tabName, range);
  //console.log(rankedScores);
  res.render("leaderboard.ejs", {
    title: "Leaderboard",
    pageId: "lb",
    scores: scores,
  });
});

app.post("/score", async (req, res) => {
  //console.log(req.body);
  const score = req.body;
  const data = [[score.name, score.score, score.uploadTime]];
  const googleSheetClient = await _getGoogleSheetClient();
  await _addScore(googleSheetClient, sheetId, tabName, range, data);

  const response = await _sortSheet(googleSheetClient);

  res.send({ statusCode: 200 });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

async function _getGoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: serviceAccountKeyFile,
    scopes: [scope],
  });
  const authClient = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: authClient,
  });
}

async function _sortSheet(googleSheetClient) {
  console.log("Entered Sort sheet...");
  const resource = {
    requests: [
      {
        sortRange: {
          range: {
            sheetId: 0,
            startRowIndex: 1,
            endRowIndex: 100,
            startColumnIndex: 0,
            endColumnIndex: 3,
          },

          sortSpecs: [
            {
              dimensionIndex: 1,
              sortOrder: "DESCENDING",
            },
          ],
        },
      },
    ],
    //responseRanges: ["A2:C11"],
  };

  const response = await googleSheetClient.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: resource,
  });
  //console.log(response);
}

async function _getScores(googleSheetClient, sheetId, tabName, range) {
  const res = await googleSheetClient.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${tabName}!A1:C11`,
  });

  const scores = res.data.values;
  scores.splice(0, 1);
  return scores;
}

async function _addScore(googleSheetClient, sheetId, tabName, range, data) {
  await googleSheetClient.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${tabName}!${range}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    resource: {
      majorDimension: "ROWS",
      values: data,
    },
  });
}
