"use strict"

const addTaskButton = document.querySelector("#addTaskButton");
const addTaskText = document.querySelector("#addTaskText");
const currentTasksList = document.querySelector("#currentTasksList");

// Funktion, um Aufgaben aus localStorage zu laden
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || []
        tasks.forEach(task => {
            createTaskElement(task);
        });
}

// Funktion zum Erstellen eines li-Elements mit einer Aufgabe
function createTaskElement(taskText) {
    const li = document.createElement('li');
    li.textContent = taskText;
    
    // Erstelle den Button
    const button = document.createElement('button');
    button.textContent = '-';
    button.classList.add("deleteTaskButton"); // Füge die Klasse hinzu
    
    // Button dem li hinzufügen
    li.appendChild(button);
    
    // li der Liste hinzufügen
    currentTasksList.appendChild(li);

    // EventListener für den Button hinzufügen
    addDeleteListeners();
}

// Funktion zum Hinzufügen eines Delete-Listeners zu allen Buttons
function addDeleteListeners() {
    const deleteTaskButtons = document.querySelectorAll(".deleteTaskButton");
    deleteTaskButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const task = e.target.parentElement; // Das entsprechende li-Element
            const taskText = task.firstChild.textContent; // Der Text der Aufgabe

            // Aufgabe aus der Liste entfernen
            task.remove();
            
            // Aufgabe aus localStorage entfernen
            removeTaskFromLocalStorage(taskText);
        });
    });
}

// Funktion zum Hinzufügen einer Aufgabe in localStorage
function saveTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funktion zum Entfernen einer Aufgabe aus localStorage
function removeTaskFromLocalStorage(taskToRemove) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task !== taskToRemove); // Entferne die spezifische Aufgabe
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initiales Laden der Aufgaben aus localStorage
loadTasksFromLocalStorage();

// EventListener für den Add-Button
addTaskButton.addEventListener("click", () => {
    const taskText = addTaskText.value.trim();

    if (taskText !== "") { // Leere Aufgaben verhindern
        createTaskElement(taskText); // Erstelle das Task-Element
        
        saveTaskToLocalStorage(taskText); // Speichere die Aufgabe in localStorage
        
        addTaskText.value = ""; // Textfeld leeren
    }
});

document.addEventListener("keydown", (event) => {
    if(event.key === "Enter" && addTaskText.value != ""){
        const taskText = addTaskText.value.trim();

        if (taskText !== "") { // Leere Aufgaben verhindern
            createTaskElement(taskText); // Erstelle das Task-Element
            
            saveTaskToLocalStorage(taskText); // Speichere die Aufgabe in localStorage
            
            addTaskText.value = ""; // Textfeld leeren
        }
    }
})
