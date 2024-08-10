import express from "express";
import ejs from "ejs";
import fs from "fs";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(`__directory name is ${__dirname}`);

const app = express();
const port = 8080;

app.set("view engine", "ejs");
app.engine("ejs", ejs.__express); // Add this line to set the templating engine
app.set("views", path.join(__dirname, "./views")); // Assuming 'views' is in same level as root folder

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Got a request for index.html");
  res.sendFile(__dirname + "/index.html");
});

app.get("/home", (req, res) => {
  console.log("Got a request for home");
  res.render("home.ejs", { title: "Simon", pageId: "home" });
});

app.get("/game", (req, res) => {
  res.render("game.ejs", { title: "", pageId: "game" });
});

app.get("/leaderboard", (req, res) => {
  let scores = [];
  let rankedScores = [];
  fs.readFile("./data/scores.json", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      scores = JSON.parse(data).scores;

      while (scores.length > 0) {
        let maxScore = -1;
        let topPlayer = 0;
        for (let score of scores) {
          if (score.score > maxScore) {
            maxScore = score.score;
            topPlayer = score;
          }
        }
        topPlayer.uploadTime = new Date(topPlayer.uploadTime).toLocaleString('en-GB', { timeZone: 'IST' }) + " IST";
        rankedScores.push(topPlayer);
        scores.splice(scores.indexOf(topPlayer), 1);
      }
      res.render("leaderboard.ejs", {
        title: "Leaderboard",
        pageId: "lb",
        scores: rankedScores,
      });
    }
  });
});

app.post("/score", (req, res) => {
  console.log(req.body);

  fs.readFile("./data/scores.json", "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    } else {
      let scores = JSON.parse(data).scores;
      scores.push(req.body);

      const scoresObj = {
        scores: scores,
      };

      fs.writeFile("./data/scores.json", JSON.stringify(scoresObj), (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });

  res.send({ statusCode: 200 });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


//module.exports = app;