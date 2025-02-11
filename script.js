// Variáveis globais
let randomNumber; // Número aleatório entre 1 e 100
let attempts; // Contador de tentativas
let maxAttempts; // Limite de tentativas
let maxNumber; // Número máximo permitido
const wrongGuesses = []; // Lista de números errados

// Elementos do DOM
const guessInput = document.getElementById('guess');
const checkButton = document.getElementById('check');
const resetButton = document.getElementById('reset');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const wrongGuessesDisplay = document.getElementById('wrong-guesses');
const difficultySelect = document.getElementById('difficulty');

// Função para iniciar o jogo com base na dificuldade selecionada
function initializeGame() {
  const difficulty = difficultySelect.value;
  switch (difficulty) {
    case 'easy':
      maxNumber = 50;
      maxAttempts = 10;
      break;
    case 'medium':
      maxNumber = 100;
      maxAttempts = 7;
      break;
    case 'hard':
      maxNumber = 200;
      maxAttempts = 5;
      break;
  }
  randomNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  wrongGuesses.length = 0;
  feedback.textContent = '';
  attemptsDisplay.textContent = '';
  wrongGuessesDisplay.textContent = 'Nenhuma até agora!';
  guessInput.value = '';
  guessInput.disabled = false;
  checkButton.disabled = false;
  resetButton.classList.add('hidden');
}

// Função para verificar o palpite
function checkGuess() {
  const guess = Number(guessInput.value);

  // Valida o input
  if (!guess || guess < 1 || guess > maxNumber) {
    feedback.textContent = 'Por favor, insira um número válido entre 1 e 100.';
    return;
  }

  attempts++; // Incrementa o contador
  attemptsDisplay.textContent = `Tentativas: ${attempts}/${maxAttempts}`;

  if (guess === randomNumber) {
    feedback.textContent = `Parabéns! Você acertou o número ${randomNumber} em ${attempts} tentativas.`;
    endGame();
  } else {
    wrongGuesses.push(guess); // Adiciona à lista de tentativas erradas
    updateWrongGuesses();

    if (attempts >= maxAttempts) {
      feedback.textContent = `Você atingiu o número máximo de tentativas. O número era ${randomNumber}.`;
      endGame();
    } else if (guess < randomNumber) {
      feedback.textContent = 'Tente um número maior!';
    } else {
      feedback.textContent = 'Tente um número menor!';
    }
  }
  
  guessInput.value = ''; // Limpa o campo de input
}

// Atualiza a lista de tentativas erradas
function updateWrongGuesses() {
  wrongGuessesDisplay.textContent = wrongGuesses.length
    ? wrongGuesses.join(', ')
    : 'Nenhuma até agora!';
}

// Função para finalizar o jogo
function endGame() {
  guessInput.disabled = true;
  checkButton.disabled = true;
  resetButton.classList.remove('hidden'); // Mostra o botão de reinício
}

// Função para reiniciar o jogo
function resetGame() {
  initializeGame();
}

// Event listeners
checkButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', resetGame);
difficultySelect.addEventListener('change', initializeGame);

// Adiciona evento para tecla Enter
guessInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    checkGuess();
  }
});

// Inicializa o jogo ao carregar a página
initializeGame();