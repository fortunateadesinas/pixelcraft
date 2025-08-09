"use strict";
// Grab DOM elements with type assertions
const gridSizeIput = document.getElementById('grid-size');
const colorPicker = document.getElementById('color-picker');
const clearGridButton = document.getElementById('clear-grid');
const pixelGrid = document.getElementById('pixel-grid');
// Function to create the pixel grid
function createGrid(size) {
    // Clear any existing grid
    pixelGrid.innerHTML = '';
    // Set grid template (CSS grid)
    pixelGrid.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    pixelGrid.style.gridTemplateRows = `repeat(${size}, 20px)`;
    for (let i = 0; i < size * size; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel");
        // Change color on click
        pixel.addEventListener('click', () => {
            pixel.style.backgroundColor = colorPicker.value;
        });
        // later: we'll add color change on click here
        pixelGrid.appendChild(pixel);
    }
}
// create a default grid on page load
createGrid(Number(gridSizeIput.value));
