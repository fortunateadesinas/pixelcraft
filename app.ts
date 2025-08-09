// Grab DOM elements with type assertions
const gridSizeInput = document.getElementById('grid-size') as HTMLInputElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
const clearGridButton = document.getElementById('clear-grid') as HTMLButtonElement;
const pixelGrid = document.getElementById('pixel-grid') as HTMLDivElement;
let isMouseDown = false;

// Add event listeners for mouse down and up to handle drawing
document.body.addEventListener('mousedown', () => {
    isMouseDown = true;
});
document.body.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Save current artwork to local storage
function saveArtwork(): void {
    const pixels = Array.from(pixelGrid.children) as HTMLDivElement[];
    const colors = pixels.map(pixel => pixel.style.backgroundColor || "white");
    localStorage.setItem("pixelArt", JSON.stringify({
        size: Number(gridSizeInput.value),
        colors
    }));
}

// load artwork from local storage
function loadArtwork(): void {
    const saved = localStorage.getItem("pixelArt");
    if (!saved) return;

    const { size, colors } = JSON.parse(saved);
    gridSizeInput.value = size;
    createGrid(size);

    const pixels = Array.from(pixelGrid.children) as HTMLDivElement[];
    colors.forEach((color: string, index: number) => {
        pixels[index].style.backgroundColor = color;
    });
}


// Function to create the pixel grid
function createGrid(size: number): void {
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
            saveArtwork();
        });

        // Drag paint
        pixel.addEventListener('mouseover', () => {
            if (isMouseDown) {
                pixel.style.backgroundColor = colorPicker.value;
                saveArtwork(); // save changes
            }
        });

        // later: we'll add color change on click here
        pixelGrid.appendChild(pixel);
    }

    clearGridButton.addEventListener("click", () => {
        // Clear the grid by resetting the background color of each pixel
        createGrid(Number(gridSizeInput.value));
        saveArtwork(); // Save the cleared grid
    });

    // Rebuild the grid when the size input changes
    gridSizeInput.addEventListener("change", () => {
        const newSize = Number(gridSizeInput.value);

        if (newSize < 2 || newSize > 50) {
            alert("Please enter a size between 2 and 50.");
            gridSizeInput.value = '10'; // Reset to default size
            createGrid(10); // Recreate grid with default size
            return;
        }
        createGrid(newSize);
        saveArtwork(); // Save the new grid size
    })
}

// create a default grid on page load
createGrid(Number(gridSizeInput.value));
// Load saved artwork if available
loadArtwork();