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
    const currentDate = getCurrentFormattedDate()
    newNoteDate.innerHTML = currentDate

    // Hier speichern im LocalStorage
    saveToLocalStorage(title, value, currentDate)

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

function addNewNoteFromLocalStorage(title, value, date){
    const newNote = document.createElement("div")
    const newNoteTitle = document.createElement("h3")
    const newNoteContent = document.createElement("p")
    const newNoteFooter = document.createElement("div")
    newNoteFooter.classList.add("note-footer")
    const newNoteDate = document.createElement("span")
    const newNoteEdit = document.createElement("span")
    const newNoteDelete = document.createElement("span")
    newNoteDate.innerHTML = date
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
            console.log("Notiz erfolgreich aud dem DOM gelöscht.");
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
    displayNotesFromLocalStorage()
    // Event-Listener für das Eltern-Element setzen
    noteList.addEventListener("click", (event) => {
        // Prüfen, ob das Ziel-Element die Klasse 'delete-note' hat
        if (event.target.classList.contains("delete-note")) {
            const noteDiv = event.target.closest(".note");
            if (noteDiv) {
                deleteFromLocalStorage(noteDiv.children[0].innerHTML, noteDiv.children[1].innerHTML)
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
        console.log("Alte bearbeiten");
        // if save delete old note and create new one
        if(noteExists(noteEditTitle.value, noteEditContent.value)){
            return
        }
        // Hier wird irgendwo die alte Note als neue hinzugefügt. Zusätzlich zu der wirklich neuen. Es werden also zwei in den LS gespeichert
        // Write a function which deletes an existing Note from its title and content
        deleteNoteByTitleAndContent(previousNoteTitle, previousNoteContent)
        // if no changes were made keep old date and old note
        changeAtLocalStorage(previousNoteTitle, previousNoteContent, noteEditTitle.value, noteEditContent.value)
        addNewNoteFromLocalStorage(noteEditTitle.value, noteEditContent.value, getCurrentFormattedDate())
        editExistingNoteForm.classList.add("hidden")
    })
});

//     3.3 Füge einen Event-Listener für das Speichern der bearbeiteten Notiz hinzu.
//     3.4 Implementiere eine Funktion, die die bearbeitete Notiz im DOM aktualisiert.
//     3.5 Aktualisiere die LocalStorage-Daten nach dem Bearbeiten.

// 4. LocalStorage-Integration

//     4.1 Implementiere eine Funktion zum Speichern der aktuellen Notizen in LocalStorage.
function saveToLocalStorage(title, content, date) {
    const noteObject = {
        objectTitle: title,
        objectContent: content,
        objectDate: date
    };

    // Generiere eine eindeutige ID mit dem Datum und einer Zufallszahl
    const uniqueId = `${date}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    localStorage.setItem(`note-${uniqueId}`, JSON.stringify(noteObject));
}

function deleteFromLocalStorage(title, content) {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Überprüfe, ob der Schlüssel mit "note" beginnt
        if (key.startsWith('note')) {
            const storedObject = JSON.parse(localStorage.getItem(key));
            
            // Überprüfe, ob das gespeicherte Objekt den gewünschten Titel und Inhalt hat
            if (storedObject.objectTitle === title && storedObject.objectContent === content) {
                // Ich komme irgendwie nie in diese If-Abzweigung
                if (localStorage.getItem(key) !== null) {
                    localStorage.removeItem(key);
                    console.log(`Key '${key}' successfully deleted.`);
                } else {
                    console.log(`Key '${key}' does not exist.`);
                }                
                break; // Beende die Schleife, da das Objekt gefunden und gelöscht wurde
            } else {
                console.log("Stored title:", storedObject.objectTitle);
                console.log("Stored content:", storedObject.objectContent);
                console.log("Provided title:", title);
                console.log("Provided content:", content);
                console.log("Element not found");
            }
        }
    }
}

function changeAtLocalStorage(oldTitle, oldContent, newTitle, newContent){
    deleteFromLocalStorage(oldTitle, oldContent)
    saveToLocalStorage(newTitle, newContent, getCurrentFormattedDate())
}

function displayNotesFromLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith('note')) {  // Prüft, ob der Schlüssel mit "note" beginnt
            const value = localStorage.getItem(key);
            const noteObject = JSON.parse(value); // Wandelt den JSON-String in ein Objekt um

            // Überprüfen, ob alle benötigten Felder existieren und definiert sind
            if (noteObject && noteObject.objectTitle && noteObject.objectContent && noteObject.objectDate) {
                const title = noteObject.objectTitle;
                const content = noteObject.objectContent;
                const date = noteObject.objectDate;

                // console.log(`Key: ${key}, Title: ${title}, Content: ${content}, Date: ${date}`);
                
                // Übergibt die tatsächlichen Werte an die Funktion
                addNewNoteFromLocalStorage(title, content, date);
            } else {
                // console.warn(`Ein Eintrag im LocalStorage hat fehlende oder undefinierte Felder: ${key}`);
            }
        }
    }
}

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

// General Keydown Events
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        // Drei Möglichkeiten        
        // 1. Weder das Edit noch das new Form ist offen
        // 2. Das Edit Form ist offen
        // 3. Das New Form ist offen
        if(addNewNoteForm.classList.contains("hidden") && editExistingNoteForm.classList.contains("hidden")){
            // Es soll das hinzufügen Menü geöffnet werden
            addNewNoteForm.classList.remove("hidden")
        } else if(!(addNewNoteForm.classList.contains("hidden")) && editExistingNoteForm.classList.contains("hidden")) {
            addNewNote(newNoteTitle.value, newNoteContent.value)
            newNoteTitle.value = ""
            newNoteContent.value = ""
            addNewNoteForm.classList.add("hidden")
        } else if(addNewNoteForm.classList.contains("hidden") && !(editExistingNoteForm.classList.contains("hidden"))) {
            console.log("Alte bearbeiten");
            // if save delete old note and create new one
            if(noteExists(noteEditTitle.value, noteEditContent.value)){
                return
            }
            // Hier wird irgendwo die alte Note als neue hinzugefügt. Zusätzlich zu der wirklich neuen. Es werden also zwei in den LS gespeichert
            // Write a function which deletes an existing Note from its title and content
            deleteNoteByTitleAndContent(previousNoteTitle, previousNoteContent)
            // if no changes were made keep old date and old note
            changeAtLocalStorage(previousNoteTitle, previousNoteContent, noteEditTitle.value, noteEditContent.value)
            addNewNoteFromLocalStorage(noteEditTitle.value, noteEditContent.value, getCurrentFormattedDate())
            editExistingNoteForm.classList.add("hidden")
        }
    }
});
