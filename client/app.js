const movieSection = document.getElementById("movieSection");
const cardContainer = document.getElementById("cardContainer");
let currentMovieId = null;

const textarea = document.getElementById("textarea");
async function getMovies() {
  const { movies, reviews } = await getMoviesAndReviews();

  // Calculate average ratings and update the movies table
  const res = await calculateAverageRatings(movies, reviews);

  console.log(movies);
  console.log(res);
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
    const resizedImage = canvas.toDataURL("image/jpg");
    callback(resizedImage);
  };

  img.onerror = (err) => {
    console.error("Image failed to load:", err);
  };
}

async function loadMovieInfo(array) {
  cardContainer.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const card = document.createElement("div");
    const overlay = document.createElement("div");
    const divTXT = document.createElement("div");
    const title = document.createElement("h1");
    const description = document.createElement("p");
    const press = document.createElement("p");
    press.textContent = "press to add review";
    description.textContent = array[i].description;
    title.textContent = array[i].moviename;

    overlay.classList.add("overlay");
    divTXT.classList.add("text");
    card.classList.add("container");
    const resizedImg = document.createElement("img");
    // Resize the movie image before appending it to show the cards in same size
    resizeImage(array[i].imageurl, 300, 450, (resizedImageSrc) => {
      resizedImg.src = resizedImageSrc;
    });
    cardContainer.appendChild(card);
    card.appendChild(resizedImg);

    card.appendChild(overlay);
    overlay.appendChild(divTXT);
    divTXT.appendChild(title);
    divTXT.appendChild(description);
    divTXT.appendChild(press);
    for (let j = 0; j < array[i].rate; j++) {
      //counting rates and add star as much as rate amount
      const star = document.createElement("span");
      star.classList.add("fa");
      star.classList.add("fa-star");
      star.classList.add("checked");

      divTXT.appendChild(star);
    }
    overlay.addEventListener("click", () => {
      navigateToReviewForm();
      currentMovieId = array[i].id;
    });
  }
}

const inptMovieId = document.getElementById("movie_id");

console.log(inptMovieId);
const form = document.getElementById("review-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  inptMovieId.value = currentMovieId;
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
  console.log(` updated : ${data}`);
  textarea.value = "";
  getMovies();
  gettingReviews();
});

function navigateToReviewForm() {
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
    if (averageRating == null) {
      averageRating = 0;
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
    movies[i].rate = averageRating;
  }
  return movies;
}

const list = document.getElementById("review-list");

async function gettingReviews() {
  list.innerHTML = "";
  const reviewsResponse = await fetch(
    "http://localhost:8080/usernameAndReview"
  );
  const reviewResult = await reviewsResponse.json();
  console.log(reviewResult);

  for (let i = 0; i < reviewResult.length; i++) {
    const reviewsSubmission = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = `${reviewResult[i].username} says:${reviewResult[i].review} about: ${reviewResult[i].moviename} Rating: ${reviewResult[i].user_rate}`;
    reviewsSubmission.appendChild(p);
    list.appendChild(reviewsSubmission);
  }
}
const formSection = document.getElementById("movie-submission-section");
const popupButton = document.getElementById("popup");
popupButton.addEventListener("click", function () {
  formSection.classList.remove("dissapear");
  popupButton.style.display = "none";
});

const formPopup = document.getElementById("addMovieForm");
formPopup.addEventListener("submit", async function (event) {
  console.log("We are here");
  event.preventDefault();
  const formData = new FormData(formPopup);
  const formValues = Object.fromEntries(formData);
  console.log(formValues);
  const repsonse = await fetch("http://localhost:8080/moviesubmission", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  gettingReviews();
  getMovies();
  popupButton.style.display = "block";
  formSection.style.display = "none";
});

gettingReviews();
getMovies();
