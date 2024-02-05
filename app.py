# from flask import Flask, request, jsonify
# import numpy as np
# import json

# app = Flask(__name__)

# # Ваш код Python для решения судоку здесь

# @app.route('/solve', methods=['POST'])
# def solve():
#     data = request.json['board']
#     board = np.array(data).reshape((9, 9))
#     if solve_sudoku(board):
#         return jsonify({'board': board.tolist()})
#     else:
#         return jsonify({'error': 'Нет решения'}), 400

# if __name__ == '__main__':
#     app.run(debug=True)
