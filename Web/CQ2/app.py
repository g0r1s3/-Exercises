from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = os.path.join("static", "audio")
ALLOWED_EXTENSIONS = {'mp3', 'wav', 'ogg'}

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Zufälliger Key bei jedem Start
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # SQLite-Datenbank
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
db = SQLAlchemy(app)

# Flask-Login Setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Meditation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    audio_file = db.Column(db.String(200), nullable=False)  # Pfad zur Audiodatei
    duration = db.Column(db.Integer, nullable=False)  # Dauer in Sekunden
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

class CompletedMeditation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    meditation_id = db.Column(db.Integer, db.ForeignKey('meditation.id'), nullable=False)
    completed_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    # Beziehungen
    user = db.relationship('User', backref=db.backref('completed_meditations', lazy=True))
    meditation = db.relationship('Meditation', backref=db.backref('completions', lazy=True))

class JournalEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    entry = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    # Beziehung zu User
    user = db.relationship('User', backref=db.backref('journal_entries', lazy=True))

class Achievement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    earned_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    # Beziehung zu User
    user = db.relationship('User', backref=db.backref('achievements', lazy=True))

class UserStats(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    completed_meditations = db.Column(db.Integer, default=0)
    journal_days = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)
    # Beziehung zu User
    user = db.relationship('User', backref=db.backref('stats', lazy=True))


# Erstelle die Tabelle in der Datenbank
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    if current_user.is_authenticated:
        return redirect(url_for("dashboard"))  # Wenn eingeloggt, weiter zum Dashboard
    return redirect(url_for("login"))  # Ansonsten zur Login-Seite

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        password = generate_password_hash(request.form["password"], method="pbkdf2:sha256", salt_length=8)

        # Prüfen, ob E-Mail oder Benutzername bereits existieren
        existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
        if existing_user:
            flash("Benutzername oder E-Mail bereits vergeben.")
            return redirect(url_for("register"))

        # Neuen Benutzer erstellen
        new_user = User(username=username, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()

        # Benutzer automatisch einloggen
        login_user(new_user)
        flash("Registrierung erfolgreich! Willkommen im Dashboard.")
        return redirect(url_for("dashboard"))

    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            flash("Erfolgreich eingeloggt!")
            return redirect(url_for("dashboard"))  # Weiterleitung zum Dashboard
        else:
            flash("Ungültige Anmeldedaten.")
    return render_template("login.html")

@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("Du wurdest erfolgreich ausgeloggt.")
    return redirect(url_for("login"))

@app.route("/dashboard")
@login_required
def dashboard():
    journal_count = JournalEntry.query.filter_by(user_id=current_user.id).count()
    meditation_count = CompletedMeditation.query.filter_by(user_id=current_user.id).count()
    streak = UserStats.query.filter_by(user_id=current_user.id).first().streak if UserStats.query.filter_by(user_id=current_user.id).first() else 0
    achievements = Achievement.query.filter_by(user_id=current_user.id).all()
    return render_template(
        "dashboard.html",
        username=current_user.username,
        journal_count=journal_count,
        meditation_count=meditation_count,
        streak=streak,
        achievements=achievements,
    )

@app.route("/journal", methods=["GET", "POST"])
@login_required
def journal():
    if request.method == "POST":
        # Formular-Daten auslesen
        entry = request.form["entry"]
        mood = request.form["mood"]
        energy = request.form["energy"]
        gratitude = request.form["gratitude"]

        # Neuen Tagebucheintrag erstellen
        new_entry = JournalEntry(
            user_id=current_user.id,
            entry=entry + f"\nStimmung: {mood}, Energie: {energy}\nDankbarkeit: {gratitude}"
        )
        db.session.add(new_entry)
        db.session.commit()

        flash("Tagebucheintrag erfolgreich gespeichert!")
        return redirect(url_for("dashboard"))

    return render_template("journal.html")

@app.route("/journal_entries")
@login_required
def journal_entries():
    # Alle Tagebucheinträge des aktuellen Benutzers abrufen (sortiert nach Datum, absteigend)
    entries = JournalEntry.query.filter_by(user_id=current_user.id).order_by(JournalEntry.created_at.desc()).all()
    return render_template("journal_entries.html", entries=entries)

@app.route("/delete_entry/<int:entry_id>", methods=["POST"])
@login_required
def delete_entry(entry_id):
    # Den zu löschenden Eintrag suchen
    entry = JournalEntry.query.filter_by(id=entry_id, user_id=current_user.id).first()
    if entry:
        db.session.delete(entry)
        db.session.commit()
        flash("Tagebucheintrag erfolgreich gelöscht!")
    else:
        flash("Eintrag nicht gefunden oder keine Berechtigung.")

    return redirect(url_for("journal_entries"))

@app.route("/meditations")
@login_required
def meditations():
    meditations = Meditation.query.all()  # Alle verfügbaren Meditationen aus der DB abrufen
    return render_template("meditations.html", meditations=meditations)

@app.route("/meditation/<int:meditation_id>")
@login_required
def meditation(meditation_id):
    meditation = Meditation.query.get_or_404(meditation_id)
    return render_template("meditation.html", meditation=meditation)

@app.route("/create_meditation", methods=["GET", "POST"])
@login_required
def create_meditation():
    # Überprüfen, ob der eingeloggte Benutzer "admin" ist
    if current_user.username != "admin":
        flash("Du hast keine Berechtigung, Meditationen hochzuladen.")
        return redirect(url_for("dashboard"))

    if request.method == "POST":
        title = request.form["title"]
        description = request.form["description"]
        file = request.files["audio_file"]

        # Prüfen, ob eine Datei hochgeladen wurde und das Format erlaubt ist
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

            # Meditation zur Datenbank hinzufügen
            new_meditation = Meditation(
                title=title,
                description=description,
                audio_file=os.path.join("audio", filename),
                duration=300
            )
            db.session.add(new_meditation)
            db.session.commit()

            flash("Meditation erfolgreich hinzugefügt!")
            return redirect(url_for("dashboard"))
        else:
            flash("Ungültiges Dateiformat. Erlaubt sind: mp3, wav, ogg.")

    return render_template("create_meditation.html")

@app.route("/impressum")
def impressum():
    return render_template("impressum.html")

@app.route("/datenschutz")
def datenschutz():
    return render_template("datenschutz.html")

if __name__ == "__main__":
    with app.app_context():
        # Test-Meditation einmalig in die Datenbank einfügen
        if not Meditation.query.first():  # Prüfen, ob Meditation schon existiert
            m = Meditation(
                title="Test-Meditation",
                description="Eine entspannende Meditation.",
                audio_file="audio/478.mp3",
                duration=300
            )
            db.session.add(m)
            db.session.commit()
            print("Test-Meditation hinzugefügt.")

    app.run(debug=True)