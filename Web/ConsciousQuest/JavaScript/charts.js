// Kreisdiagramm

const canvas = document.getElementById("category-chart");
const ctx = canvas.getContext("2d");

// Beispiel-Daten und Farben // z. B. Prozentwerte
const labels = [
  "Achtsamkeit und Entspannung",
  "Selbstentwicklung und Inspiration",
  "Bewegung und Körper",
  "Wissen und Reflexion",
];
const colors = ["#aac4ff", "#b1b2ff", "#d2daff", "#A3A37B"];

const returnCategoryChartData = () => {
  // Beispiel Kategorien
  const exercises = getExercisesForUserFromLocalStorage(user.name);
  let totalTime = 0;

  // Initialisieren der Zeit pro Kategorie
  let categoryTime = {
    mindfulness: 0,
    "self-development": 0,
    movement: 0,
    knowledge: 0,
  };

  // Berechnung der Gesamtzeit und der Zeit pro Kategorie
  exercises.forEach((exercise) => {
    totalTime += exercise.duration;
    if (exercise.category === "mindfulness") {
      categoryTime.mindfulness += exercise.duration;
    } else if (exercise.category === "self-development") {
      categoryTime["self-development"] += exercise.duration;
    } else if (exercise.category === "movement") {
      categoryTime.movement += exercise.duration;
    } else if (exercise.category === "knowledge") {
      categoryTime.knowledge += exercise.duration;
    }
  });

  // Prozentuale Anteile berechnen
  const categoryPercentages = {
    mindfulness: Math.round((categoryTime.mindfulness / totalTime) * 100),
    "self-development": Math.round(
      (categoryTime["self-development"] / totalTime) * 100
    ),
    movement: Math.round((categoryTime.movement / totalTime) * 100),
    knowledge: Math.round((categoryTime.knowledge / totalTime) * 100),
  };

  // Um die Summe auf exakt 100 zu bringen, wird die Differenz korrigiert
  const percentageValues = Object.values(categoryPercentages);
  const percentageSum = percentageValues.reduce((sum, value) => sum + value, 0);
  const difference = 100 - percentageSum;

  // Korrektur der Werte
  if (difference !== 0) {
    const categories = Object.keys(categoryPercentages);
    categoryPercentages[categories[0]] += difference;
  }

  return [
    categoryPercentages.mindfulness,
    categoryPercentages["self-development"],
    categoryPercentages.movement,
    categoryPercentages.knowledge,
  ];
};

// Funktion zum Zeichnen des Tortendiagramms
function drawPieChart(colors) {
  const data = returnCategoryChartData();
  const total = data.reduce((sum, value) => sum + value, 0); // Gesamtsumme der Daten
  let startAngle = 0; // Startwinkel bei 0 Grad

  data.forEach((value, index) => {
    const sliceAngle = (value / total) * 2 * Math.PI; // Anteil in Grad

    // Zeichnen eines Abschnitts
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2); // Mittelpunkt
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.height / 2,
      startAngle,
      startAngle + sliceAngle
    );
    ctx.closePath();
    ctx.fillStyle = colors[index];
    ctx.fill();

    // Aktualisieren des Startwinkels für den nächsten Abschnitt
    startAngle += sliceAngle;
  });
}

function createLegend(labels, colors) {
  const legendContainer = document.getElementById("category-chart-legend");
  labels.forEach((label, index) => {
    const legendItem = document.createElement("div");
    legendItem.style.display = "flex";
    legendItem.style.alignItems = "center";
    legendItem.style.marginBottom = "4px";

    const colorBox = document.createElement("span");
    colorBox.style.width = "16px";
    colorBox.style.height = "16px";
    colorBox.style.backgroundColor = colors[index];
    colorBox.style.display = "inline-block";
    colorBox.style.marginRight = "8px";

    const labelText = document.createElement("span");
    labelText.innerText = label;

    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);
    legendContainer.appendChild(legendItem);
  });
}

// Aufrufen der Funktion
drawPieChart(colors);
createLegend(labels, colors);
