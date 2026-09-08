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
  renderCharacters();
});

maxRange.addEventListener("input", function () {
  updateSlider();
  renderCharacters();
});

updateSlider();

// Characters
const searchBar = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");

let characters = [];

function renderCharacters() {
  const search = searchBar.value.toLowerCase();
  const allowedFilmIds = getAllowedFilmIds();

  let filteredCharacters = [];

  for (let i = 0; i < characters.length; i++) {
    let character = characters[i];
    let matchesName = character.name.toLowerCase().includes(search);
    let hasRightFilm = false;

    for (let j = 0; j < character.films.length; j++) {
      let filmUrl = character.films[j];
      let filmParts = filmUrl.split("/").filter(Boolean);
      let movieId = parseInt(filmParts[filmParts.length - 1]);

      for (let k = 0; k < allowedFilmIds.length; k++) {
        if (movieId === allowedFilmIds[k]) {
          hasRightFilm = true;
        }
      }
    }

    if (matchesName && hasRightFilm) {
      filteredCharacters.push(character);
    }
  }

  let html = "";

  for (let i = 0; i < filteredCharacters.length; i++) {
    html += '<p class="character-card">' + filteredCharacters[i].name + "</p>";
  }

  results.innerHTML = html;
}

fetch("https://swapi.info/api/people")
  .then(function (response) {
    if (!response.ok) {
      throw new Error("bad request");
    }
    return response.json();
  })
  .then(function (data) {
    characters = data;
    renderCharacters();
  })
  .catch(function (error) {
    console.log(error);
    results.innerHTML =
      "<p class='character-card'>Unable to load characters.</p>";
  });

searchButton.addEventListener("click", function () {
  renderCharacters();
});

searchBar.addEventListener("input", function () {
  renderCharacters();
});