let grid; // Глобальная переменная для доступа к сетке судоку

window.onload = function () {
  // Инициализация переменной grid
  grid = document.getElementById('sudoku-grid');
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.pattern = '[1-9]*';
    input.oninput = validateInput;
    input.addEventListener('keydown', function (event) {
      handleArrowKeys(event, i);
    });
    input.addEventListener('focus', highlight);
    input.addEventListener('blur', unhighlight);

    // Определение стиля границы в зависимости от индекса ячейки
    const row = Math.floor(i / 9);
    const col = i % 9;

    // Установка границ для блоков 3x3
    if (col % 3 === 2 && col !== 8) { // для вертикальных линий, кроме последней колонки
      input.style.borderRight = '3px solid #000000';
    }
    if (row % 3 === 2 && row !== 8) { // для горизонтальных линий, кроме последнего ряда
      input.style.borderBottom = '3px solid #000000';
    }

    grid.appendChild(input);
  }
};

// Остальные функции используют переменную grid без изме

function validateInput(event) {
  // Удаляем все символы, кроме цифр
  this.value = this.value.replace(/[^1-9]/g, '');
}

function handleArrowKeys(event, index) {
  const targetIndex = {
    'ArrowLeft': index - 1,
    'ArrowUp': index - 9,
    'ArrowRight': index + 1,
    'ArrowDown': index + 9
  }[event.key];

  if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < 81) {
    document.querySelectorAll('#sudoku-grid input')[targetIndex].focus();
    event.preventDefault(); // Предотвращаем дефолтное поведение для стрелочных клавиш
  }
}

function highlight() {
  // console.log('Element focused'); // Добавлено для отладки
  highlightRowColSquare(this, true);
}

function unhighlight() {
  // console.log('Element unfocused'); // Добавлено для отладки
  highlightRowColSquare(this, false);
}

function highlightRowColSquare(element, add) {
  const index = Array.from(grid.children).indexOf(element);
  // console.log('Index of element:', index); // Добавлено для отладки

  const row = Math.floor(index / 9);
  const col = index % 9;
  // console.log('Row:', row, 'Col:', col); // Добавлено для отладки

  const startRow = row - row % 3;
  const startCol = col - col % 3;
  // console.log('Square start - Row:', startRow, 'Col:', startCol); // Добавлено для отладки

  for (let i = 0; i < 9; i++) {
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


function solveSudoku() {
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

  const data = { 'board': values };
  fetch('/solve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    if (result.error) {
      alert(result.error);
    } else {
      const solvedBoard = result.board;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const index = i * 9 + j;
          cells[index].value = solvedBoard[i][j];
        }
      }
    }
  })
  .catch(error => {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при обработке вашего запроса. Пожалуйста, проверьте консоль для подробностей.');
  });
}



function checkSudoku() {
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

  const data = { 'board': values };
  fetch('/check', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      if (result.valid) {
        alert('Congratulations! Your solution is correct.');
      } else {
        alert('Sorry, your solution is not correct. Please try again.');
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при обработке вашего запроса. Пожалуйста, проверьте консоль для подробностей.');
    });
}
