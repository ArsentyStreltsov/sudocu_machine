from flask import Flask, request, jsonify, send_from_directory    # importing the necessary components from Flask
import numpy as np    # importing a library
from sudoku import solve_sudoku, check_sudoku_solution    # importing functions from a sudoku file to work with them here


app = Flask(__name__, template_folder='templates', static_folder='static')    # creating an instance of the Flask application. Specifying the paths to folders with templates and static files, respectively

@app.route('/')   # define the route for the root url to call the function below
def index():
    return send_from_directory('.', 'templates/index.html')   # function that sends the index.html file from the templates directory to the client

@app.route('/solve', methods=['POST'])    # define the route for the root url to call the function below
def solve():
    data = request.json['board']    # retrieving the Sudoku board data sent in JSON format from the request
    board = np.array(data)  # сonverting input data to a NumPy array
    solved_board = solve_sudoku(board)  # calls the solve_sudoku function, passing it a Sudoku board as a NumPy array, and gets the solved board

    if isinstance(solved_board, np.ndarray):  # checks that the returned result is a NumPy array
        return jsonify({'board': solved_board.tolist()})  # converts the resolved board back into a list for submission in JSON format
    else:
        return jsonify({'error': 'Нет решения'}), 400   # if a solution is not found, sends an error message with HTTP status 400


@app.route('/check', methods=['POST'])    # define the route for the root url to call the function below
def check():
    data = request.json['board']    # similarly, it retrieves board data from the request
    board = np.array(data)  # converts data to a NumPy array
    if check_sudoku_solution(board):  # calls the check_sudoku_solution function to check whether the provided Sudoku board solution is valid
        return jsonify({'valid': True})   # if the solution is valid, returns JSON with confirmation of validity
    else:
        return jsonify({'valid': False})    # if the solution is invalid, returns JSON indicating invalidity


if __name__ == '__main__':    # starts the application in debug mode if the script is run directly and not imported into another module
    app.run(debug=True)   # debug mode allows you to see detailed error messages and automatically reload the application when the code changes