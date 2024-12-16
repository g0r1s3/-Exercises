from flask import Flask, jsonify, request

app = Flask(__name__)

# Data

todos = [
    {"id": 1, "task": "Python lernen", "done": False},
    {"id": 2, "task": "REST-API schreiben", "done": True}
]

# Routes

@app.route('/todos', methods=['GET'])
def get_todos():
    return jsonify(todos)

@app.route('/todos/<int:todo_id>', methods=['GET'])
def get_todo(todo_id):
    todo = next((t for t in todos if t['id'] == todo_id), None)
    if todo:
        return jsonify(todo)
    return jsonify({"error": "Task not found"}), 404

@app.route('/todos', methods=['POST'])
def create_todo():
    data = request.json
    new_todo = {
        "id": len(todos) + 1,
        "task": data.get("task"),
        "done": False
    }
    todos.append(new_todo)
    return jsonify(new_todo), 20

@app.route('/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    todo = next((t for t in todos if t['id'] == todo_id), None)
    if todo:
        data = request.json
        todo["task"] = data.get("task", todo["task"])
        todo["done"] = data.get("done", todo["done"])
        return jsonify(todo)
    return jsonify({"error": "Task not found"}), 404

@app.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    global todos
    todos = [t for t in todos if t['id'] != todo_id]
    return jsonify({"message": "Task deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)