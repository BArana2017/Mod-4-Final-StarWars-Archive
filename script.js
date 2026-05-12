const minRange = document.getElementById("minRange");
const maxRange = document.getElementById("maxRange");
const progress = document.getElementById("progress");
const minVal = document.getElementById("minVal");
const maxVal = document.getElementById("maxVal");
const characterList = document.getElementById("characterList");

let characters = [];

// classify force type
function getForceType(name) {
  const jedi = ["Luke Skywalker", "Yoda", "Obi-Wan Kenobi", "Anakin Skywalker", "Mace Windu", "Leia Organa", "Qui-Gon Jinn"];
  const sith = ["Darth Vader", "Palpatine", "Darth Maul"];

  if (jedi.includes(name)) return "jedi";
  if (sith.includes(name)) return "sith";
  return "neutral";
}

// fetch extra data (species + homeworld)
async function getExtraData(url) {
  const res = await fetch(url);
  return res.json();
}

// fetch characters
async function fetchCharacters() {
  let url = "https://swapi.dev/api/people/";
  let results = [];

  while (url) {
    const res = await fetch(url);
    const data = await res.json();
    results = results.concat(data.results);
    url = data.next;
  }

  // enrich data
  characters = await Promise.all(results.map(async (char, index) => {
    const homeworld = await getExtraData(char.homeworld);

    let speciesName = "Human";
    if (char.species.length > 0) {
      const species = await getExtraData(char.species[0]);
      speciesName = species.name;
    }

    return {
      id: char.url.match(/\/people\/(\d+)\//)[1],
      name: char.name,
      films: char.films.length,
      homeworld: homeworld.name,
      species: speciesName,
      force: getForceType(char.name)
    };
  }));

  renderCharacters(characters);
}

// render cards
function renderCharacters(data) {
  characterList.innerHTML = "";

  data.forEach(char => {
    const div = document.createElement("div");
    div.classList.add("character", char.force);

    div.innerHTML = `
      <img src="https://starwars-visualguide.com/assets/img/characters/${char.id}.jpg" 
           onerror="this.src='https://starwars-visualguide.com/assets/img/big-placeholder.jpg'">

      <h4>${char.name}</h4>
      <p><strong>Species:</strong> ${char.species}</p>
      <p><strong>Homeworld:</strong> ${char.homeworld}</p>
      <p><strong>Films:</strong> ${char.films}</p>
    `;

    characterList.appendChild(div);
  });
}

// slider logic
function updateSlider() {
  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  if (min > max) [min, max] = [max, min];

  minVal.textContent = min;
  maxVal.textContent = max;

  const percentMin = (min / minRange.max) * 100;
  const percentMax = (max / maxRange.max) * 100;

  progress.style.left = percentMin + "%";
  progress.style.width = (percentMax - percentMin) + "%";

  filterCharacters(min, max);
}

function filterCharacters(min, max) {
  const filtered = characters.filter(c => c.films >= min && c.films <= max);
  renderCharacters(filtered);
}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

characterList.innerHTML = "Loading characters...";
fetchCharacters();
updateSlider();