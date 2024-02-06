# from flask import Flask, request, jsonify
# import numpy as np
# from sudocu import create_sudoku_board, solve_sudoku

# app = Flask(__name__)

# @app.route('/solve', methods=['POST'])
# def solve():
#     data = request.json['board']
#     board = np.array(data).reshape((9, 9))
#     solved_board = solve_sudoku(board.tolist())  # Используйте функцию для решения судоку

#     if solved_board:
#         return jsonify({'board': solved_board})
#     else:
#         return jsonify({'error': 'Нет решения'}), 400

# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify, send_from_directory
import numpy as np
from sudocu import solve_sudoku

app = Flask(__name__, template_folder='templates', static_folder='static')

@app.route('/')
def index():
    return send_from_directory('.', 'templates/index.html')

@app.route('/solve', methods=['POST'])
def solve():
    data = request.json['board']
    board = np.array(data)  # Преобразование входных данных в массив NumPy
    solved_board = solve_sudoku(board)  # Прямой вызов с массивом NumPy

    if isinstance(solved_board, np.ndarray):  # Проверка, что возвращается массив NumPy
        return jsonify({'board': solved_board.tolist()})  # Преобразование в список для JSON
    else:
        return jsonify({'error': 'Нет решения'}), 400

if __name__ == '__main__':
    app.run(debug=True)
