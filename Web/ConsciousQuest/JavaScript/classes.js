// Klassendefinitionen
class Exercise {
  constructor(user, name, category, duration, date, description) {
    this.user = user;
    this.name = name; // Name der Übung
    this.category = category; // Kategorie der Übung
    this.duration = duration; // Dauer der Übung
    this.date = date; // Startzeitpunkt der Übung
    this.description = description; // Kurzerklärung der Übung
  }
}

// Wie können alle Übungen abgespeichert werden?
// Die Idee ist, dass bei jedem hinzufügen einer Übung nur ein kleiner Teil des Objekts (Datum, etc.) bearbeitet werden muss

class User {
  constructor(name, exerciseList) {
    this.name = name; // Benutzername
    this.exerciseList = exerciseList; // Übungsliste
    this.goals = []; // Liste von Zielen
  }
}

class Goal {
  constructor(user, category, name, date, type, count, recurring) {
    this.user = user;
    this.category = category;
    this.name = name; // Name der Übung
    this.date = date;
    this.type = type; // daily or yearly?
    this.count = count;
    this.recurring = recurring;
    this.completed = false;
  }
}

const user = new User("g0r1s3", []);
