document.addEventListener("DOMContentLoaded", () => {
  const audioPlayer = document.getElementById("audio-player");

  //   FIX: Vorspulen im Audioplayer verhindern!
  if (audioPlayer) {
    let lastAllowedTime = 0;

    // Aktualisiere die letzte erlaubte Position während der Wiedergabe
    audioPlayer.addEventListener("timeupdate", () => {
      lastAllowedTime = audioPlayer.currentTime;
    });

    // Blockiere Vorspulen
    audioPlayer.addEventListener("seeked", () => {
      if (audioPlayer.currentTime > lastAllowedTime) {
        audioPlayer.currentTime = lastAllowedTime; // Springe zurück zur letzten erlaubten Position
      }
    });

    // Meditation abgeschlossen
    audioPlayer.addEventListener("ended", () => {
      fetch(audioPlayer.dataset.completedUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.status === 204) {
            // Zeige Flash-Nachricht an
            const flashMessage = document.createElement("div");
            flashMessage.className = "flash-message";
            flashMessage.textContent = "Meditation erfolgreich abgeschlossen!";
            document.body.appendChild(flashMessage);

            // Nachricht nach 5 Sekunden entfernen
            setTimeout(() => flashMessage.remove(), 5000);
          }
        })
        .catch((error) => console.error("Fehler:", error));
    });
  }
});
