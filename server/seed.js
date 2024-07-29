import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

db.query(`
    CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        moviename VARCHAR(60) NOT NULL,
        description TEXT NOT NULL,
        rate INT CHECK (rate BETWEEN 0 AND 5),
        year INT,
        imageurl TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        username VARCHAR(60) NOT NULL,
        review TEXT NOT NULL,
        movie_id INT,
        FOREIGN KEY (movie_id) REFERENCES movies(id)
    );

    INSERT INTO movies (moviename, description, rate, year, imageurl) VALUES
    ('GodFather', 'The Godfather premiered at the Loew State Theatre on March 14, 1972, and was widely released in the United States on March 24, 1972.', 5, 1972, 'https://upload.wikimedia.org/wikipedia/en/1/1c/Godfather_ver1.jpg'),
    ('Interstellar', 'Interstellar premiered in Los Angeles on October 26, 2014. In the United States, it was first released on film stock, expanding to venues using digital projectors.', 4, 2014, 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg');

    INSERT INTO reviews (username, review, movie_id) VALUES
    ('guest1', 'Not so bad', 1),
    ('guest2', 'Good', 2),
    ('guest3', 'So bad', 1);
`);
