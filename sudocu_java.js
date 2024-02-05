window.onload = function () {
  const grid = document.getElementById('sudoku-grid');
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.pattern = '[1-9]*';
    grid.appendChild(input);
  }
};

function solveSudoku() {
  // Здесь будет код для сбора данных с формы и отправки запроса на сервер
}
