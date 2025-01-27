const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const grayscaleBtn = document.getElementById("grayscale");
const flipHorizontalBtn = document.getElementById("flipHorizontal");
const flipVerticalBtn = document.getElementById("flipVertical");
const downloadBtn = document.getElementById("download");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const rotateBtn = document.getElementById("rotate");
const addTextFeatureBtn = document.getElementById("addTextFeature");
const textModal = document.getElementById("textModal");
const modalTextInput = document.getElementById("modalTextInput");
const applyTextBtn = document.getElementById("applyText");
const closeModalBtn = document.getElementById("closeModal");
const positionSelect = document.getElementById("positionSelect");
const fontSizeInput = document.getElementById("fontSize");
const fontWeightSelect = document.getElementById("fontWeight");
const featureButtons = document.querySelectorAll(".feature-bar button");
const fileInput = document.getElementById("upload");
// Elemente für die Farbauswahl-Funktionalität
const pickColorBtn = document.getElementById("pickColor"); // Button, um das Farbauswahl-Tool zu aktivieren
const colorModal = document.getElementById("colorModal"); // Modal, um die Farbinformationen anzuzeigen
const colorPreview = document.getElementById("colorPreview"); // Vorschau der ausgewählten Farbe
const rgbValue = document.getElementById("rgbValue"); // Element zur Anzeige des RGB-Werts
const hexValue = document.getElementById("hexValue"); // Element zur Anzeige des HEX-Werts
const copyRGBBtn = document.getElementById("copyRGB"); // Button zum Kopieren des RGB-Werts
const copyHEXBtn = document.getElementById("copyHEX"); // Button zum Kopieren des HEX-Werts
const closeColorModalBtn = document.getElementById("closeColorModal"); // Button, um das Modal zu schließen
// Neuer Button für den Vorher-Nachher-Vergleich
const compareImagesBtn = document.getElementById("compareImages"); // Button
const compareModal = document.getElementById("compareModal"); // Modal
const closeCompareModalBtn = document.getElementById("closeCompareModal"); // Modal schließen

let originalImageSrc = null;
let img = new Image();
let pickingColor = false;
let history = [];
let historyIndex = -1;
let rotationAngle = 0;
let imageLoaded = false; // Zustand: Ob ein Bild geladen wurde

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function getTextPosition(
  position,
  canvasWidth,
  canvasHeight,
  textWidth,
  textHeight
) {
  switch (position) {
    case "top-left":
      return { x: 10, y: textHeight + 10 };
    case "top-center":
      return { x: canvasWidth / 2 - textWidth / 2, y: textHeight + 10 };
    case "top-right":
      return { x: canvasWidth - textWidth - 10, y: textHeight + 10 };
    case "center":
      return {
        x: canvasWidth / 2 - textWidth / 2,
        y: canvasHeight / 2 + textHeight / 2,
      };
    case "bottom-left":
      return { x: 10, y: canvasHeight - 10 };
    case "bottom-center":
      return { x: canvasWidth / 2 - textWidth / 2, y: canvasHeight - 10 };
    case "bottom-right":
      return { x: canvasWidth - textWidth - 10, y: canvasHeight - 10 };
    default:
      return { x: 10, y: 10 }; // Default position
  }
}

function setButtonsState(enabled) {
  featureButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function saveState() {
  if (historyIndex < history.length - 1) {
    history = history.slice(0, historyIndex + 1);
  }
  history.push(canvas.toDataURL());
  historyIndex++;
}

function restoreState() {
  if (historyIndex >= 0) {
    const img = new Image();
    img.src = history[historyIndex];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }
}

// Cursor ändern, um den Farbauswahlmodus anzuzeigen
pickColorBtn.addEventListener("click", () => {
  pickingColor = true;
  canvas.style.cursor = "crosshair"; // Zeigt an, dass Farbe ausgewählt wird
});

// Farbauswahl bei Klick
canvas.addEventListener("click", (e) => {
  if (pickingColor) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const imageData = ctx.getImageData(x, y, 1, 1).data;

    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];
    const hex = rgbToHex(r, g, b);

    // Farbinformationen aktualisieren
    colorPreview.style.backgroundColor = hex;
    rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
    hexValue.textContent = hex;

    // Modal anzeigen
    colorModal.classList.remove("hidden");
    pickingColor = false;
    canvas.style.cursor = "default"; // Cursor zurücksetzen
  }
});

// Kopieren von RGB und HEX
copyRGBBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(rgbValue.textContent);
});

copyHEXBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(hexValue.textContent);
});

// Modal schließen
closeColorModalBtn.addEventListener("click", () => {
  colorModal.classList.add("hidden");
});

// Drag-and-Drop-Funktionalität
canvas.addEventListener("dragover", (event) => {
  if (!imageLoaded) {
    event.preventDefault();
    canvas.classList.add("drag-over");
  }
});

canvas.addEventListener("dragleave", () => {
  canvas.classList.remove("drag-over");
});

canvas.addEventListener("drop", (event) => {
  if (!imageLoaded) {
    event.preventDefault();
    canvas.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result;
        imageLoaded = true; // Zustand setzen
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
      };
      reader.readAsDataURL(file);
    } else {
      alert("Bitte eine Bilddatei ziehen!");
    }
  }
});

upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      originalImageSrc = reader.result; // Originalbild speichern
      img.src = originalImageSrc;
      imageLoaded = true; // Zustand setzen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    reader.readAsDataURL(file);
  }
  compareImagesBtn.disabled = false; // Button aktivieren
});

// Bild ins Canvas zeichnen
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  saveState();
};

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      // Bild in das Canvas zeichnen
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Buttons aktivieren
      setButtonsState(true);
    };
    img.src = URL.createObjectURL(file);
  }
});

addTextFeatureBtn.addEventListener("click", () => {
  textModal.classList.remove("hidden");
});

applyTextBtn.addEventListener("click", () => {
  const text = modalTextInput.value.trim();
  const font = fontSelect.value;
  const fontSize = fontSizeInput.value;
  const fontWeight = fontWeightSelect.value;
  const color = colorPicker.value;
  const position = positionSelect.value;

  if (text && imageLoaded) {
    ctx.font = `${fontWeight} ${fontSize}px ${font}`;
    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textHeight = parseInt(fontSize, 10); // Approximate height of the text
    const { x, y } = getTextPosition(
      position,
      canvas.width,
      canvas.height,
      textWidth,
      textHeight
    );

    // Draw text at the calculated position
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    saveState(); // Save the state
    textModal.classList.add("hidden");
    modalTextInput.value = ""; // Clear the input
  } else {
    alert("Please load an image and enter valid text!");
  }
});

closeModalBtn.addEventListener("click", () => {
  textModal.classList.add("hidden");
  modalTextInput.value = ""; // Clear the input
});

// Nachricht "Bild hierher ziehen"
function drawDragAndDropMessage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "20px Arial";
  ctx.fillStyle = "#555";
  ctx.textAlign = "center";
  ctx.fillText("Bild hierher ziehen", canvas.width / 2, canvas.height / 2);
}

// Initiale Nachricht anzeigen
if (!imageLoaded) {
  drawDragAndDropMessage();
}

// Rotate-Funktion
rotateBtn.addEventListener("click", () => {
  if (imageLoaded) {
    rotationAngle = (rotationAngle + 90) % 360;

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = canvas.height;
    tempCanvas.height = canvas.width;

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate((Math.PI / 180) * 90); // 90 degrees in radians
    tempCtx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

    canvas.width = tempCanvas.width;
    canvas.height = tempCanvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(tempCanvas, 0, 0);

    saveState();
  }
});

grayscaleBtn.addEventListener("click", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // Red
    data[i + 1] = avg; // Green
    data[i + 2] = avg; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
  saveState();
});

flipHorizontalBtn.addEventListener("click", () => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.scale(-1, 1);
  tempCtx.drawImage(canvas, -canvas.width, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
  saveState();
});

flipVerticalBtn.addEventListener("click", () => {
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  tempCtx.translate(0, canvas.height);
  tempCtx.scale(1, -1);
  tempCtx.drawImage(canvas, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tempCanvas, 0, 0);
  saveState();
});

undoBtn.addEventListener("click", () => {
  if (historyIndex > 0) {
    historyIndex--;
    restoreState();
  }
});

redoBtn.addEventListener("click", () => {
  if (historyIndex < history.length - 1) {
    historyIndex++;
    restoreState();
  }
});

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = canvas.toDataURL();
  link.click();
});

// Vorher-Nachher-Vergleich anzeigen
compareImagesBtn.addEventListener("click", () => {
  if (!originalImageSrc || !imageLoaded) {
    alert("Bitte zuerst ein Bild hochladen!");
    return;
  }

  const originalImage = document.getElementById("originalImage");
  const editedCanvas = document.getElementById("editedCanvas");
  const currentCanvas = document.getElementById("canvas");
  const compareModal = document.getElementById("compareModal");
  const closeCompareModalBtn = document.getElementById("closeCompareModalBtn");

  // Ensure elements exist
  if (
    originalImage &&
    editedCanvas &&
    currentCanvas &&
    compareModal &&
    closeCompareModalBtn
  ) {
    // Load original image
    originalImage.src = originalImageSrc;

    // Copy edited image
    const context = editedCanvas.getContext("2d");
    editedCanvas.width = currentCanvas.width;
    editedCanvas.height = currentCanvas.height;
    context.drawImage(currentCanvas, 0, 0);

    // Show modal
    compareModal.classList.remove("hidden");

    // Close modal
    closeCompareModalBtn.addEventListener("click", () => {
      compareModal.classList.add("hidden");
    });
  } else {
    console.error("One or more elements are missing.");
  }
});

// Get the invert colors button
const invertColorsButton = document.getElementById("invertColors");

// Add event listener for the invert colors button
invertColorsButton.addEventListener("click", () => {
  const context = canvas.getContext("2d");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Invert colors
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // Red
    data[i + 1] = 255 - data[i + 1]; // Green
    data[i + 2] = 255 - data[i + 2]; // Blue
  }

  // Put the modified image data back on the canvas
  context.putImageData(imageData, 0, 0);

  // Save the state
  saveState();
});

// Ensure the invert colors button is enabled when appropriate
function setButtonsState(enabled) {
  featureButtons.forEach((button) => {
    button.disabled = !enabled;
  });
  invertColorsButton.disabled = !enabled;
}
