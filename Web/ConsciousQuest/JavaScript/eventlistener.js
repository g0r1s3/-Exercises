// Eventlisteners

document.addEventListener("DOMContentLoaded", (event) => {
  // Überprüfen, ob categorySelection existiert
  const categorySelection = document.getElementById("category-selection");
  categorySelection.selectedIndex = 0; // Setzt die erste Option als ausgewählt
  // Dashboard beim Laden aufbauen
  buildHeatmap();
  refreshDashboard(user.name);
});

document.addEventListener("change", (event) => {
  if (
    event.target.tagName === "SELECT" &&
    event.target.id === "category-selection"
  ) {
    // Übung auswählen Select aktivieren und die korrekten Optionen anzeigen.
    exerciseSelection.disabled = false;
    if (event.target.value === "mindfulness") {
      exerciseSelection.innerHTML = `<option value="" disabled selected>Übung auswählen</option>
  <option value="meditation">Meditationen</option>
  <option value="breathing-exercises">Atemübungen</option>
  <option value="mindfulness-exercises">Achtsamkeitsübungen</option>
  <option value="relaxation-techniques">Entspannungstechniken</option>
  <option value="guided-meditation">Geführte Meditationen</option>
  `;
    } else if (event.target.value === "self-development") {
      exerciseSelection.innerHTML = `<option value="" disabled selected>Übung auswählen</option>
  <option value="visualizations">Visualisierungen</option>
  <option value="affirmations">Affirmationen / Autosuggestionen</option>
  <option value="gratitude-practice">Dankbarkeitspraxis</option>
  <option value="positive-visualization">Positive Visualisierung</option>
  <option value="mantras">Mantras</option>
  <option value="self-coaching">Selbstcoaching</option>
  `;
    } else if (event.target.value === "movement") {
      exerciseSelection.innerHTML = `<option value="" disabled selected>Übung auswählen</option>
  <option value="yoga">Yoga</option>
  <option value="stretching">Dehnungen</option>
  <option value="walking">Spaziergang</option>
          `;
    } else if (event.target.value === "knowledge") {
      exerciseSelection.innerHTML = `<option value="" disabled selected>Übung auswählen</option>
  <option value="reading">Lesen</option>
  <option value="journaling">Journaling</option>
  <option value="self-reflection">Selbstreflexion</option>
  <option value="creative-writing">Kreatives Schreiben</option>
  <option value="focus-exercises">Konzentrationsübungen</option>
          `;
    }
  }
});

document.addEventListener("click", (event) => {
  if (event.target.id === "add-exercise-btn") {
    const selectedExercise =
      document.getElementById("exercise-selection").value;
    addExercise(selectedExercise);
  }
  if (event.target.id === "toggle-advanced-stats") {
    advancedStats.classList.toggle("hidden");
  }
});
