// URLs zur API
const getQuestionUrl = "/quiz";
const checkAnswerUrl = "/quiz";

// Quiz-Container
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const scoreElement = document.getElementById("score");
const summaryElement = document.getElementById("summary");
const resultsElement = document.getElementById("results");

let totalQuestions = 5; // Standardwert, wird dynamisch angepasst

async function fetchTotalQuestions() {
  try {
    const response = await fetch("/quiz/count"); // API-Endpoint zur Gesamtanzahl der Fragen
    if (response.ok) {
      totalQuestions = await response.json();
    } else {
      console.error("Fehler beim Laden der Gesamtanzahl der Fragen.");
      totalQuestions = 5; // Fallback-Wert
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Fragenanzahl:", error);
    totalQuestions = 5; // Fallback-Wert
  }
}

async function startQuiz() {
  await fetchTotalQuestions(); // Sicherstellen, dass die Gesamtanzahl der Fragen geladen wird
  questionsAsked = []; // Liste der gestellten Fragen leeren
  correctAnswers = 0; // Punktestand zurücksetzen
  totalAnswers = 0; // Anzahl der beantworteten Fragen zurücksetzen
  updateScore(); // Punkteanzeige aktualisieren
  await loadQuestion(); // Erste Frage laden
}

startQuiz();

// Quiz-Status
let questionsAsked = [];
let correctAnswers = 0;
let totalAnswers = 0;

// Lade eine neue Frage
async function loadQuestion() {
  // Warte sicherheitshalber auf die Initialisierung von totalQuestions
  if (totalQuestions === 0) {
    await fetchTotalQuestions();
  }

  // Prüfe, ob das Quiz beendet ist (5 Fragen wurden gestellt)
  if (questionsAsked.length >= 5) {
    showSummary();
    return;
  }

  const response = await fetch(getQuestionUrl);
  if (!response.ok) {
    questionElement.textContent = "Fehler beim Laden der Frage.";
    return;
  }

  const data = await response.json();

  // Verhindere doppelte Fragen
  if (questionsAsked.includes(data.id)) {
    loadQuestion(); // Versuche eine andere Frage zu laden
    return;
  }

  // Frage hinzufügen und anzeigen
  questionsAsked.push(data.id);
  displayQuestion(data);
}

// Zeige die Frage und die Antworten
function displayQuestion(data) {
  questionElement.textContent = data.question;
  answersElement.innerHTML = ""; // Antworten zurücksetzen

  data.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () => checkAnswer(data.id, option, button);
    answersElement.appendChild(button);
  });
}

// Prüfe die Antwort
async function checkAnswer(questionId, selectedAnswer, button) {
  const response = await fetch(`${checkAnswerUrl}/${questionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: selectedAnswer }),
  });

  const data = await response.json();

  // Aktualisiere die Punkteanzeige
  totalAnswers++;
  if (data.correct) {
    correctAnswers++;
    button.classList.add("correct");
  } else {
    button.classList.add("incorrect");
  }
  updateScore();

  // Nach kurzem Delay nächste Frage laden
  setTimeout(loadQuestion, 1500);
}

// Aktualisiere die Punkteanzeige
function updateScore() {
  scoreElement.textContent = `Fragen beantwortet: ${totalAnswers} | Richtig: ${correctAnswers}`;
}

// Zeige die Zusammenfassung
function showSummary() {
  questionElement.style.display = "none"; // Verstecke die Fragen
  answersElement.style.display = "none"; // Verstecke die Antworten
  summaryElement.style.display = "block"; // Zeige die Zusammenfassung

  resultsElement.textContent = `Du hast ${correctAnswers} von ${totalAnswers} Fragen richtig beantwortet.`;
}

// Quiz zurücksetzen
function restartQuiz() {
  summaryElement.style.display = "none"; // Zusammenfassung ausblenden
  questionElement.style.display = "block"; // Fragebereich anzeigen
  answersElement.style.display = "block"; // Antwortenbereich anzeigen

  startQuiz(); // Sicherer Neustart des Quiz
}

// Erste Frage laden
loadQuestion();

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  alert(data.message || data.error);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();

  if (response.ok) {
    alert(data.message);
    document.getElementById("auth").style.display = "none";
    document.getElementById("quiz").style.display = "block";
  } else {
    alert(data.error);
  }
}
