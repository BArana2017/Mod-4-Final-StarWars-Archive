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
  const minPercent = (min / minRange.max) * 100;
  const maxPercent = (max / maxRange.max) * 100;

  // move progress bar
  progress.style.left = minPercent + "%";
  progress.style.width = (maxPercent - minPercent) + "%";
}

minRange.addEventListener("input", updateSlider);
maxRange.addEventListener("input", updateSlider);

updateSlider();