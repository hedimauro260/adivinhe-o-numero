// Adicione no início do JS
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  const run = () => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'win') {
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.3;
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
      oscillator.stop(audioContext.currentTime + 1);
    } else if (type === 'error') {
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.2;
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  // Muitos browsers iniciam o AudioContext como "suspended" até a 1ª interação do usuário.
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(run).catch(run);
    return;
  }

  run();
}

// Seletores
let secretNumber = Math.floor(Math.random() * 50) + 1;
let attemptsLeft = 10;
let wrongGuesses = [];
let currentDifficulty = 'easy';

const guessInput = document.getElementById('guess');
const checkBtn = document.getElementById('check');
const resetBtn = document.getElementById('reset');
const feedback = document.getElementById('feedback');
const attemptsDisplay = document.getElementById('attempts');
const wrongGuessesSpan = document.getElementById('wrong-guesses');
const difficultySelect = document.getElementById('difficulty');

// Elementos extras para animação
const body = document.body;
const gameContainer = document.querySelector('body');

// Configurações por dificuldade
const difficultySettings = {
  easy: { max: 50, attempts: 10, range: '1-50' },
  medium: { max: 100, attempts: 7, range: '1-100' },
  hard: { max: 200, attempts: 5, range: '1-200' }
};

// Inicialização
function initGame() {
  const settings = difficultySettings[currentDifficulty];
  secretNumber = Math.floor(Math.random() * settings.max) + 1;
  attemptsLeft = settings.attempts;
  wrongGuesses = [];
  updateUI();
  feedback.textContent = `🎯 Novo jogo! Número entre ${settings.range}`;
  feedback.className = '';
  guessInput.value = '';
  guessInput.disabled = false;
  checkBtn.disabled = false;
  resetBtn.classList.add('hidden');

  // Efeito de fade in
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 10);

  // Confetti silencioso no início
  createConfetti(10);
}

// Confetes simples
function createConfetti(count = 30) {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '8px';
    confetti.style.height = '8px';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '-10px';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    document.body.appendChild(confetti);

    const animation = confetti.animate([
      { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
      duration: 1000 + Math.random() * 1000,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => confetti.remove();
  }
}

// Efeito de emoij flutuante
function showFloatingEmoji(emoji, isCorrect = false) {
  const floatingEmoji = document.createElement('div');
  floatingEmoji.textContent = emoji;
  floatingEmoji.style.position = 'fixed';
  floatingEmoji.style.fontSize = '2rem';
  floatingEmoji.style.left = guessInput.getBoundingClientRect().left + 'px';
  floatingEmoji.style.top = guessInput.getBoundingClientRect().top - 30 + 'px';
  floatingEmoji.style.pointerEvents = 'none';
  floatingEmoji.style.zIndex = '9999';
  floatingEmoji.style.opacity = '1';
  document.body.appendChild(floatingEmoji);

  const targetY = isCorrect ? -100 : -50;
  floatingEmoji.animate([
    { transform: 'translateY(0px)', opacity: 1 },
    { transform: `translateY(${targetY}px)`, opacity: 0 }
  ], {
    duration: 1000,
    easing: 'ease-out'
  }).onfinish = () => floatingEmoji.remove();
}

// Dica de temperatura (hot/cold)
function showTemperatureTip(guess, secret) {
  const difference = Math.abs(guess - secret);
  if (difference === 0) return;

  let emoji = '';
  let temperature = '';

  if (difference <= 5) {
    emoji = '🔥🔥🔥';
    temperature = 'Muito quente!';
    feedback.classList.add('hot');
  } else if (difference <= 15) {
    emoji = '🔥🔥';
    temperature = 'Quente!';
    feedback.classList.add('hot');
  } else if (difference <= 30) {
    emoji = '👍';
    temperature = 'Morno...';
    feedback.classList.remove('hot', 'cold');
  } else {
    emoji = '❄️';
    temperature = 'Frio!';
    feedback.classList.add('cold');
  }

  setTimeout(() => {
    feedback.classList.remove('hot', 'cold');
  }, 500);

  return { emoji, temperature };
}

// Mensagens criativas
function getCreativeMessage(guess, secret, attemptsLeft, isGameOver = false) {
  const difference = Math.abs(guess - secret);
  const messages = {
    high: [
      "📈 Um pouco alto demais!",
      "⬇️ Desce um pouco!",
      "🎈 Calma, muito alto!",
      "☁️ Nas nuvens... tente mais baixo"
    ],
    low: [
      "📉 Muito baixo!",
      "⬆️ Sobe mais!",
      "🚀 Precisa subir!",
      "🐜 Muito baixo, quase rastejando"
    ],
    gameOver: [
      "💀 Game Over! Mais sorte na próxima!",
      "😅 Ops! Acabaram as tentativas...",
      "🎮 Fim de jogo! Quer recomeçar?",
      "🤔 Não foi dessa vez..."
    ],
    win: [
      "🎉 PARABÉNS! Você acertou! 🎯 Agora pode pedir música no Fantástico (ou pelo menos um biscoito).",
      "🏆 ACERTOU! Seu cérebro acabou de dar um print na mente do computador. 📸",
      "⭐️ Uau! Foi tão certeiro que o número até pediu autógrafo. ✍️",
      "🎯 BULLSEYE! Se isso fosse prova, você já tinha passado sem olhar o gabarito. 😄",
      "🥳 PARABÉNS! Você é oficialmente o(a) detetive do número secreto. 🔎"
    ]
  };

  if (isGameOver) {
    return messages.gameOver[Math.floor(Math.random() * messages.gameOver.length)];
  }

  // Vitória
  if (difference === 0) {
    return messages.win[Math.floor(Math.random() * messages.win.length)];
  }

  if (guess > secret) {
    return messages.high[Math.floor(Math.random() * messages.high.length)];
  } else {
    return messages.low[Math.floor(Math.random() * messages.low.length)];
  }
}

// Verificar palpite
function checkGuess() {
  const guess = parseInt(guessInput.value);
  const settings = difficultySettings[currentDifficulty];

  // Validação
  if (isNaN(guess)) {
    feedback.textContent = '🔢 Digite um número válido!';
    playSound('error');
    feedback.style.animation = 'shake 0.3s';
    setTimeout(() => { feedback.style.animation = ''; }, 300);
    return;
  }

  if (guess < 1 || guess > settings.max) {
    feedback.textContent = `⚠️ O número deve estar entre 1 e ${settings.max}!`;
    playSound('error');
    guessInput.classList.add('shake-animation');
    setTimeout(() => guessInput.classList.remove('shake-animation'), 300);
    return;
  }

  // Efeito de loading
  checkBtn.classList.add('loading');
  checkBtn.disabled = true;

  setTimeout(() => {
    checkBtn.classList.remove('loading');
    checkBtn.disabled = false;

    // Lógica principal
    if (guess === secretNumber) {
      // VITÓRIA!
      feedback.textContent = getCreativeMessage(guess, secretNumber, attemptsLeft);
      playSound('win');
      feedback.classList.add('celebrate');
      createConfetti(100);
      showFloatingEmoji('🏆', true);
      for (let i = 0; i < 3; i++) {
        setTimeout(() => showFloatingEmoji('🎉', true), i * 200);
      }
      guessInput.disabled = true;
      checkBtn.disabled = true;
      resetBtn.classList.remove('hidden');

      // Mensagem especial
      document.querySelector('h1').style.animation = 'celebrate 0.5s';
      setTimeout(() => {
        document.querySelector('h1').style.animation = '';
      }, 500);

    } else {
      // ERROU
      attemptsLeft--;
      wrongGuesses.push(guess);
      playSound('error');

      // Dica de temperatura
      const temp = showTemperatureTip(guess, secretNumber);
      const creativeMsg = getCreativeMessage(guess, secretNumber, attemptsLeft);
      feedback.textContent = `${creativeMsg} ${temp ? temp.emoji : ''}`;

      showFloatingEmoji('❌');
      guessInput.classList.add('shake-animation');
      setTimeout(() => guessInput.classList.remove('shake-animation'), 300);

      if (attemptsLeft === 0) {
        // GAME OVER
        feedback.textContent = getCreativeMessage(guess, secretNumber, attemptsLeft, true);
        feedback.textContent += ` O número era ${secretNumber}!`;
        guessInput.disabled = true;
        checkBtn.disabled = true;
        resetBtn.classList.remove('hidden');
        createConfetti(20);
        showFloatingEmoji('💀');
      }

      updateUI();
    }
  }, 300);
}

// Atualizar interface
function updateUI() {
  const settings = difficultySettings[currentDifficulty];
  attemptsDisplay.textContent = `🎲 Tentativas restantes: ${attemptsLeft} de ${settings.attempts}`;

  if (wrongGuesses.length === 0) {
    wrongGuessesSpan.textContent = 'Nenhuma até agora!';
  } else {
    wrongGuessesSpan.innerHTML = wrongGuesses.join(', ');
  }

  // Efeito visual nas tentativas
  if (attemptsLeft <= 2 && attemptsLeft > 0) {
    attemptsDisplay.style.animation = 'shake 0.3s';
    setTimeout(() => attemptsDisplay.style.animation = '', 300);
  }
}

// Mudar dificuldade
difficultySelect.addEventListener('change', (e) => {
  currentDifficulty = e.target.value;
  resetGame();
});

// Resetar jogo
function resetGame() {
  const settings = difficultySettings[currentDifficulty];
  secretNumber = Math.floor(Math.random() * settings.max) + 1;
  attemptsLeft = settings.attempts;
  wrongGuesses = [];
  guessInput.disabled = false;
  checkBtn.disabled = false;
  resetBtn.classList.add('hidden');
  guessInput.value = '';
  updateUI();
  feedback.textContent = `🔄 Novo jogo! Número entre ${settings.range}. Boa sorte!`;
  feedback.classList.remove('celebrate');

  // Pequena comemoração visual
  createConfetti(15);
}

// Event Listeners
checkBtn.addEventListener('click', checkGuess);
resetBtn.addEventListener('click', resetGame);
guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !checkBtn.disabled) {
    checkGuess();
  }
});

// Dica interativa no input
guessInput.addEventListener('mouseenter', () => {
  const settings = difficultySettings[currentDifficulty];
  showFloatingEmoji('🎯');
});

// Inicialização
initGame();
