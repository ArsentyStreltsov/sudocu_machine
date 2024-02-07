import numpy as np  # the NumPy library is imported, which provides the array and matrix functionality used in this code

def create_sudoku_board():  # Function to create an empty Sudoku board
    return np.zeros((9, 9), dtype=int)  # creates a 9x9 array filled with zeros, where each zero represents an empty cell in Sudoku. also indicates that the data type in the array is integers.

def is_valid_move(board, row, col, num):  # Function for checking Sudoku rules
    if num in board[row] or num in board[:, col]:  # Checks whether num is in the current row or in the current column col.
        return False  #  If yes, False is returned.
    start_row, start_col = 3 * (row // 3), 3 * (col // 3)  # Specifies the starting row and column of the 3x3 block that the cell falls into.
    if num in board[start_row:start_row+3, start_col:start_col+3]:  # Checks if num is present inside a 3x3 block.
        return False  # If yes, False is returned.
    return True  # If all checks pass, True is returned, i.e. the number num can be placed in the specified cell.

def solve_sudoku(board):  # Function for solving Sudoku using recursion
    if isinstance(board, list):  # Converts a board from a list of lists to a NumPy array if it is not already in that format.
        board = np.array(board)
    
    empty_cell = find_empty_cell(board)  # Finds the first empty cell on the board.
    if empty_cell is None:  # If there are no empty cells,
        return board  # returns the solved board.
    
    row, col = empty_cell  # Unpacks the coordinates of an empty cell.

    for num in range(1, 10):  # Tries to place all numbers from 1 to 9 in an empty cell.
        if is_valid_move(board, row, col, num):  # Checks whether placing the number num will violate the rules of Sudoku.
            board[row, col] = num  # Places num in the cell if valid.
            if solve_sudoku(board) is not False:  # Recursively tries to solve Sudoku with a new number on the board. 
                return board  # Returns the board if a solution is found.
            board[row, col] = 0  # Resets the cell to 0 (empty) if a solution is not found with the current num.

    return False  # Returns False if a solution cannot be found.

def find_empty_cell(board):  # Function to find an empty cell on the board
    for row in range(9):  # Iterates through all rows and 
        for col in range(9):  # columns of the board.
            if board[row, col] == 0:
                return row, col  # Returns the coordinates of the first empty cell. 
    return None  # Returns None if there are no empty cells.

def check_sudoku_solution(board):  # Function for checking the solution of Sudoku
    if not isinstance(board, np.ndarray):  # Converts the board to a NumPy array 
        board = np.array(board)  # if it is not already in that format.
    
    for i in range(9):  # Iterates through all rows and columns to check.
        row = board[i, :]  # Checks whether each string contains all numbers 
        if not np.all(np.sort(row) == np.arange(1, 10)):  # from 1 to 9 without repetitions.
            return False
        col = board[:, i]
        if not np.all(np.sort(col) == np.arange(1, 10)):  # Does the same for each column.
            return False

    for i in range(0, 9, 3):  # Does the same for each 3х3 block.
        for j in range(0, 9, 3):
            block = board[i:i+3, j:j+3].flatten()  # Converts a 3x3 block to a one-dimensional array.
            if not np.all(np.sort(block) == np.arange(1, 10)):  # Checks if the block contains all numbers from 1 to 9 without repetitions.
                return False

    return True  # Returns True if all checks pass successfully.
