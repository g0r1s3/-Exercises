// CRUD-Operations + Extras

// Example
// category: "self-development"
// date: "2024-11-14T07:54:49.691Z"
// description: "Mental imagery exercises to focus on positive goals and outcomes."
// duration: 15
// name: "visualizations"
// user: "g0r1s3"

// Create
// starts with "create"
// ends with "InLocalStorage"

const createExerciseInLocalStorage = (exerciseObject) => {
  localStorage.setItem(
    `cq-${exerciseObject.user}-${exerciseObject.date}`,
    JSON.stringify(exerciseObject)
  );
};

// Read
// starts with "get"
// ends with "FromLocalStorage"

const getExercisesForUserFromLocalStorage = (username) => {
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

const getDailyStreakForUserFromLocalStorage = (username) => {
  // Übungen des Nutzers aus dem localStorage abrufen
  const exercises = getExercisesForUserFromLocalStorage(username);

  // Übungen nach Datum (aufsteigend) sortieren
  exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (exercises.length === 0) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Uhrzeit auf Mitternacht setzen

  for (let i = exercises.length - 1; i >= 0; i--) {
    const exerciseDate = new Date(exercises[i].date);
    exerciseDate.setHours(0, 0, 0, 0); // Auch auf Mitternacht setzen

    if (currentDate.getTime() === exerciseDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (currentDate > exerciseDate) {
      break;
    }
  }
  return streak;
};

const getExercisesFromLastXDaysForUserFromLocalStorage = (x, username) => {
  const exercisesForUser = getExercisesForUserFromLocalStorage(username);
  const exercisesDuringXDays = [];
  const now = new Date();

  exercisesForUser.forEach((exercise) => {
    const exerciseDate = new Date(exercise.date);
    const differenceInDays = (now - exerciseDate) / (1000 * 60 * 60 * 24);

    if (differenceInDays <= x) {
      exercisesDuringXDays.push(exercise);
    }
  });

  return exercisesDuringXDays;
};

const getExerciseForCategoryForUserFromLocalStorage = (category, username) => {
  const exercisesForUser = getExercisesForUserFromLocalStorage(username);
  const exercisesForCategory = exercisesForUser.filter(
    (exercise) => exercise.category === category
  );
  return exercisesForCategory;
};

// Update
// starts with "update"
// ends with "InLocalStorage"

// Delete
// starts with "delete"
// ends with "FromLocalStorage"

const deleteEverythingFromLocalStorage = () => {
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

// Extras

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
