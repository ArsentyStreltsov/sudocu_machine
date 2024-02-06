import numpy as np

# Функция для создания пустой доски судоку
def create_sudoku_board():
    return np.zeros((9, 9), dtype=int)

# Функция для проверки правил судоку
def is_valid_move(board, row, col, num):
    # Проверка по горизонтали и вертикали
    if num in board[row] or num in board[:, col]:
        return False

    # Проверка внутри 3x3 блока
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    if num in board[start_row:start_row+3, start_col:start_col+3]:
        return False

    return True

# Функция для решения судоку с использованием рекурсии
def solve_sudoku(board):
    # Если board является списком, преобразуем его в массив NumPy
    if isinstance(board, list):
        board = np.array(board)
    
    # Найти пустую ячейку
    empty_cell = find_empty_cell(board)
    if empty_cell is None:
        return board  # Возвращаем решенную доску
    row, col = empty_cell

    for num in range(1, 10):
        if is_valid_move(board, row, col, num):
            board[row, col] = num
            if solve_sudoku(board) is not False:
                return board
            board[row, col] = 0

    return False

# Функция для поиска пустой ячейки на доске
def find_empty_cell(board):
    for row in range(9):
        for col in range(9):
            if board[row, col] == 0:
                return row, col
    return None
