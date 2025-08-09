// Grab DOM elements with type assertions
const gridSizeInput = document.getElementById('grid-size') as HTMLInputElement;
const colorPicker = document.getElementById('color-picker') as HTMLInputElement;
const clearGridButton = document.getElementById('clear-grid') as HTMLButtonElement;
const pixelGrid = document.getElementById('pixel-grid') as HTMLDivElement;
let isMouseDown = false;

// Track the Active Tool
type Tool = 'pen' | 'eraser' | "eyedropper" | "fill";
let currentTool: Tool = 'pen';

// Select Tool Buttons
const penToolBtn = document.getElementById("pen-tool") as HTMLButtonElement;
const eraserToolBtn = document.getElementById("eraser-tool") as HTMLButtonElement;
const eyedropperToolBtn = document.getElementById("eyedropper-tool") as HTMLButtonElement;
const fillToolBtn = document.getElementById("fill-tool") as HTMLButtonElement;

// Add event listeners for tool switching
penToolBtn.addEventListener("click", () => currentTool = "pen");
eraserToolBtn.addEventListener("click", () => currentTool = "eraser");
eyedropperToolBtn.addEventListener("click", () => currentTool = "eyedropper");
fillToolBtn.addEventListener("click", () => currentTool = "fill");


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

function rgbToHex(rgb: string): string {
    const result = rgb.match(/\d+/g);
    if (!result) return "#ffffff";
    const r = parseInt(result[0]).toString(16).padStart(2, "0");
    const g = parseInt(result[1]).toString(16).padStart(2, "0");
    const b = parseInt(result[2]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
}

function fillArea(startPixel: HTMLDivElement, newColor: string): void {
    const pixels = Array.from(pixelGrid.children) as HTMLDivElement[];
    const size = Number(gridSizeInput.value);

    const targetColor = startPixel.style.backgroundColor || "white";
    if (targetColor === newColor) return;

    const queue: number[] = [pixels.indexOf(startPixel)];

    while (queue.length > 0) {
        const index = queue.shift()!;
        const pixel = pixels[index];
        if (!pixel) continue;
        if (pixel.style.backgroundColor !== targetColor) continue;

        pixel.style.backgroundColor = newColor;

        const neighbors = getNeighbors(index, size);
        neighbors.forEach(n => {
            if (pixels[n] && pixels[n].style.backgroundColor === targetColor) {
                queue.push(n);
            }
        });
    }
}

function getNeighbors(index: number, size: number): number[] {
    const neighbors: number[] = [];
    const row = Math.floor(index / size);
    const col = index % size;

    if (row > 0) neighbors.push(index - size);       // Up
    if (row < size - 1) neighbors.push(index + size); // Down
    if (col > 0) neighbors.push(index - 1);          // Left
    if (col < size - 1) neighbors.push(index + 1);   // Right

    return neighbors;
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
        pixel.addEventListener("click", () => {
            if (currentTool === "pen") {
                pixel.style.backgroundColor = colorPicker.value;
                saveArtwork();
            }
            else if (currentTool === "eraser") {
                pixel.style.backgroundColor = "white";
                saveArtwork();
            }
            else if (currentTool === "eyedropper") {
                const bg = getComputedStyle(pixel).backgroundColor;
                colorPicker.value = rgbToHex(bg);
            }
            else if (currentTool === "fill") {
                fillArea(pixel, colorPicker.value);
                saveArtwork();
            }
        });


        // Drag paint
        pixel.addEventListener("mouseover", () => {
            if (!isMouseDown) return;

            if (currentTool === "pen") {
                pixel.style.backgroundColor = colorPicker.value;
                saveArtwork();
            }
            else if (currentTool === "eraser") {
                pixel.style.backgroundColor = "white";
                saveArtwork();
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