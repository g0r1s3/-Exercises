"use strict";

// Globale Konstanten
const addNewNoteButton = document.querySelector("#addButton");
const addNewNoteForm = document.querySelector("#addNoteForm");
const editExistingNoteForm = document.querySelector("#editNoteForm");
const noteEditTitle = document.querySelector("#noteEditTitle");
const noteEditContent = document.querySelector("#noteEditContent");
const cancelEditButton = document.querySelector("#cancelEditButton");
const saveEditNoteButton = document.querySelector("#saveEditNoteButton");
const addNoteButtonForm = document.querySelector("#addNoteButton");
const cancleNoteButtonForm = document.querySelector("#cancelButton");
const newNoteTitle = document.querySelector("#noteTitle");
const newNoteContent = document.querySelector("#noteContent");
const noteList = document.querySelector("#noteList");
let previousNoteTitle = "";
let previousNoteContent = "";
const downloadButton = document.querySelector("#downloadButton");

// 1. Notizen hinzufügen

addNewNoteButton.addEventListener("click", () => {
  addNewNoteForm.classList.remove("hidden");
  newNoteTitle.value = `${localStorageItemCount() + 1}. Aufgabe`;
});
addNoteButtonForm.addEventListener("click", () => {
  addNewNote(newNoteTitle.value, newNoteContent.value);
  newNoteTitle.value = "";
  newNoteContent.value = "";
  addNewNoteForm.classList.add("hidden");
});
cancleNoteButtonForm.addEventListener("click", () => {
  newNoteTitle.value = "";
  newNoteContent.value = "";
  addNewNoteForm.classList.add("hidden");
});
function addNewNote(title, value) {
  const newNote = document.createElement("div");
  const newNoteTitle = document.createElement("h3");
  const newNoteContent = document.createElement("p");
  const newNoteFooter = document.createElement("div");
  newNoteFooter.classList.add("note-footer");
  const newNoteDate = document.createElement("span");
  const newNoteEdit = document.createElement("span");
  const newNoteDelete = document.createElement("span");
  const currentDate = getCurrentFormattedDate();
  newNoteDate.innerHTML = currentDate;
  saveToLocalStorage(title, value, currentDate);
  newNoteEdit.innerHTML = "Edit";
  newNoteEdit.classList.add("edit-note");
  newNoteDelete.innerHTML = "Delete";
  newNoteDelete.classList.add("delete-note");
  newNoteTitle.innerHTML = title;
  newNoteContent.innerHTML = value;
  newNote.className = "note";
  newNoteFooter.appendChild(newNoteDate);
  newNoteFooter.appendChild(newNoteEdit);
  newNoteFooter.appendChild(newNoteDelete);
  newNote.appendChild(newNoteTitle);
  newNote.appendChild(newNoteContent);
  newNote.appendChild(newNoteFooter);
  // Zur Gesamtliste hinzufügen
  noteList.appendChild(newNote);
}
function addNewNoteFromLocalStorage(title, value, date) {
  const newNote = document.createElement("div");
  const newNoteTitle = document.createElement("h3");
  const newNoteContent = document.createElement("p");
  const newNoteFooter = document.createElement("div");
  newNoteFooter.classList.add("note-footer");
  const newNoteDate = document.createElement("span");
  const newNoteEdit = document.createElement("span");
  const newNoteDelete = document.createElement("span");
  newNoteDate.innerHTML = date;
  newNoteEdit.innerHTML = "Edit";
  newNoteEdit.classList.add("edit-note");
  newNoteDelete.innerHTML = "Delete";
  newNoteDelete.classList.add("delete-note");
  newNoteTitle.innerHTML = title;
  newNoteContent.innerHTML = value;
  newNote.className = "note";
  newNoteFooter.appendChild(newNoteDate);
  newNoteFooter.appendChild(newNoteEdit);
  newNoteFooter.appendChild(newNoteDelete);
  newNote.appendChild(newNoteTitle);
  newNote.appendChild(newNoteContent);
  newNote.appendChild(newNoteFooter);
  // Zur Gesamtliste hinzufügen
  noteList.appendChild(newNote);
}
function deleteNoteByTitleAndContent(title, content) {
  const notes = noteList.getElementsByClassName("note");
  for (let note of notes) {
    const noteTitle = note.querySelector("h3").innerText;
    const noteContent = note.querySelector("p").innerText;
    // Überprüfen, ob Titel und Inhalt übereinstimmen
    if (noteTitle === title && noteContent === content) {
      noteList.removeChild(note); // Notiz löschen
      console.log("Notiz erfolgreich aud dem DOM gelöscht.");
      return; // Funktion beenden, wenn Notiz gefunden und gelöscht wurde
    }
  }
  console.log("Keine Notiz mit diesem Titel und Inhalt gefunden.");
}

function noteExists(title, content) {
  const noteList = document.getElementById("noteList");
  const notes = noteList.getElementsByClassName("note");
  for (let note of notes) {
    const noteTitle = note.querySelector("h3").innerText;
    const noteContent = note.querySelector("p").innerText;
    if (noteTitle === title && noteContent === content) {
      // Globale Variablen aktualisieren
      previousNoteTitle = title;
      previousNoteContent = content;
      return true; // Notiz existiert bereits
    }
  }
  return false; // Keine Notiz gefunden
}

// 2. Notizen löschen

document.addEventListener("DOMContentLoaded", () => {
  displayNotesFromLocalStorage();
  // Event-Listener für das Eltern-Element setzen
  noteList.addEventListener("click", (event) => {
    // Prüfen, ob das Ziel-Element die Klasse 'delete-note' hat
    if (event.target.classList.contains("delete-note")) {
      const noteDiv = event.target.closest(".note");
      if (noteDiv) {
        deleteFromLocalStorage(
          noteDiv.children[0].innerHTML,
          noteDiv.children[1].innerHTML
        );
        noteDiv.remove(); // Entfernt das übergeordnete .note-Element
      }
    }
  });
});

// 3. Notizen bearbeiten

document.addEventListener("DOMContentLoaded", () => {
  // Event-Listener für das Eltern-Element setzen
  noteList.addEventListener("click", (event) => {
    if (event.target.classList.contains("edit-note")) {
      const noteDiv = event.target.closest(".note");
      if (noteDiv) {
        // Open Note Form and fill and save existing
        editExistingNoteForm.classList.remove("hidden");
        // save existing info
        previousNoteTitle = noteDiv.querySelector("h3").innerHTML;
        previousNoteContent = noteDiv.querySelector("p").innerHTML;

        // fill out form with existing
        noteEditTitle.value = previousNoteTitle;
        noteEditContent.value = previousNoteContent;
      }
    }
  });
  // if cancle save existing info with old date
  cancelEditButton.addEventListener("click", () => {
    editExistingNoteForm.classList.add("hidden");
  });
  saveEditNoteButton.addEventListener("click", (event) => {
    console.log("Alte bearbeiten");
    // if save delete old note and create new one
    if (noteExists(noteEditTitle.value, noteEditContent.value)) {
      return;
    }
    deleteNoteByTitleAndContent(previousNoteTitle, previousNoteContent);
    // if no changes were made keep old date and old note
    changeAtLocalStorage(
      previousNoteTitle,
      previousNoteContent,
      noteEditTitle.value,
      noteEditContent.value
    );
    addNewNoteFromLocalStorage(
      noteEditTitle.value,
      noteEditContent.value,
      getCurrentFormattedDate()
    );
    editExistingNoteForm.classList.add("hidden");
  });
});

// 4. LocalStorage-Integration / LocalStorage-Funktionen

function saveToLocalStorage(title, content, date) {
  const noteObject = {
    objectTitle: title,
    objectContent: content,
    objectDate: date,
  };
  const uniqueId = `${date}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem(`note-${uniqueId}`, JSON.stringify(noteObject));
}

function deleteFromLocalStorage(title, content) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    // Überprüfe, ob der Schlüssel mit "note" beginnt
    if (key.startsWith("note")) {
      const storedObject = JSON.parse(localStorage.getItem(key));
      // Überprüfe, ob das gespeicherte Objekt den gewünschten Titel und Inhalt hat
      if (
        storedObject.objectTitle === title &&
        storedObject.objectContent === content
      ) {
        // Ich komme irgendwie nie in diese If-Abzweigung
        if (localStorage.getItem(key) !== null) {
          localStorage.removeItem(key);
          console.log(`Key '${key}' successfully deleted.`);
        } else {
          console.log(`Key '${key}' does not exist.`);
        }
        break; // Beende die Schleife, da das Objekt gefunden und gelöscht wurde
      }
    }
  }
}

function changeAtLocalStorage(oldTitle, oldContent, newTitle, newContent) {
  deleteFromLocalStorage(oldTitle, oldContent);
  saveToLocalStorage(newTitle, newContent, getCurrentFormattedDate());
}

function displayNotesFromLocalStorage() {
  const notesFromStorage = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key.startsWith("note-")) {
      // Prüft, ob der Schlüssel mit "note" beginnt
      const value = localStorage.getItem(key);
      const noteObject = JSON.parse(value); // Wandelt den JSON-String in ein Objekt um
      // Überprüfen, ob alle benötigten Felder existieren und definiert sind
      if (
        noteObject &&
        noteObject.objectTitle &&
        noteObject.objectContent &&
        noteObject.objectDate
      ) {
        notesFromStorage.push(noteObject);
      } else {
        console.warn(
          `Ein Eintrag im LocalStorage hat fehlende oder undefinierte Felder: ${key}`
        );
      }
    }
  }
  // Sortieren der Liste alphabetisch nach `objectTitle`
  notesFromStorage.sort((a, b) => {
    if (a.objectTitle < b.objectTitle) {
      return -1; // a kommt vor b
    }
    if (a.objectTitle > b.objectTitle) {
      return 1; // b kommt vor a
    }
    return 0; // keine Änderung
  });
  notesFromStorage.forEach((note) => {
    const title = note.objectTitle;
    const content = note.objectContent;
    const date = note.objectDate;
    addNewNoteFromLocalStorage(title, content, date);
  });
}

function getNotesAsText() {
  const notes = [];

  // Alle Notizen aus dem localStorage holen
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("note-")) {
      const note = JSON.parse(localStorage.getItem(key));
      if (note && note.objectTitle && note.objectContent && note.objectDate) {
        notes.push(note);
      }
    }
  }

  // Alphabetische Sortierung der Notizen nach Titel
  notes.sort((a, b) => a.objectTitle.localeCompare(b.objectTitle));

  // Notizen als String formatieren
  let notesText = "";
  notes.forEach((note) => {
    notesText += `Titel: ${note.objectTitle}\n`;
    notesText += `Inhalt: ${note.objectContent}\n`;
    notesText += `Datum: ${note.objectDate}\n\n`;
  });

  return notesText.trim(); // Entfernt das letzte zusätzliche Zeilenende
}

function localStorageItemCount() {
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("note-")) {
      count++;
    }
  }
  return count;
}

// 5. Zusätzliche Details

function getCurrentFormattedDate() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Monate beginnen bei 0
  const year = String(now.getFullYear()).slice(-2); // Nur die letzten zwei Ziffern
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} | ${hours}:${minutes}`;
}

// General Keydown Events
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Drei Möglichkeiten
    // 1. Weder das Edit noch das new Form ist offen
    // 2. Das Edit Form ist offen
    // 3. Das New Form ist offen
    if (
      addNewNoteForm.classList.contains("hidden") &&
      editExistingNoteForm.classList.contains("hidden")
    ) {
      // Es soll das hinzufügen Menü geöffnet werden
      addNewNoteForm.classList.remove("hidden");
      newNoteTitle.value = `${localStorageItemCount() + 1}. Aufgabe`;
    } else if (
      !addNewNoteForm.classList.contains("hidden") &&
      editExistingNoteForm.classList.contains("hidden")
    ) {
      addNewNote(newNoteTitle.value, newNoteContent.value);
      newNoteTitle.value = "";
      newNoteContent.value = "";
      addNewNoteForm.classList.add("hidden");
    } else if (
      addNewNoteForm.classList.contains("hidden") &&
      !editExistingNoteForm.classList.contains("hidden")
    ) {
      console.log("Alte bearbeiten");
      // if save delete old note and create new one
      if (noteExists(noteEditTitle.value, noteEditContent.value)) {
        return;
      }
      // Hier wird irgendwo die alte Note als neue hinzugefügt. Zusätzlich zu der wirklich neuen. Es werden also zwei in den LS gespeichert
      // Write a function which deletes an existing Note from its title and content
      deleteNoteByTitleAndContent(previousNoteTitle, previousNoteContent);
      // if no changes were made keep old date and old note
      changeAtLocalStorage(
        previousNoteTitle,
        previousNoteContent,
        noteEditTitle.value,
        noteEditContent.value
      );
      addNewNoteFromLocalStorage(
        noteEditTitle.value,
        noteEditContent.value,
        getCurrentFormattedDate()
      );
      editExistingNoteForm.classList.add("hidden");
    }
  }
});

// Download
downloadButton.addEventListener("click", () => {
  const text = getNotesAsText();
  const blob = new Blob([text], { type: "text/plain" });

  // Erstellen eines temporären Links
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Notes.txt"; // Name der heruntergeladenen Datei

  // Automatisches Klicken auf den Link und anschließendes Entfernen
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Titel: 1. Aufgabe
// Inhalt: Ein Flagsystem wäre Toll. Jede Aufgabe soll zusätzlich noch eine Flag bekommen die dann auf der Note angezeigt wird. Das könnte man durch ein Dropdown umsetzen. Dadurch können Kategorien wie "Bug", "Feature" oder "Test" erstellt werden
// Datum: 05.11.24 | 08:12

// Titel: 2. Aufgabe
// Inhalt: Eine Historie über die gelöschten Notizen wäre interessant. Möglicherweise ein Button mit dem man die bereits gelöschten mit Anzeigen kann
// Datum: 05.11.24 | 08:32

// Titel: 3. Aufgabe
// Inhalt: Neben dem Downloadbutton soll in gleichem Stil ein "Renummerierungsbutton" erscheinen. Dieser Passt die Nummerierungen an, sodass aus 1,4,5,6 -> 1,2,3,4 wird.
// Datum: 05.11.24 | 11:35
