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
    ('Interstellar', 'Interstellar premiered in Los Angeles on October 26, 2014. In the United States, it was first released on film stock, expanding to venues using digital projectors.', 4, 2014, 'https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg'),
    ('Isle of Dogs', 'Isle of Dogs opened the 68th Berlin International Film Festival, where Anderson was awarded the Silver Bear for Best Director.', 4, 2018, 'https://upload.wikimedia.org/wikipedia/en/2/23/IsleOfDogsFirstLook.jpg'),
    ('RRR', 'The film was released theatrically on 25 March 2022. With ₹223 crore (US$27 million) worldwide on its first day, RRR recorded the highest opening-day earned by an Indian film.', 5, 2022, 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg'),
    ('Ferrari', 'Ferrari was selected to compete for the Golden Lion at the 80th Venice International Film Festival, premiering on August 31, 2023.', 3, 2023, 'https://upload.wikimedia.org/wikipedia/en/f/f6/Ferrari_film_poster.jpg'),
    ('The Holdovers', 'The Holdovers premiered at the 50th Telluride Film Festival on August 31, 2023, and was released in the United States by Focus Features on October 27, 2023.', 4, 2023, 'https://upload.wikimedia.org/wikipedia/en/6/62/Holdovers_film_poster.jpg');
;

    INSERT INTO reviews (username, review, movie_id) VALUES
    ('guest1', 'Not so bad', 1),
    ('guest2', 'Good', 2),
    ('guest3', 'So bad', 1);

    
     ALTER TABLE reviews
    ADD COLUMN IF NOT EXISTS user_rate INTEGER DEFAULT 0;
`);
