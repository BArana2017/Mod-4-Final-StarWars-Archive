const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");

const minValue = document.getElementById("minValue");
const maxValue = document.getElementById("maxValue");

const progress = document.getElementById("progress");

function updateSlider() {

  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  // prevent crossing
  if (min > max) {
    [min, max] = [max, min];
  }

  // update text
  minValue.textContent = min;
  maxValue.textContent = max;

  // calculate %
const minLimit = parseInt(minRange.min);
const maxLimit = parseInt(minRange.max);

const minPercent = ((min - minLimit) / (maxLimit - minLimit)) * 100;
const maxPercent = ((max - minLimit) / (maxLimit - minLimit)) * 100;

progress.style.left = minPercent + "%";
progress.style.width = (maxPercent - minPercent) + "%";

  // move progress bar
  progress.style.left = minPercent + "%";
  progress.style.width = (maxPercent - minPercent) + "%";
}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

updateSlider();

// Characters

const searchBar = document.getElementById("search-bar");
const results = document.getElementById("results");

let characters = [];

fetch("https://akabab.github.io/starwars-api/api/all.json")
  .then((res) => res.json())
  .then((data) => {
    characters = data;
  });

searchBar.addEventListener("input", (e) => {
  const search = e.target.value.toLowerCase();

  results.innerHTML = characters
    .filter((character) => character.name.toLowerCase().includes(search))
    .map((character) => `<p>${character.name}</p>`)
    .join("");
});