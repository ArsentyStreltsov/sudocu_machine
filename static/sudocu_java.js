// window.onload = function () {
//   const grid = document.getElementById('sudoku-grid');
//   for (let i = 0; i < 81; i++) {
//     const input = document.createElement('input');
//     input.type = 'text';
//     input.maxLength = 1;
//     input.pattern = '[1-9]*';
//     grid.appendChild(input);
//   }
// };

// function solveSudoku() {
//   const values = [];
//   const cells = document.querySelectorAll('#sudoku-grid input');
//   for (let i = 0; i < 9; i++) {
//     const row = [];
//     for (let j = 0; j < 9; j++) {
//       const index = i * 9 + j;
//       row.push(cells[index].value);
//     }
//     values.push(row);
//   }

//   const data = { 'board': values };
//   fetch('/solve', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//     .then(response => response.json())
//     .then(result => {
//       if (result.error) {
//         alert(result.error);
//       } else {
//         // Обновите интерфейс с решенным судоку, если решение получено
//         const solvedBoard = result.board;
//         for (let i = 0; i < 9; i++) {
//           for (let j = 0; j < 9; j++) {
//             const index = i * 9 + j;
//             cells[index].value = solvedBoard[i][j];
//           }
//         }
//       }
//     })
//     .catch(error => {
//       console.error('Ошибка:', error);
//     });
// }

window.onload = function () {
  const grid = document.getElementById('sudoku-grid');
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.pattern = '[1-9]*';
    input.oninput = validateInput;
    input.addEventListener('keydown', function (event) {
      handleArrowKeys(event, i);
    });
    grid.appendChild(input);
  }
};

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
