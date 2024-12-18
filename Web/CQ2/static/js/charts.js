document.addEventListener("DOMContentLoaded", () => {
  const moodChartElem = document.getElementById("mood-chart");
  const energyChartElem = document.getElementById("energy-chart");

  // Daten aus data-* Attributen lesen
  const moodLevels = JSON.parse(moodChartElem.dataset.moodLevels);
  const energyLevels = JSON.parse(energyChartElem.dataset.energyLevels);
  const entryCount = moodLevels.map((_, index) => index + 1); // Eintragsnummern generieren (1, 2, 3, ...)

  // Standard-Optionen für beide Diagramme
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: { color: "#ffffff" }, // Heller Text für die Legende
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" }, // Heller Text für X-Achse
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#ffffff" }, // Heller Text für Y-Achse
        min: 0, // Y-Achse startet bei 0
        max: 10, // Y-Achse endet bei 10
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  // Stimmungschart
  new Chart(moodChartElem, {
    type: "line",
    data: {
      labels: entryCount, // X-Achse: Eintragsnummern
      datasets: [
        {
          label: "Stimmung",
          data: moodLevels,
          borderColor: "#48cae4", // Blau
          backgroundColor: "rgba(72, 202, 228, 0.2)",
          pointBackgroundColor: "#48cae4",
          pointRadius: 5,
          tension: 0.3,
        },
      ],
    },
    options: chartOptions,
  });

  // Energiechart
  new Chart(energyChartElem, {
    type: "line",
    data: {
      labels: entryCount, // X-Achse: Eintragsnummern
      datasets: [
        {
          label: "Energie",
          data: energyLevels,
          borderColor: "#ff9f43", // Akzentfarbe Orange
          backgroundColor: "rgba(255, 159, 67, 0.2)",
          pointBackgroundColor: "#ff9f43",
          pointRadius: 5,
          tension: 0.3,
        },
      ],
    },
    options: chartOptions,
  });
});
