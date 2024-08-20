import express from "express";
import path from "path";
import pg from "pg";

const app = express();
const port = process.env.PORT || 8080;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

db.connect();

app.use(express.static(path.join(process.cwd() + "/public/")));
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

app.get("/leaderboard", async (req, res) => {
  let scores = [];

  const result = await db.query(
    "SELECT name, score, upload_time FROM score ORDER BY score DESC, upload_time ASC LIMIT 10"
  );
  scores = result.rows;

  for (let score of scores) {
    score.upload_time = new Date(score.upload_time).toLocaleDateString(
      "en-us",
      { year: "numeric", month: "short", day: "numeric" }
    );
  }
  //console.log(rankedScores);
  res.render("leaderboard.ejs", {
    title: "Leaderboard",
    pageId: "lb",
    scores: scores,
  });
});

app.post("/score", async (req, res) => {
  const score = req.body;

  let motivationalMsgs = [
    "Keep it up!",
    "Keep Going!",
    "Don't Give Up!",
    "Keep Trying",
  ];
  let msg = "";
  if (score.score < 2) {
    msg = motivationalMsgs[Math.floor(Math.random() * motivationalMsgs.length)];
  } else {
    const leaderBoard = await db.query(
      "SELECT name, score, upload_time FROM score ORDER BY score DESC, upload_time ASC LIMIT 10"
    );
    let leaderBoardScores = leaderBoard.rows;

    if (score.score > leaderBoardScores[9].score) {
      msg =
        "Hurray! You're now into the <a href='/leaderboard'>Leaderboard</a>";
    } else {
      const greaterScoreCount = await db.query(
        "SELECT COUNT(*) FROM score WHERE score >= $1",
        [score.score]
      );
      const totalScoreCount = await db.query(
        "SELECT COUNT(*) FROM score WHERE score > 0"
      );

      const greaterPercentage =
        (greaterScoreCount.rows[0].count / totalScoreCount.rows[0].count) * 100;
      msg = `Only <strong>${Math.round(
        greaterPercentage * 100
      ) / 100}%</strong> have gotten this far. Keep going!`;
    }
  }

  if (score.score > 0) {
    const result = await db.query(
      "INSERT INTO score (name, score, upload_time) VALUES ($1, $2, $3)",
      [score.name, score.score, score.uploadTime]
    );
  }

  res.send({ statusCode: 200, msg: msg });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
