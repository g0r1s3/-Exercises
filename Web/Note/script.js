"use strict"

// Initialisierung Variablen und Konstanten
const addNoteForm = document.getElementById("addNoteForm");
const cancelButton = document.getElementById("cancelButton");
const addNoteButton = document.getElementById("addNoteButton");

// Der Button auf dem Hauptbildschirm mit dem eine neue Notiz hinzugefügt werden kann
const openNewNote = document.getElementById("addButton");

// Liste der Notizelemente
const noteList = document.getElementsByTagName("main")[0]

// Elemente aus dem hinzufügen Formular
const newNoteTitle = document.getElementById("noteTitle")
const newNoteContent = document.getElementById("noteContent")

function getCurrentFormattedTime() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = String(now.getFullYear()).slice(-2); // Letzten 2 Stellen des Jahres
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // z.B. "29.10.24 | 07:57"
    return `${day}.${month}.${year} | ${hours}:${minutes}`;
}

// Funktion, um das Formular anzuzeigen und Hintergrund weichzuzeichnen
function showAddNoteForm() {
    addNoteForm.style.display = "flex";
    // document.body.classList.add("blurred");
}

// Funktion, um das Formular zu verstecken und Hintergrund wieder klarzustellen
function hideAddNoteForm() {
    addNoteForm.style.display = "none";
    // document.body.classList.remove("blurred");
    // Formelemente leeren
    newNoteTitle.value = ""
    newNoteContent.value = ""
}

// Event-Listener für die Buttons
cancelButton.addEventListener("click", hideAddNoteForm);

addNoteButton.addEventListener("click", () => {
    // Logik zum Hinzufügen der Notiz
    // noteList
    // Erstelle das übergeordnete div-Element
    const newDiv = document.createElement("div");
    newDiv.classList.add("note"); // Optional: Klasse für das div

    // Erstelle das h3-Element
    const heading = document.createElement("h3");
    heading.textContent = newNoteTitle.value; // Textinhalt des h3

    // Erstelle das erste p-Element
    const firstParagraph = document.createElement("p");
    firstParagraph.textContent = newNoteContent.value; // Textinhalt des ersten p

    // Erstelle das zweite p-Element
    const secondParagraph = document.createElement("p");
    secondParagraph.textContent = getCurrentFormattedTime(); // Textinhalt des zweiten p

    // Formelemente leeren
    newNoteTitle.value = ""
    newNoteContent.value = ""

    // Füge die Elemente zum neuen div hinzu
    newDiv.appendChild(heading);
    newDiv.appendChild(firstParagraph);
    newDiv.appendChild(secondParagraph);

    // Optional: Füge das div zum DOM hinzu (z. B. in einen bestehenden Container)
    noteList.appendChild(newDiv); // oder document.getElementById("containerId").appendChild(newDiv);


    hideAddNoteForm();
});

openNewNote.addEventListener('click', () => {
    showAddNoteForm()
})