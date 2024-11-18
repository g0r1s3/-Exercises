"use strict";

const currentYear = new Date().getFullYear();
footerText.textContent = `© ${currentYear} ConsciousQuest`;

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
  const exerciseObject = new Exercise(
    user.name,
    exerciseDataFromHardcode.name,
    exerciseDataFromHardcode.category,
    parseInt(exerciseDuration.value),
    completionTime,
    exerciseDataFromHardcode.description
  );
  createExerciseInLocalStorage(exerciseObject);
  refreshDashboard(user.name);
  exerciseDuration.value = 1;
};

// Dashboard / Profile

const refreshDashboard = (username) => {
  // Berechnung der gesamten Übungszeit in Minuten
  // Berechnung der gesamten Übungszeit in Minuten
  const totalExerciseTime = getExercisesForUserFromLocalStorage(
    username
  ).reduce((total, exercise) => {
    if (typeof exercise.duration === "number") {
      // Wenn `duration` ein Integer ist, füge den Wert hinzu
      return total + exercise.duration;
    } else {
      // Wenn `duration` ein String (Datumsangabe) ist, füge pauschal 15 Minuten hinzu
      return total + 15;
    }
  }, 0);

  // Ausgabe der gesamten Übungszeit
  dashboardExercisesCompletedDuration.innerHTML = `Total exercise time: ${totalExerciseTime} min`;

  dashboardDailyStreak.innerHTML = `Daily streak: ${getDailyStreakForUserFromLocalStorage(
    username
  )}`;
  dashboardExercisesCompleted.innerHTML = `Total exercises completed: ${
    getExercisesForUserFromLocalStorage(username).length
  }`;
  dashboardExercisesCompletedThisWeek.innerHTML = `Total exercises completed during last 7 days: ${
    getExercisesFromLastXDaysForUserFromLocalStorage(7, user.name).length
  }`;
  refreshHeatmapFromLocalStorage();
  drawPieChart(colors);
};
