"use strict";

// Klassendefinitionen
class Exercise {
  constructor(user, name, category, duration, date, description) {
    this.user = user;
    this.name = name; // Name der Übung
    this.category = category; // Kategorie der Übung
    this.duration = duration; // Dauer der Übung
    this.date = date; // Startzeitpunkt der Übung
    this.description = description; // Kurzerklärung der Übung
  }
}

// Wie können alle Übungen abgespeichert werden?
// Die Idee ist, dass bei jedem hinzufügen einer Übung nur ein kleiner Teil des Objekts (Datum, etc.) bearbeitet werden muss

class User {
  constructor(name, exerciseList) {
    this.name = name; // Benutzername
    this.exerciseList = exerciseList; // Übungsliste
  }
}

const user = new User("g0r1s3", []);

const heatmapTable = document.getElementById("dashboard-calendar-heatmap");
const dayRows = {
  0: document.getElementById("dashboard-calendar-heatmap-sundays"),
  1: document.getElementById("dashboard-calendar-heatmap-mondays"),
  2: document.getElementById("dashboard-calendar-heatmap-tuesdays"),
  3: document.getElementById("dashboard-calendar-heatmap-wednesdays"),
  4: document.getElementById("dashboard-calendar-heatmap-thursdays"),
  5: document.getElementById("dashboard-calendar-heatmap-fridays"),
  6: document.getElementById("dashboard-calendar-heatmap-saturdays"),
};

const footerText = document.getElementById("footer-text");
const currentYear = new Date().getFullYear();
footerText.textContent = `© ${currentYear} ConsciousQuest`;

const dashboardExercisesCompletedDuration = document.getElementById(
  "dashboard-exercises-completed-duration"
);
const dashboardExercisesCompleted = document.getElementById(
  "dashboard-exercises-completed"
);
const dashboardDailyStreak = document.getElementById("dashboard-daily-streak");
const exerciseSelection = document.getElementById("exercise-selection");

// Functions

const addExercise = (exercise) => {
  const exerciseDataFromHardcode = {
    name: exercise,
    category: "",
    description: "",
  };
  const foundExercise = exerciseData.find((item) => item.name === exercise);
  if (foundExercise) {
    exerciseDataFromHardcode.category = foundExercise.category;
    exerciseDataFromHardcode.description = foundExercise.description;
  } else {
    console.error("Übung nicht gefunden:", exercise);
  }
  const completionTime = new Date().toISOString(); // Aktueller Zeitpunkt als lesbares Format
  console.log(
    `Übung ${exercise} erfolgreich abgeschlossen am ${completionTime}.`
  );
  const exerciseObject = new Exercise(
    user.name,
    exerciseDataFromHardcode.name,
    exerciseDataFromHardcode.category,
    completionTime,
    completionTime,
    exerciseDataFromHardcode.description
  );
  // console.log(exerciseObject);
  saveExerciseToLocalStorage(exerciseObject);
  refreshDashboard(user.name);
  // Jetzt muss das Objekt im Localstorage gespeichert werden
  // Anschließend sollte es unter Dein Profil im Dashboard ausgegeben werden
  // Welche Localstorage Funktionen werden generell benötigt? Am besten gleich alle Programmieren

  //   Jetzt zum Datenobjekt im LocalStorage hinzufügen
  // console.log(user.exerciseList);
  //   Irgendwo müssen die ganzen Exercises abgespeichert worden sein
  //   Anschließend auf dem Profil ausgeben
};

// LocalStorage Funktionen

const getDailyStreak = (username) => {
  // Übungen des Nutzers aus dem localStorage abrufen
  const exercises = returnExercisesFromLocalStorageForUser(username);

  // Logge die geladenen Übungen, um sicherzustellen, dass sie korrekt geladen wurden
  console.log("Loaded exercises:", exercises);

  // Übungen nach Datum (aufsteigend) sortieren
  exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (exercises.length === 0) {
    console.log("No exercises found, returning streak of 0");
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Uhrzeit auf Mitternacht setzen

  for (let i = exercises.length - 1; i >= 0; i--) {
    const exerciseDate = new Date(exercises[i].date);
    exerciseDate.setHours(0, 0, 0, 0); // Auch auf Mitternacht setzen

    console.log(`Checking exercise at index ${i}:`, exerciseDate);

    if (currentDate.getTime() === exerciseDate.getTime()) {
      streak++;
      console.log(`Streak increased to ${streak}`);
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (currentDate > exerciseDate) {
      console.log("Non-consecutive day found, breaking streak");
      break;
    }
  }

  console.log("Final streak:", streak);
  return streak;
};

const saveExerciseToLocalStorage = (exerciseObject) => {
  localStorage.setItem(
    `cq-${exerciseObject.user}-${exerciseObject.date}`,
    JSON.stringify(exerciseObject)
  );
};

const returnExercisesFromLocalStorageForUser = (username) => {
  const exercises = [];
  // Über alle Schlüssel im localStorage iterieren
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Prüfen, ob der Schlüssel mit "cq-{username}-" beginnt
    if (key.startsWith(`cq-${username}-`)) {
      const exerciseObject = JSON.parse(localStorage.getItem(key)); // Objekt parsen
      exercises.push(exerciseObject); // Objekt zur Liste hinzufügen
    }
  }
  return exercises;
};

const printLocalStorage = () => {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Nur Schlüssel ausgeben, die mit "cq-" beginnen
    if (key.startsWith("cq-")) {
      const value = localStorage.getItem(key);
      console.log(`Schlüssel: ${key}, Wert: ${value}`);
    }
  }
};

const deleteLocalStorage = () => {
  // Durchlaufe alle Schlüssel und speichere die zu löschenden
  const keysToDelete = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Füge nur Schlüssel hinzu, die mit "cq-" beginnen
    if (key.startsWith("cq-")) {
      keysToDelete.push(key);
    }
  }
  // Entferne die gespeicherten Schlüssel
  keysToDelete.forEach((key) => localStorage.removeItem(key));
  console.log("Alle 'cq-' Einträge wurden aus dem LocalStorage entfernt.");
};

const refreshHeatmapFromLocalStorage = () => {
  // Ab welchem Datum muss ich beginnen?
  const trElement = document.getElementById(
    "dashboard-calendar-heatmap-sundays"
  );
  const firstTd = trElement.firstElementChild;
  const tooltipText = firstTd ? firstTd.getAttribute("title") : null;

  // Speichere alle Exercises in einer Liste ab und ändere darin das Datum in das richtige Format um
  const exerciseList = returnExercisesFromLocalStorageForUser(user.name);
  exerciseList.forEach((exercise) => {
    const originalDate = new Date(exercise.date);
    const day = String(originalDate.getDate()).padStart(2, "0");
    const month = String(originalDate.getMonth() + 1).padStart(2, "0");
    const year = originalDate.getFullYear();

    exercise.date = `${day}-${month}-${year}`;
  });

  // Erstelle ein Dict, dass jedes Datum abspeichert und zählt wie oft eine Übung an dem Datum absolviert wurde
  const dateCounts = {};
  exerciseList.forEach((exercise) => {
    const date = exercise.date;

    if (dateCounts[date]) {
      dateCounts[date]++;
    } else {
      dateCounts[date] = 1;
    }
  });

  // Umwandlung von tooltipText in ein Date-Objekt für den Vergleich
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const startDate = tooltipText ? parseDate(tooltipText) : null;

  // Debugging-Ausgaben
  console.log("Startdatum (tooltipText):", tooltipText);
  console.log("Liste der Übungen mit formatierten Daten:", exerciseList);
  console.log("Zähler pro Datum (dateCounts):", dateCounts);

  // Nur relevante TD-Elemente auswählen und CSS-Klassen basierend auf der Übungsanzahl zuweisen
  const heatmapTable = document.getElementById("dashboard-calendar-heatmap");
  const tdElements = heatmapTable.getElementsByTagName("TD");

  Array.from(tdElements).forEach((td) => {
    const dateStr = td.getAttribute("title");
    if (dateStr && dateCounts[dateStr]) {
      const currentDate = parseDate(dateStr);

      // Verarbeite nur Daten, die nach dem Startdatum (tooltipText) liegen
      if (startDate && currentDate >= startDate) {
        const count = dateCounts[dateStr];

        // Vorherige Klassen entfernen
        td.classList.remove(
          "dashboard-calender-heatmap-level-1",
          "dashboard-calender-heatmap-level-2",
          "dashboard-calender-heatmap-level-3"
        );

        // Entsprechende Klasse basierend auf der Eintragsanzahl hinzufügen
        if (count >= 3) {
          td.classList.add("dashboard-calender-heatmap-level-3");
        } else if (count === 2) {
          td.classList.add("dashboard-calender-heatmap-level-2");
        } else if (count === 1) {
          td.classList.add("dashboard-calender-heatmap-level-1");
        }
        td.setAttribute(
          "title",
          `${dateStr} - ${count} Beiträge an diesem Tag`
        );
      }
    }
  });
};

// Dashboard / Profile

const refreshDashboard = (username) => {
  dashboardExercisesCompletedDuration.innerHTML = `Total exercise time: ${
    returnExercisesFromLocalStorageForUser(username).length * 15
  } min`;
  dashboardDailyStreak.innerHTML = `Daily streak: ${getDailyStreak(username)}`;
  dashboardExercisesCompleted.innerHTML = `Total exercises completed: ${
    returnExercisesFromLocalStorageForUser(username).length
  }`;
  refreshHeatmapFromLocalStorage();
};

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
});

// Hardcoded Data

const exerciseData = [
  {
    name: "meditation",
    category: "mindfulness",
    description:
      "A practice to calm the mind and focus on the present moment, often through breath or mantra.",
  },
  {
    name: "breathing-exercises",
    category: "mindfulness",
    description:
      "Techniques focused on breath control to reduce stress and increase mental clarity.",
  },
  {
    name: "mindfulness-exercises",
    category: "mindfulness",
    description:
      "Activities to enhance awareness and acceptance of the present moment without judgment.",
  },
  {
    name: "relaxation-techniques",
    category: "mindfulness",
    description:
      "Methods designed to release tension and reduce stress in the body and mind.",
  },
  {
    name: "guided-meditation",
    category: "mindfulness",
    description:
      "Meditations led by a voice guiding focus, relaxation, and awareness through prompts.",
  },
  {
    name: "visualizations",
    category: "self-development",
    description:
      "Mental imagery exercises to focus on positive goals and outcomes.",
  },
  {
    name: "affirmations",
    category: "self-development",
    description:
      "Positive statements repeated to reinforce self-belief and encourage positive mindset.",
  },
  {
    name: "gratitude-practice",
    category: "self-development",
    description:
      "A habit of reflecting on things to be thankful for, fostering a positive outlook.",
  },
  {
    name: "positive-visualization",
    category: "self-development",
    description:
      "Imagining successful outcomes to inspire motivation and belief in achieving goals.",
  },
  {
    name: "mantras",
    category: "self-development",
    description:
      "Words or phrases repeated to focus the mind and cultivate specific intentions.",
  },
  {
    name: "self-coaching",
    category: "self-development",
    description:
      "Guiding oneself through personal goals and challenges to foster growth and resilience.",
  },
  {
    name: "yoga",
    category: "movement",
    description:
      "A series of postures and breathing exercises to improve flexibility, strength, and relaxation.",
  },
  {
    name: "stretching",
    category: "movement",
    description:
      "Exercises aimed at increasing flexibility and relieving muscle tension.",
  },
  {
    name: "walking",
    category: "movement",
    description:
      "A low-impact physical activity that promotes overall health and mental clarity.",
  },
  {
    name: "reading",
    category: "knowledge",
    description:
      "The act of absorbing written information to increase knowledge and stimulate the mind.",
  },
  {
    name: "journaling",
    category: "knowledge",
    description:
      "Writing down thoughts and experiences to reflect, clarify, and process emotions.",
  },
  {
    name: "self-reflection",
    category: "knowledge",
    description:
      "The practice of examining one's thoughts and actions to gain insight and growth.",
  },
  {
    name: "creative-writing",
    category: "knowledge",
    description:
      "Expressing thoughts and stories through writing, boosting creativity and self-expression.",
  },
  {
    name: "focus-exercises",
    category: "knowledge",
    description:
      "Activities that train concentration, helping to improve mental clarity and attention span.",
  },
];

// Wählt das Heatmap-Container-Element aus

function popFutureTDs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Setze die Zeit auf Mitternacht für den Vergleich

  // Alle TD-Elemente in der Tabelle finden
  const tdElements = heatmapTable.getElementsByTagName("TD");

  // Schleife über die TD-Elemente
  Array.from(tdElements).forEach((td) => {
    const dateStr = td.getAttribute("title");
    if (dateStr) {
      // Datum aus dem Titel im Format TT-MM-YYYY in ein Date-Objekt konvertieren
      const [day, month, year] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day); // Monate sind nullbasiert

      // Wenn das Datum in der Zukunft liegt, das Element entfernen
      if (date > today) {
        td.remove();
      }
    }
  });
}

const buildHeatmap = () => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - today.getDay());

  Object.keys(dayRows).forEach((dayIndex) => {
    const parentElement = dayRows[dayIndex];
    const dates = [];

    // Berechne das Datum des letzten gewünschten Wochentags (z.B. Montag, Dienstag)
    let currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + parseInt(dayIndex));

    // Füge die letzten 53 spezifischen Wochentage hinzu
    for (let i = 0; i < 53; i++) {
      const dd = String(currentDate.getDate()).padStart(2, "0");
      const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
      const yyyy = currentDate.getFullYear();
      const formattedDate = `${dd}-${mm}-${yyyy}`;

      dates.push(formattedDate);

      // Gehe um 7 Tage zurück, um den vorherigen spezifischen Wochentag zu finden
      currentDate.setDate(currentDate.getDate() - 7);
    }

    // Erstelle die `TD`-Elemente mit Tooltip und füge sie in die entsprechende Reihe (TR) für diesen Wochentag ein
    dates.reverse().forEach((date) => {
      const td = document.createElement("TD");
      td.setAttribute("title", date); // Tooltip mit Datum setzen
      parentElement.appendChild(td);
    });
    popFutureTDs();
  });
};
// Startdatum auf den letzten Sonntag setzen, unabhängig vom heutigen Wochentag
