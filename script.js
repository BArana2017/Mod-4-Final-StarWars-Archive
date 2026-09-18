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
  const html = filteredCharacters.map(character => 
    `<p class="character-card">${character.name}</p>`
  ).join("");

  results.innerHTML = html;
}

// Fetch characters from API
fetch("https://swapi.info/api/people")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("bad request");
    }
    return response.json();
  })
  .then(function (data) {
    characters = data;
  })
  .catch(function (error) {
    console.log(error);
    if (hasSearched) {
      results.innerHTML =
        "<p class='character-card'>Unable to load characters.</p>";
    }
  });

searchButton.addEventListener("click", function () {
  hasSearched = true;
  renderCharacters();
});

// Character Images
const imageContainer = document.getElementById('image-container');
const img = document.createElement('img');
img.src = 'assets/HanSolo.webp';
img.alt = 'Han Solo';
imageContainer.appendChild(img);

// Set CSS styles directly
img.style.width = '150px';  // Set the width
img.style.border = '2px solid black';  // Add a border
img.style.borderRadius = '10px';  // Add rounded corners

// Define a mapping of characters to their image paths
const characterImages = {
    'Han Solo': 'assets/HanSolo.webp',
    // Add more characters and their respective image paths here
};

// Function to handle the search
function handleSearch() {
    const searchInput = document.getElementById('search-input').value;
    const imageContainer = document.getElementById('image-container');

    // Clear the image container
    imageContainer.innerHTML = '';

    // Check if the character exists in the mapping
    if (characterImages[searchInput]) {
        // Create an img element
        const img = document.createElement('img');
        img.src = characterImages[searchInput];
        img.alt = searchInput;

        // Append the image to the container
        imageContainer.appendChild(img);
    } else {
        imageContainer.innerHTML = '<p>Character not found!</p>';
    }
}

// Attach event listener to the search button
document.getElementById('search-button').addEventListener('click', handleSearch);


