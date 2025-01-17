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

let img = new Image();
let history = [];
let historyIndex = -1;
let rotationAngle = 0;
let imageLoaded = false; // Zustand: Ob ein Bild geladen wurde

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

// Datei-Upload via Button
upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      imageLoaded = true; // Zustand setzen
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
    };
    reader.readAsDataURL(file);
  }
});

// Bild ins Canvas zeichnen
img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
  saveState();
};

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
