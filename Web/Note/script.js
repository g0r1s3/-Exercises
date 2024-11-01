"use strict"


// Globale Konstanten
const addNewNoteButton = document.querySelector("#addButton")
const addNewNoteForm = document.querySelector("#addNoteForm")

const editExistingNoteForm = document.querySelector("#editNoteForm")
const noteEditTitle = document.querySelector("#noteEditTitle")
const noteEditContent = document.querySelector("#noteEditContent")
const cancelEditButton = document.querySelector("#cancelEditButton")
const saveEditNoteButton = document.querySelector("#saveEditNoteButton")
let previousNoteTitle = ""
let previousNoteContent = ""

const addNoteButtonForm = document.querySelector("#addNoteButton")
const cancleNoteButtonForm = document.querySelector("#cancelButton")
const newNoteTitle = document.querySelector("#noteTitle")
const newNoteContent = document.querySelector("#noteContent")
const noteList = document.querySelector("#noteList")



// // 1. Notizen hinzufügen

//     1.1 Erstelle JavaScript-Event-Listener für den Button „+“ zum Öffnen des Formulars.
//     1.2 Implementiere eine Funktion, die das Eingabeformular sichtbar macht (CSS-Klasse .hidden entfernen).
addNewNoteButton.addEventListener("click", () => {
    addNewNoteForm.classList.remove("hidden")
})
//     1.3 Füge eine Event-Listener-Funktion für den „Add Note“-Button hinzu.
addNoteButtonForm.addEventListener("click", () => {
    addNewNote(newNoteTitle.value, newNoteContent.value)
    newNoteTitle.value = ""
    newNoteContent.value = ""
    addNewNoteForm.classList.add("hidden")
})

cancleNoteButtonForm.addEventListener("click", () => {
    newNoteTitle.value = ""
    newNoteContent.value = ""
    addNewNoteForm.classList.add("hidden")
})


//     1.4 Entwickle eine Funktion zum Erstellen eines neuen Notizelements (HTML mit noteTitle und noteContent).
//     1.5 Erstelle eine Funktion, um die erstellte Notiz im DOM anzuzeigen.
function addNewNote(title, value) {
    const newNote = document.createElement("div")
    const newNoteTitle = document.createElement("h3")
    const newNoteContent = document.createElement("p")
    const newNoteFooter = document.createElement("div")
    newNoteFooter.classList.add("note-footer")
    const newNoteDate = document.createElement("span")
    const newNoteEdit = document.createElement("span")
    const newNoteDelete = document.createElement("span")
    newNoteDate.innerHTML = getCurrentFormattedDate()
    newNoteEdit.innerHTML = "Edit"
    newNoteEdit.classList.add("edit-note")
    newNoteDelete.innerHTML = "Delete"
    newNoteDelete.classList.add("delete-note")
    newNoteTitle.innerHTML = title
    newNoteContent.innerHTML = value
    newNote.className = "note"
    newNoteFooter.appendChild(newNoteDate)
    newNoteFooter.appendChild(newNoteEdit)
    newNoteFooter.appendChild(newNoteDelete)
    newNote.appendChild(newNoteTitle)
    newNote.appendChild(newNoteContent)
    newNote.appendChild(newNoteFooter)
    // Zur Gesamtliste hinzufügen
    noteList.appendChild(newNote)
}

function deleteNoteByTitleAndContent(title, content) {
    // Das `noteList`-Element selektieren
    
    // Alle Notizen (`.note`-Divs) innerhalb `noteList` finden
    const notes = noteList.getElementsByClassName("note");
    
    // Durch die Notizen iterieren und nach Übereinstimmung suchen
    for (let note of notes) {
        const noteTitle = note.querySelector("h3").innerText;
        const noteContent = note.querySelector("p").innerText;
        
        // Überprüfen, ob Titel und Inhalt übereinstimmen
        if (noteTitle === title && noteContent === content) {
            noteList.removeChild(note);  // Notiz löschen
            console.log("Notiz erfolgreich gelöscht.");
            return;  // Funktion beenden, wenn Notiz gefunden und gelöscht wurde
        }
    }
    
    console.log("Keine Notiz mit diesem Titel und Inhalt gefunden.");
}

function noteExists(title, content) {
    // `noteList`-Element selektieren
    const noteList = document.getElementById("noteList");
    
    // Alle Notizen (`.note`-Divs) innerhalb `noteList` finden
    const notes = noteList.getElementsByClassName("note");

    // Durch die Notizen iterieren und nach Übereinstimmung suchen
    for (let note of notes) {
        const noteTitle = note.querySelector("h3").innerText;
        const noteContent = note.querySelector("p").innerText;
        
        // Überprüfen, ob Titel und Inhalt übereinstimmen mit den globalen Variablen
        if (noteTitle === title && noteContent === content) {
            // Globale Variablen aktualisieren
            previousNoteTitle = title;
            previousNoteContent = content;
            return true;  // Notiz existiert bereits
        }
    }
    
    return false;  // Keine Notiz gefunden
}


// 2. Notizen löschen

//     2.1 Füge jedem Notizelement einen „Löschen“-Button hinzu.
//     2.2 Implementiere eine Funktion, die den „Löschen“-Button erkennt und das zugehörige Notizelement entfernt.

document.addEventListener("DOMContentLoaded", () => {

    // Event-Listener für das Eltern-Element setzen
    noteList.addEventListener("click", (event) => {
        // Prüfen, ob das Ziel-Element die Klasse 'delete-note' hat
        if (event.target.classList.contains("delete-note")) {
            const noteDiv = event.target.closest(".note");
            if (noteDiv) {
                noteDiv.remove(); // Entfernt das übergeordnete .note-Element
            }
        }
    });
});



//     2.3 Aktualisiere die LocalStorage-Daten, um die gelöschte Notiz zu entfernen.

// 3. Notizen bearbeiten

//     3.1 Füge jedem Notizelement einen „Bearbeiten“-Button hinzu.
//     3.2 Entwickle eine Funktion, die den „Bearbeiten“-Modus aktiviert und den Inhalt in die Eingabefelder lädt.
document.addEventListener("DOMContentLoaded", () => {

    // Event-Listener für das Eltern-Element setzen
    noteList.addEventListener("click", (event) => {
        // Prüfen, ob das Ziel-Element die Klasse 'delete-note' hat
        if (event.target.classList.contains("edit-note")) {
            const noteDiv = event.target.closest(".note");
            if (noteDiv) {
                // Open Note Form and fill and save existing
                editExistingNoteForm.classList.remove("hidden")
                // save existing info
                previousNoteTitle = noteDiv.querySelector("h3").innerHTML
                previousNoteContent = noteDiv.querySelector("p").innerHTML

                // fill out form with existing
                noteEditTitle.value = previousNoteTitle
                noteEditContent.value = previousNoteContent
            }
        }
    });
    // if cancle save existing info with old date
    cancelEditButton.addEventListener("click", () => {
        editExistingNoteForm.classList.add("hidden")
    })
    saveEditNoteButton.addEventListener("click", (event) => {
        // if save delete old note and create new one
        if(noteExists(noteEditTitle.value, noteEditContent.value)){
            return
        }
        // Write a function which deletes an existing Note from its title and content
        deleteNoteByTitleAndContent(previousNoteTitle, previousNoteContent)
        // New Note
        addNewNote(noteEditTitle.value, noteEditContent.value)
        // if no changes were made keep old date and old note
    })
});

//     3.3 Füge einen Event-Listener für das Speichern der bearbeiteten Notiz hinzu.
//     3.4 Implementiere eine Funktion, die die bearbeitete Notiz im DOM aktualisiert.
//     3.5 Aktualisiere die LocalStorage-Daten nach dem Bearbeiten.

// 4. LocalStorage-Integration

//     4.1 Implementiere eine Funktion zum Speichern der aktuellen Notizen in LocalStorage.
//     4.2 Entwickle eine Funktion, die beim Laden der Seite die gespeicherten Notizen aus LocalStorage lädt.
//     4.3 Stelle sicher, dass hinzugefügte, gelöschte und bearbeitete Notizen korrekt in LocalStorage aktualisiert werden.

// 5. Zusätzliche Details

//     5.1 Füge eine Datum-/Uhrzeit-Funktion hinzu, die die Erstellungszeit in jeder Notiz anzeigt.
function getCurrentFormattedDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate beginnen bei 0
    const year = String(now.getFullYear()).slice(-2); // Nur die letzten zwei Ziffern
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} | ${hours}:${minutes}`;
}

//     5.2 Implementiere eine Validierungsfunktion für leere Eingabefelder (für Titel und Inhalt).
//     5.3 Style das Formular und die Notizen-Elemente für eine bessere Benutzererfahrung.





































// // Initialisierung Variablen und Konstanten
// const addNoteForm = document.getElementById("addNoteForm");
// const cancelButton = document.getElementById("cancelButton");
// const addNoteButton = document.getElementById("addNoteButton");

// // Der Button auf dem Hauptbildschirm mit dem eine neue Notiz hinzugefügt werden kann
// const openNewNote = document.getElementById("addButton");

// // Liste der Notizelemente
// const noteList = document.getElementsByTagName("main")[0]

// // Elemente aus dem hinzufügen Formular
// const newNoteTitle = document.getElementById("noteTitle")
// const newNoteContent = document.getElementById("noteContent")

// let oldTitle = ""
// let oldContent = ""

// function getCurrentFormattedTime() {
//     const now = new Date();
//     const day = String(now.getDate()).padStart(2, '0');
//     const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
//     const year = String(now.getFullYear()).slice(-2); // Letzten 2 Stellen des Jahres
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');

//     // z.B. "29.10.24 | 07:57"
//     return `${day}.${month}.${year} | ${hours}:${minutes}`;
// }

// // Funktion, um das Formular anzuzeigen und Hintergrund weichzuzeichnen
// function showAddNoteForm() {
//     addNoteForm.style.display = "flex";
//     // document.body.classList.add("blurred");
// }

// // Funktion, um das Formular zu verstecken und Hintergrund wieder klarzustellen
// function hideAddNoteForm() {
//     addNoteForm.style.display = "none";
//     // document.body.classList.remove("blurred");
//     // Formelemente leeren
//     newNoteTitle.value = ""
//     newNoteContent.value = ""
// }

// function deleteOldNote() {
//     // Durchlaufe alle Notizen in noteList
//     noteList.childNodes.forEach(note => {
//         if (note.classList && note.classList.contains("note")) {
//             // Verwende querySelector und querySelectorAll, um die Elemente gezielt auszuwählen
//             const noteTitle = note.querySelector("h3")?.innerHTML;
//             const noteContent = note.querySelectorAll("p")[0]?.innerHTML;

//             // Vergleiche den Titel und Inhalt mit oldTitle und oldContent
//             if (noteTitle === oldTitle && noteContent === oldContent) {
//                 // Entferne das gefundene Element
//                 note.remove();
//             }
//         }
//     });

//     // Setze oldTitle und oldContent zurück
//     oldTitle = null;
//     oldContent = null;
//     hideAddNoteForm();
// }

// // Event-Listener für die Buttons
// cancelButton.addEventListener("click", hideAddNoteForm);

// addNoteButton.addEventListener("click", () => {
//     // Logik zum Hinzufügen der Notiz
//     // noteList
//     // Erstelle das übergeordnete div-Element
//     const newDiv = document.createElement("div");
//     newDiv.classList.add("note"); // Optional: Klasse für das div

//     // Erstelle das h3-Element
//     const heading = document.createElement("h3");
//     heading.textContent = newNoteTitle.value; // Textinhalt des h3

//     // Erstelle das erste p-Element
//     const firstParagraph = document.createElement("p");
//     firstParagraph.textContent = newNoteContent.value; // Textinhalt des ersten p

//     // Erstelle das zweite p-Element
//     const secondParagraph = document.createElement("p");
//     secondParagraph.textContent = getCurrentFormattedTime(); // Textinhalt des zweiten p

//     // Formelemente leeren
//     newNoteTitle.value = ""
//     newNoteContent.value = ""

//     // Füge die Elemente zum neuen div hinzu
//     newDiv.appendChild(heading);
//     newDiv.appendChild(firstParagraph);
//     newDiv.appendChild(secondParagraph);

//     // Optional: Füge das div zum DOM hinzu (z. B. in einen bestehenden Container)
//     noteList.appendChild(newDiv); // oder document.getElementById("containerId").appendChild(newDiv);

//     deleteOldNote();

//     hideAddNoteForm();
// });

// openNewNote.addEventListener('click', () => {
//     showAddNoteForm()
// })

// // Bestehende Notizen bearbeiten
// // Eventlistener NoteList

// noteList.childNodes.forEach(note => {
//     if (note.classList && note.classList.contains("note")) {
//         note.addEventListener("click", (event) => {
//             oldTitle = event.currentTarget.childNodes[1].innerHTML
//             oldContent = event.currentTarget.childNodes[3].innerHTML
//             newNoteTitle.value = event.currentTarget.childNodes[1].innerHTML
//             newNoteContent.value = event.currentTarget.childNodes[3].innerHTML
//             showAddNoteForm()
//         });
//     }
// });


