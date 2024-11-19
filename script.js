// Variáveis globais
let randomNumber = Math.floor(Math.random() * 100) + 1; // Número aleatório entre 1 e 100
let attempts = 0; // Contador de tentativas
const maxAttempts = 10; // Limite de tentativas
const wrongGuesses = []; // Lista de números errados

// Elementos do DOM
const guessInput = document.getElementById('guess');
const checkButton = document.getElementById('check');
const resetButton = document.getElementById('reset');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const wrongGuessesDisplay = document.getElementById('wrong-guesses');

// Função para verificar o palpite
function checkGuess() {
  const guess = Number(guessInput.value);

  // Valida o input
  if (!guess || guess < 1 || guess > 100) {
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
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  wrongGuesses.length = 0; // Limpa a lista de tentativas erradas
  feedback.textContent = '';
  attemptsDisplay.textContent = '';
  wrongGuessesDisplay.textContent = 'Nenhuma até agora!';
  guessInput.value = '';
  guessInput.disabled = false;
  checkButton.disabled = false;
  resetButton.classList.add('hidden'); // Esconde o botão de reinício
}

// Event listeners
checkButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', resetGame);

// Adiciona evento para tecla Enter
guessInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    checkGuess();
  }
});