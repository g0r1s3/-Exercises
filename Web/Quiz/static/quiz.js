let quizData = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
  }
  return array;
}

async function startQuiz(region, questionCount) {
  try {
    const response = await fetch(
      `/quiz?region=${region}&questions=${questionCount}`
    );
    if (!response.ok) throw new Error("Fehler beim Laden der Fragen.");

    quizData = await response.json();
    currentQuestionIndex = 0;
    correctAnswers = 0;

    displayQuiz();
  } catch (error) {
    console.error(error);
    alert("Das Quiz konnte nicht gestartet werden.");
  }
}

function displayQuiz() {
  document.getElementById("quiz-dashboard").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  loadQuestion();
}

function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    showSummary();
    return;
  }

  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const currentQuestion = quizData[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";

  // Antworten zufällig mischen
  const shuffledOptions = shuffleArray([...currentQuestion.options]);

  shuffledOptions.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () =>
      checkAnswer(
        option,
        currentQuestion.correct_answer,
        currentQuestion.id,
        button
      );
    answersElement.appendChild(button);
  });
}

function checkAnswer(selectedOption, correctAnswer, questionId, button) {
  fetch(`/quiz/${questionId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer: selectedOption }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Feedback visuell anzeigen
      if (data.correct) {
        button.classList.add("correct"); // Feld grün färben
        correctAnswers++; // Zähler aktualisieren
      } else {
        button.classList.add("incorrect"); // Feld rot färben
      }

      // Kurze Pause vor der nächsten Frage
      setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
      }, 500); // Kürzere Pause
    })
    .catch((error) => {
      console.error("Fehler beim Überprüfen der Antwort:", error);
    });
}

function displayQuestion(data) {
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");

  questionElement.textContent = data.question;
  answersElement.innerHTML = "";

  data.options.forEach((option) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = () =>
      checkAnswer(option, data.correct_answer, data.id, button);
    answersElement.appendChild(button);
  });
}

function showSummary() {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = `
    <h2>Quiz beendet!</h2>
    <p>Du hast ${correctAnswers} von ${quizData.length} Fragen richtig beantwortet.</p>
    <button onclick="window.location.href='/quiz-dashboard'">Zurück zum Dashboard</button>
  `;
}
