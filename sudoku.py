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



def check_sudoku_solution(board):
    # Проверяем, является ли входной параметр массивом NumPy, если нет - преобразуем
    if not isinstance(board, np.ndarray):
        board = np.array(board)
    
    # Перебираем все строки и столбцы
    for i in range(9):
        row = board[i, :]
        if not np.all(np.sort(row) == np.arange(1, 10)):
            return False  # Если условие не выполняется, возвращаем False

        col = board[:, i]
        if not np.all(np.sort(col) == np.arange(1, 10)):
            return False  # Если условие не выполняется, возвращаем False

    # Перебираем все 3x3 блоки
    for i in range(0, 9, 3):
        for j in range(0, 9, 3):
            block = board[i:i+3, j:j+3].flatten()
            if not np.all(np.sort(block) == np.arange(1, 10)):
                return False  # Если условие не выполняется, возвращаем False

    return True  # Если все проверки пройдены успешно, возвращаем True

