import express from "express";
import fs from "fs";

const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/home", (req, res) => {
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
