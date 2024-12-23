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
const dashboardExercisesCompletedDuration = document.getElementById(
  "dashboard-exercises-completed-duration"
);
const dashboardExercisesCompleted = document.getElementById(
  "dashboard-exercises-completed"
);

const dashboardExercisesCompletedThisWeek = document.getElementById(
  "dashboard-exercises-completed-this-week"
);
const dashboardDailyStreak = document.getElementById("dashboard-daily-streak");
const advancedStats = document.getElementById("advanced-stats");

const exerciseSelection = document.getElementById("exercise-selection");
const exerciseDuration = document.getElementById("exercise-duration");
const footerText = document.getElementById("footer-text");

const addGoalForm = document.getElementById("add-goal-form");
const addGoalExerciseSelection = document.getElementById(
  "add-goal-exercise-selection"
);
