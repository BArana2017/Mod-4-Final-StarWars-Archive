const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");

const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");

const progress = document.getElementById("progress");

function updateSlider() {
  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  if (min > max) {
    let temp = min;
    min = max;
    max = temp;
    minRange.value = min;
    maxRange.value = max;
  }

  minValue.textContent = min;
  maxValue.textContent = max;

  const minLimit = parseInt(minRange.min);
  const maxLimit = parseInt(minRange.max);

  const minPercent = ((min - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((max - minLimit) / (maxLimit - minLimit)) * 100;

  progress.style.left = minPercent + "%";
  progress.style.width = maxPercent - minPercent + "%";
}

function getAllowedFilmIds() {
  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  if (min > max) {
    let temp = min;
    min = max;
    max = temp;
  }

  let filmIds = [];
  for (let i = min; i <= max; i++) {
    filmIds.push(i);
  }

  return filmIds;
}

minRange.addEventListener("input", function () {
  updateSlider();
  if (hasSearched) {
    renderCharacters();
  }
});

maxRange.addEventListener("input", function () {
  updateSlider();
  if (hasSearched) {
    renderCharacters();
  }
});

updateSlider();

// Characters
const searchBar = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");

let characters = [];
let hasSearched = false;

function renderCharacters() {
  const search = searchBar.value.toLowerCase();
  const allowedFilmIds = getAllowedFilmIds();

  let filteredCharacters = characters.filter(character => {
    // Check if character's name matches the search
    const matchesName = character.name.toLowerCase().includes(search);
    
    // Check if character appears in any of the allowed films
    const hasRightFilm = character.films.some(filmUrl => {
      const filmParts = filmUrl.split("/").filter(Boolean);
      const movieId = parseInt(filmParts[filmParts.length - 1]);
      return allowedFilmIds.includes(movieId);
    });

    return matchesName && hasRightFilm;
  });

  // Build the HTML for filtered characters
  const html = filteredCharacters.map(character => {
    const image = characterImages[character.name];
    return `<div class="character-card">
      ${image ? `<img src="${image}" alt="${character.name}">` : ""}
      <p>${character.name}</p>
    </div>`;
  }).join("");

  results.innerHTML = html;
}

const characterImages = {
  "Luke Skywalker": "./assets/Luke.jpg",
  "Leia Organa": "./assets/Leia.jpg",
  "Han Solo": "./assets/HanSolo.webp",
  "Anakin Skywalker": "./assets/Anakin.jpg",
  "Padmé Amidala": "./assets/Padme.jpg",
  "Shmi Skywalker": "./assets/Schmi.jpeg",
  "Darth Vader": "./assets/Vader.jpg",
  "Palpatine": "./assets/Palpatine.jpg",
  "Jabba Desilijic Tiure": "./assets/Jabba.jpg",
  "Greedo": "./assets/Greedo.jpg",
};

// Fetch characters from API
searchButton.addEventListener("click", function (event) {
    hasSearched = true; // Set that a search has occurred
    handleSearch(event); // Call the handleSearch function
});

function handleSearch(event) {
    event.preventDefault(); // Prevent the default form submission
    document.getElementById('loading-spinner').style.display = 'block'; // Show the loading spinner

    // Fetch data from the API
    fetch("https://swapi.info/api/people")
        .then(response => {
            if (!response.ok) {
                throw new Error("Bad request");
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            characters = data; // Store the fetched characters
            
            // Delay the display of results by 2 seconds
            setTimeout(() => {
                document.getElementById('loading-spinner').style.display = 'none'; // Hide the spinner
                renderCharacters(); // Call your function to render characters
            }, 2000); // 2000 milliseconds = 2 seconds
        })
        .catch(error => {
            console.log(error);
            if (hasSearched) {
                results.innerHTML =
                    "<p class='character-card'>Unable to load characters.</p>";
            }
        });
}
