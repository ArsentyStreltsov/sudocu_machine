import numpy as np
import pandas as pd

# Функция для создания пустой доски судоку
def create_sudoku_board():
    board = np.zeros((9, 9), dtype=int)
    return board

# Функция для проверки правил судоку
def is_valid_move(board, row, col, num):
    # Проверка по горизонтали и вертикали
    if num in board[row, :] or num in board[:, col]:
        return False

    # Проверка внутри 3x3 блока
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)
    subgrid = board[start_row:start_row + 3, start_col:start_col + 3]
    if num in subgrid:
        return False

    return True

# Функция для решения судоку с использованием рекурсии
def solve_sudoku(board):
    empty_cell = find_empty_cell(board)
    if not empty_cell:
        return True  # Доска полностью заполнена
    row, col = empty_cell

    for num in range(1, 10):
        if is_valid_move(board, row, col, num):
            board[row, col] = num
            if solve_sudoku(board):
                return True
            board[row, col] = 0  # Отменить ход, если решение не найдено

    return False  # Нет допустимых решений

# Функция для поиска пустой ячейки на доске
def find_empty_cell(board):
    for row in range(9):
        for col in range(9):
            if board[row, col] == 0:
                return row, col
    return None

# Функция для отображения доски судоку
def print_sudoku(board):
    df = pd.DataFrame(board)
    print(df)

# Основная функция приложения
def main():
    sudoku_board = create_sudoku_board()

    # Ввод пользователем начальной позиции судоку
    print("Введите начальное состояние судоку (0 для пустой ячейки):")
    for i in range(9):
        row = input(f"Введите строку {i + 1}: ")
        for j in range(9):
            if row[j].isdigit() and 1 <= int(row[j]) <= 9:
                sudoku_board[i, j] = int(row[j])

    print("Исходная судоку:")
    for row in sudoku_board:
        print(" ".join(map(str, row)))

    if solve_sudoku(sudoku_board):
        print("\nРешенная судоку:")
        for row in sudoku_board:
            print(" ".join(map(str, row)))
    else:
        print("\nНет допустимого решения для судоку.")

if __name__ == "__main__":
    main()
