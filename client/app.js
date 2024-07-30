const movieSection = document.getElementById("movieSection");
const cardContainer = document.getElementById("cardContainer");

async function getMovies() {
  try {
    const response = await fetch("http://localhost:8080/movies");
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const result = await response.json();
    console.log(result);
    loadMovieInfo(result);
  } catch (error) {
    console.error("Fetching movies failed:", error);
  }
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

function loadMovieInfo(array) {
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
      const inptMovieId = document.getElementById("movie_id");
      inptMovieId.value = array[i].id;
      console.log(inptMovieId);
      const form = document.getElementById("review-form");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
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
      });
    });
  }
}

getMovies();
