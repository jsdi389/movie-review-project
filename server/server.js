import express from "express";
import pg from "pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const app = express();
app.use(cors());
app.use(express.json());
const Port = 8080;

app.get("/", (request, response) => {
  response.send("API is called");
});
app.get("/movies", async (req, res) => {
  const result = await db.query(`SELECT * FROM movies ORDER BY id ASC`);
  const users = result.rows;
  res.json(users);
});
app.get("/reviews", async (req, res) => {
  const result = await db.query(`SELECT * FROM reviews ORDER BY id ASC`);
  const reviews = result.rows;
  res.json(reviews);
});
app.post("/userreviews", async (req, res) => {
  console.log(req.body);
  const { movie_id, username, review } = req.body;

  const insertQuery =
    "INSERT INTO reviews (username,review,movie_id) VALUES ($2, $3 ,$1)";
  await db.query(insertQuery, [movie_id, username, review]);
  res.json(req.body);
});

app.listen(Port, (req, res) => {
  console.log("we are on port 8080");
});
