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
