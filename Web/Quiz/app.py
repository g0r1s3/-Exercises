from flask import Flask, jsonify, request, render_template, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import random
import csv
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///quiz.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

app.secret_key = 'supersecretkey123'

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    score = db.Column(db.Integer, default=0)  # Neuer Wert für den Score

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(255), nullable=False)
    options = db.Column(db.String(255), nullable=False)  # Antworten als CSV
    correct_answer = db.Column(db.String(255), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Verweis auf User

with app.app_context():
    db.create_all()

def parse_csv(file):
    questions = []
    reader = csv.DictReader(file.stream.decode('utf-8').splitlines())
    for row in reader:
        questions.append({
            'question': row['question'],
            'options': [row['option1'], row['option2'], row['option3'], row['option4']],
            'correct_answer': row['correct_answer']
        })
    return questions

def parse_json(file):
    data = json.load(file.stream)
    questions = []
    for item in data:
        questions.append({
            'question': item['question'],
            'options': item['options'],
            'correct_answer': item['correct_answer']
        })
    return questions

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Prüfe, ob Benutzername schon existiert
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    # Neuen Benutzer erstellen
    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Benutzer aus der Datenbank abrufen
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        session['username'] = username  # Session speichern
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
    
@app.route('/logout', methods=['GET'])
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logout successful"}), 200    

@app.route('/quiz', methods=['POST'])
def add_question():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    user = User.query.filter_by(username=session['username']).first()
    
    new_question = Question(
        question=data['question'],
        options=",".join(data['options']),
        correct_answer=data['correct_answer'],
        created_by=user.id  # Verweis auf den aktuellen Benutzer
    )
    db.session.add(new_question)
    db.session.commit()
    return jsonify({"message": "Question added successfully!"}), 201

@app.route('/quiz', methods=['GET'])
def get_random_question():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    # Eine zufällige Frage aus der Datenbank abrufen
    question = Question.query.order_by(db.func.random()).first()
    if not question:
        return jsonify({"error": "No questions available"}), 404

    return jsonify({
        "id": question.id,
        "question": question.question,
        "options": question.options.split(',')
    })

@app.route('/quiz/<int:question_id>', methods=['POST'])
def check_answer(question_id):
    question = Question.query.get(question_id)
    if not question:
        return jsonify({"error": "Question not found"}), 404
    
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    data = request.json
    user_answer = data.get("answer")
    user = User.query.filter_by(username=session['username']).first()

    if user_answer == question.correct_answer:
        user.score += 1  # Score erhöhen
        db.session.commit()
        return jsonify({"correct": True, "message": "Correct answer!"})
    else:
        return jsonify({"correct": False, "message": "Wrong answer!"})

@app.route('/my-questions', methods=['GET'])
def my_questions():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    user = User.query.filter_by(username=session['username']).first()
    questions = Question.query.filter_by(created_by=user.id).all()
    return jsonify([{
        "id": q.id,
        "question": q.question,
        "options": q.options.split(','),
        "correct_answer": q.correct_answer
    } for q in questions])

@app.route('/highscores', methods=['GET'])
def highscores():
    users = User.query.order_by(User.score.desc()).all()  # Nach Score sortieren
    return render_template('highscores.html', users=users)

# Frage hinzufügen
@app.route('/add-question', methods=['GET'])
def add_question_form():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    return render_template('add_question.html')

@app.route('/add-question', methods=['POST'])
def handle_add_question():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    # Daten aus dem Formular abrufen
    question_text = request.form.get('question')
    options = request.form.getlist('options[]')
    correct_index = int(request.form.get('correct_answer'))

    if not question_text or len(options) != 4:
        return jsonify({"error": "Invalid input"}), 400

    # Validierung: Der korrekte Index muss zwischen 0 und 3 liegen
    if correct_index < 0 or correct_index >= len(options):
        return jsonify({"error": "Invalid correct answer"}), 400

    # Den aktuell eingeloggten Nutzer abrufen
    user = User.query.filter_by(username=session['username']).first()

    # Frage speichern
    new_question = Question(
        question=question_text,
        options=",".join(options),
        correct_answer=options[correct_index],
        created_by=user.id
    )
    db.session.add(new_question)
    db.session.commit()

    return jsonify({"message": "Question added successfully!"}), 201

# Upload Questions

@app.route('/upload-questions', methods=['GET'])
def upload_questions_form():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    return render_template('upload_questions.html')

@app.route('/upload-questions', methods=['POST'])
def handle_upload_questions():
    if 'username' not in session:
        return jsonify({"error": "User not logged in"}), 401

    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filename = secure_filename(file.filename)
    if filename.endswith('.csv'):
        questions = parse_csv(file)
    elif filename.endswith('.json'):
        questions = parse_json(file)
    else:
        return jsonify({"error": "Unsupported file format. Please upload a CSV or JSON file."}), 400

    # Füge die Fragen in die Datenbank ein
    user = User.query.filter_by(username=session['username']).first()
    added_count = 0  # Zähler für erfolgreich importierte Fragen

    for question in questions:
        # Prüfen, ob die Frage bereits existiert
        if Question.query.filter_by(question=question['question']).first():
            continue

        new_question = Question(
            question=question['question'],
            options=",".join(question['options']),
            correct_answer=question['correct_answer'],
            created_by=user.id
        )
        db.session.add(new_question)
        added_count += 1

    db.session.commit()
    return jsonify({"message": f"{added_count} questions successfully imported!"}), 201

if __name__ == '__main__':
    app.run(debug=True)

