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

app.listen(Port, (req, res) => {
  console.log("we are on port 8080");
});
