const movieSection = document.getElementById("movieSection");
const cardContainer = document.getElementById("cardContainer");

async function getMovies() {
  const { movies, reviews } = await getMoviesAndReviews();

  // Calculate average ratings and update the movies table
  await calculateAverageRatings(movies, reviews);

  console.log(movies);
  loadMovieInfo(movies);
}

function resizeImage(src, width, height, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Enable cross-origin access so it means you can manupulate the images from any origin
  img.src = src;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    const resizedImage = canvas.toDataURL("image/png");
    callback(resizedImage);
  };

  img.onerror = (err) => {
    console.error("Image failed to load:", err);
  };
}

async function loadMovieInfo(array) {
  const cardContainer = document.getElementById("cardContainer");

  for (let i = 0; i < array.length; i++) {
    const card = document.createElement("div");
    const overlay = document.createElement("div");
    const divTXT = document.createElement("div");
    const title = document.createElement("h1");
    const description = document.createElement("p");
    description.textContent = array[i].description;
    title.textContent = array[i].moviename;
    overlay.classList.add("overlay");
    divTXT.classList.add("text");
    card.classList.add("container");
    // Resize the movie image before appending it to show the cards in same size
    resizeImage(array[i].imageurl, 300, 450, (resizedImageSrc) => {
      const resizedImg = new Image();
      resizedImg.src = resizedImageSrc;
      card.appendChild(resizedImg);
      cardContainer.appendChild(card);

      overlay.appendChild(divTXT);
      card.appendChild(overlay);
      divTXT.appendChild(title);
      divTXT.appendChild(description);
      for (let j = 0; j < array[i].rate; j++) {
        const star = document.createElement("span");
        star.classList.add("fa");
        star.classList.add("fa-star");
        star.classList.add("checked");

        divTXT.appendChild(star);
      }
    });
    overlay.addEventListener("click", () => {
      navigateToReviewForm();
      const inptMovieId = document.getElementById("movie_id");

      console.log(inptMovieId);
      const form = document.getElementById("review-form");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        inptMovieId.value = array[i].id;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData);

        console.log(formValues);

        const response = await fetch("http://localhost:8080/userreviews", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        });
        const data = await response.json();
        console.log(`post message : ${data}`);
      });
    });
  }
}
function navigateToReviewForm() {
  document.getElementById("review-form").style.display = "block";
  // Optionally, scroll to the review form
  document.getElementById("review-form").scrollIntoView({ behavior: "smooth" });
}

async function getMoviesAndReviews() {
  const moviesResponse = await fetch("http://localhost:8080/movies");
  const movies = await moviesResponse.json();

  const reviewsResponse = await fetch("http://localhost:8080/reviews");
  const reviews = await reviewsResponse.json();

  return { movies, reviews };
}
async function calculateAverageRatings(movies, reviews) {
  const movieRatings = {};

  // Initialize movieRatings with empty objects
  for (let i = 0; i < movies.length; i++) {
    const movie_id = movies[i].id;
    movieRatings[movie_id] = { totalRate: 0, count: 0 };
  }

  // Aggregate ratings for each movie
  for (let i = 0; i < reviews.length; i++) {
    const review = reviews[i];
    const movie_id = review.movie_id;
    if (movieRatings[movie_id]) {
      movieRatings[movie_id].totalRate += review.user_rate;
      movieRatings[movie_id].count += 1;
    }
  }

  // Calculate average ratings and update the movies table
  for (let i = 0; i < movies.length; i++) {
    const movie_id = movies[i].id;
    const ratingInfo = movieRatings[movie_id];
    let averageRating = null;

    if (ratingInfo && ratingInfo.count > 0) {
      averageRating = ratingInfo.totalRate / ratingInfo.count;
      averageRating = Math.round(averageRating);
      console.log(`round ave is : ${averageRating}`);
    }

    // Prepare the update payload
    const updatePayload = {
      id: movie_id,
      rate: averageRating,
    };
    console.log(`payload: ${updatePayload}`);
    // Send the update request to the server
    await fetch("http://localhost:8080/updatemovierating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatePayload),
    });

    // Optionally, update the movie object with the new average rating
    movies[i].averageRating = averageRating;
  }
  return movies;
}

getMovies();

const list = document.getElementById("review-list");

async function gettingReviews() {
  const reviewsResponse = await fetch(
    "http://localhost:8080/usernameAndReview"
  );
  const reviewResult = await reviewsResponse.json();
  console.log(reviewResult);

  for (let i = 0; i < reviewResult.length; i++) {
    const reviewsSubmission = document.createElement("li");
    reviewsSubmission.textContent = `${reviewResult[i].username} says:${reviewResult[i].review} about: ${reviewResult[i].moviename} Rating: ${reviewResult[i].user_rate}`;
    list.appendChild(reviewsSubmission);
  }
}

gettingReviews();
