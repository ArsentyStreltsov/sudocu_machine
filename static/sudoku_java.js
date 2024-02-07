let grid;   // Initializing the Sudoku grid

window.onload = function () {   // This event handler is fired when the entire HTML document has been completely loaded and parsed.
  grid = document.getElementById('sudoku-grid');    // Getting the DOM element with the id of sudoku-grid and storing it in a grid variable.
  for (let i = 0; i < 81; i++) {    // Loop to create 81 (9x9) Sudoku inputs.
    const input = document.createElement('input');    // Creating a new input element.
    input.type = 'text';    // Setting the attributes of the input element: field type
    input.maxLength = 1;    // maximum length
    input.pattern = '[1-9]*';   //input pattern (only numbers from 1 to 9)
    input.oninput = validateInput;    // Adding an oninput event handler that calls the validateInput function when the field's contents change.

    input.addEventListener('keydown', function (event) {    // Adding a keydown event handler to control arrow keys.
      handleArrowKeys(event, i);
    });

    input.addEventListener('focus', highlight);   // Adding handlers for the focus and blur events, which call the highlight
    input.addEventListener('blur', unhighlight);    // and unhighlight functions respectively.

    const row = Math.floor(i / 9);    // Calculate the current row and column to set the boundaries of 3x3 blocks.
    const col = i % 9;

    // Set border styles to create a visual separation of 3x3 blocks.
    if (col % 3 === 2 && col !== 8) {   // for vertical lines, except the last column
      input.style.borderRight = '3px solid #000000';
    }
    if (row % 3 === 2 && row !== 8) {   // for horizontal lines, except the last row
      input.style.borderBottom = '3px solid #000000';
    }

    grid.appendChild(input);    // Adding an input element to a Sudoku grid.
  }
};


function validateInput(event) {   // Functions for input validation
  this.value = this.value.replace(/[^1-9]/g, '');   // Removes all characters except numbers 1 through 9.
}


function handleArrowKeys(event, index) {    // Function for handling arrow keystrokes
  const targetIndex = {   // Сreate an object where the keys are the directions of the arrows, and the values are the new indices after clicking
    'ArrowLeft': index - 1,
    'ArrowUp': index - 9,
    'ArrowRight': index + 1,
    'ArrowDown': index + 9
  }[event.key];

  if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < 81) {    // Check that the index is within the valid range (0-80)
    document.querySelectorAll('#sudoku-grid input')[targetIndex].focus();   // Focusing an element at a new index

    event.preventDefault();   // Preventing default behavior for arrow keys
  }
}

// 2 functions for highlighting cells
// The highlight and unhighlight functions call the highlightRowColSquare function, turning the highlight on or off, respectively.
function highlight() {
  highlightRowColSquare(this, true);
}

function unhighlight() {
  highlightRowColSquare(this, false);
}

function highlightRowColSquare(element, add) {
  const index = Array.from(grid.children).indexOf(element);   // Find the index of the element in the grid
  const row = Math.floor(index / 9);    // Calculate the row and column number
  const col = index % 9;
  const startRow = row - row % 3;   // Determine the beginning of the 3x3 block
  const startCol = col - col % 3;

  for (let i = 0; i < 9; i++) {   // Loop through cells to highlight row and column
    // Toggle class 'highlight' for row and column
    grid.children[row * 9 + i].classList.toggle('highlight', add);
    grid.children[i * 9 + col].classList.toggle('highlight', add);
  }

  // Toggle class 'highlight' for 3x3 square
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      grid.children[r * 9 + c].classList.toggle('highlight', add);
    }
  }
}

function solveSudoku() {    // Functions for solving and checking Sudoku
  const values = [];    // Creates an array to store Sudoku values.
  const cells = document.querySelectorAll('#sudoku-grid input');    // Gets all input elements in a Sudoku grid.
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;
      const cellValue = cells[index].value === '' ? 0 : parseInt(cells[index].value, 10);   // Convert the cell value to a number, if it is empty, use 0
      row.push(cellValue);
    }
    values.push(row);
  }

  const data = { 'board': values };   // Prepares data for sending to the server.


  fetch('/solve', {     // Send a request to the server to solve Sudoku
    method: 'POST',   // POST request method
    headers: {    // Request headers
      'Content-Type': 'application/json'    // Specify the content type as JSON
    },
    body: JSON.stringify(data)    // Convert the Sudoku data into a JSON string to send
  })
    .then(response => {   // Receive a response from the server
      if (!response.ok) {   // Check if the request was successful
        throw new Error('Network response was not ok');   // If not, throw an error
      }
      return response.json();   // Convert the response to JSON
    })
    .then(result => {   // Process the received result
      if (result.error) {   // Check if the result contains an error
        alert(result.error);    // If yes, print it
      } else {
        const solvedBoard = result.board;   // Get a solved board
        for (let i = 0; i < 9; i++) {   // Update cell values for solved sudoku
          for (let j = 0; j < 9; j++) {
            const index = i * 9 + j;
            cells[index].value = solvedBoard[i][j];   // Set the value to each cell
          }
        }
      }
    })
    .catch(error => {   // Handling possible errors in the request
      console.error('Ошибка:', error);    // Print the error to the console
      alert('Произошла ошибка при обработке вашего запроса. Пожалуйста, проверьте консоль для подробностей.');    // And inform the user
    });
}



function checkSudoku() {    // Repeat the steps of creating an array of Sudoku values, as in solveSudoku for a new function
  const values = [];
  const cells = document.querySelectorAll('#sudoku-grid input');
  for (let i = 0; i < 9; i++) {
    const row = [];
    for (let j = 0; j < 9; j++) {
      const index = i * 9 + j;
      const cellValue = cells[index].value === '' ? 0 : parseInt(cells[index].value, 10);
      row.push(cellValue);
    }
    values.push(row);
  }

  const data = { 'board': values };   // Prepare data to check the sudoku solution
  fetch('/check', {   // Send a request to the server
    method: 'POST',   // POST request method
    headers: {    // Request headers
      'Content-Type': 'application/json'    // Specify the content type as JSON
    },
    body: JSON.stringify(data)    // Convert the Sudoku data into a JSON string to send
  })
    .then(response => {   // Receive a response from the server
      if (!response.ok) {   // Check if the request was successful
        throw new Error('Network response was not ok');   // If not, throw an error
      }
      return response.json();   // Convert the response to JSON
    })
    .then(result => {   // Process the received result
      if (result.valid) {   // Check if the solution is correct
        alert('Congratulations! Your solution is correct.');    // If yes, report success
      } else {
        alert('Sorry, your solution is not correct. Please try again.');    // Иначе предлагаем попробовать снова
      }
    })
    .catch(error => {   // Handling possible errors in the request
      console.error('Ошибка:', error);    // Print the error to the console
      alert('Произошла ошибка при обработке вашего запроса. Пожалуйста, проверьте консоль для подробностей.');    // And inform the user
    });
}
