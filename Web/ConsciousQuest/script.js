"use strict";

// Klassendefinitionen
class Exercise {
  constructor(name, category, duration, date, description) {
    this.name = name; // Name der Übung
    this.category = category; // Kategorie der Übung
    this.duration = duration; // Dauer der Übung
    this.date = date; // Startzeitpunkt der Übung
    this.description = description; // Kurzerklärung der Übung
  }
}

class User {
  constructor(name, exerciseList) {
    this.name = name; // Benutzername
    this.exerciseList = exerciseList; // Übungsliste
  }
}

const footerText = document.getElementById("footer-text");
const currentYear = new Date().getFullYear();
footerText.textContent = `© ${currentYear} ConsciousQuest`;

const exerciseSelection = document.getElementById("exercise-selection");

// Eventlisteners

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
    console.log(event.target.value);
  }
});
