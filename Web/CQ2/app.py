from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
import os




app = Flask(__name__)
app.secret_key = os.urandom(24)  # Zufälliger Key bei jedem Start
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # SQLite-Datenbank
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Flask-Login Setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)


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
    return render_template("dashboard.html", username=current_user.username)

@app.route("/impressum")
def impressum():
    return render_template("impressum.html")

@app.route("/datenschutz")
def datenschutz():
    return render_template("datenschutz.html")

if __name__ == "__main__":
    app.run(debug=True)