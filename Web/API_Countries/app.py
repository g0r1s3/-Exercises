from flask import Flask, jsonify, request
import json
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
app = Flask(__name__)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour", " per minute"]
)

API_KEY = "087ashduijhaw4afa0we4afphuidsf78q3"



@app.before_request
def check_api_key():
    key = request.headers.get('x-api-key')
    if key != API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

# Daten laden
with open('countries.json', 'r') as file:
    countries = json.load(file)

# Endpunkt: Alle Länder abrufen
@app.route('/countries', methods=['GET'])
def get_countries():
    return jsonify(countries), 200

# Endpunkt: Einzelnes Land abrufen
@app.route('/countries/<string:country>', methods=['GET'])
def get_country(country):
    result = [c for c in countries if c['name'].lower() == country.lower()]
    if result:
        return jsonify(result[0]), 200
    return jsonify({"error": "Country not found"}), 404

# Endpunkt: Neues Land hinzufügen (Admin-restricted)
@app.route('/countries', methods=['POST'])
def add_country():
    data = request.get_json()
    if not data or 'name' not in data or 'capital' not in data or 'population' not in data:
        return jsonify({"error": "Invalid input"}), 400
    countries.append(data)
    with open('countries.json', 'w') as file:
        json.dump(countries, file, indent=4)
    return jsonify({"message": "Country added successfully"}), 201

if __name__ == '__main__':
    app.run(debug=True)