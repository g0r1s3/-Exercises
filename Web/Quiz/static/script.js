async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok && data.redirect) {
    // Weiterleitung zum Dashboard
    window.location.href = data.redirect;
  } else {
    alert(data.error || "Registrierung fehlgeschlagen.");
  }
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
    // Erfolgreicher Login: Weiterleitung zum Dashboard
    window.location.href = "/quiz-dashboard";
  } else {
    // Fehleranzeige
    document
      .getElementById("auth")
      .insertAdjacentHTML(
        "beforeend",
        `<p style="color: red;">${data.error}</p>`
      );
  }
}
