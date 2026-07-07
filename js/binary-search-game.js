(function () {
  const minLimit = 1;
  const app = document.querySelector(".binary-game-page");
  const screens = Array.from(document.querySelectorAll(".game-screen"));
  const instruction = document.getElementById("game-instruction");
  const attemptDisplay = document.getElementById("attempt-count");
  const idealDisplay = document.getElementById("ideal-count");
  const lowerBoundDisplay = document.getElementById("lower-bound");
  const upperBoundDisplay = document.getElementById("upper-bound");
  const message = document.getElementById("game-message");
  const form = document.getElementById("guess-form");
  const input = document.getElementById("guess-input");
  const submitButton = form.querySelector("button");
  const historyScroll = document.getElementById("history-scroll");
  const history = document.getElementById("guess-history");
  const victoryPanel = document.getElementById("victory-panel");
  const victorySummary = document.getElementById("victory-summary");
  const playAgain = document.getElementById("play-again");
  const creditsEasterEgg = document.getElementById("credits-easter-egg");
  const githubEasterTrigger = document.querySelector("[data-easter-trigger='github']");
  const creditsMenuButton = document.querySelector("[data-screen-target='credits']");
  const victoryPerfectSound = new Audio("/audio/victory-perfect.mp3");
  const victoryLateSound = new Audio("/audio/victory-late.mp3");
  const konamiSequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
  ];

  let maxLimit;
  let secretNumber;
  let attempts;
  let idealAttempts;
  let finished;
  let guesses;
  let konamiIndex = 0;
  let githubClickCount = 0;
  let creditsHoldTimer;
  let creditGlitchTimer;

  victoryPerfectSound.preload = "auto";
  victoryLateSound.preload = "auto";

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function calculateIdeal(min, max) {
    const n = max - min + 1;
    return Math.ceil(Math.log2(n + 1));
  }

  function showScreen(name) {
    screens.forEach((screen) => {
      const isActive = screen.id === `screen-${name}`;
      screen.hidden = !isActive;
      screen.classList.toggle("is-active", isActive);
    });

    app.dataset.activeScreen = name;

    if (name === "game") {
      resetGame();
    }
  }

  function setMessage(text, type) {
    message.textContent = text;
    message.classList.toggle("is-error", type === "error");
    message.classList.toggle("is-success", type === "success");
  }

  function getClosestGuesses() {
    return guesses.reduce(
      (closest, entry) => {
        if (entry.guess < secretNumber) {
          closest.lower =
            closest.lower === null ? entry.guess : Math.max(closest.lower, entry.guess);
        }

        if (entry.guess > secretNumber) {
          closest.upper =
            closest.upper === null ? entry.guess : Math.min(closest.upper, entry.guess);
        }

        return closest;
      },
      { lower: null, upper: null }
    );
  }

  function renderStats() {
    const closest = getClosestGuesses();

    instruction.textContent = `Descubra o número que escolhi entre 1 - ${maxLimit}`;
    attemptDisplay.textContent = attempts;
    idealDisplay.textContent = idealAttempts;
    lowerBoundDisplay.textContent = closest.lower === null ? "—" : closest.lower;
    upperBoundDisplay.textContent = closest.upper === null ? "—" : closest.upper;
    input.min = minLimit;
    input.max = maxLimit;
    input.placeholder = `1 a ${maxLimit}`;
  }

  function playVictorySound(withinIdeal) {
    const sound = withinIdeal ? victoryPerfectSound : victoryLateSound;
    sound.currentTime = 0;

    const playback = sound.play();

    if (playback && typeof playback.catch === "function") {
      playback.catch(() => {});
    }
  }

  function revealCreditsEasterEgg(text) {
    if (!creditsEasterEgg) {
      return;
    }

    showScreen("credits");
    creditsEasterEgg.textContent = text;
    creditsEasterEgg.hidden = false;
    creditsEasterEgg.classList.remove("is-visible");
    void creditsEasterEgg.offsetWidth;
    creditsEasterEgg.classList.add("is-visible");

    app.classList.remove("is-credit-glitch");
    void app.offsetWidth;
    app.classList.add("is-credit-glitch");

    window.clearTimeout(creditGlitchTimer);
    creditGlitchTimer = window.setTimeout(() => {
      app.classList.remove("is-credit-glitch");
    }, 650);
  }

  function normalizeEasterKey(key) {
    return key.length === 1 ? key.toLowerCase() : key;
  }

  function isTypingTarget(target) {
    const tagName = target.tagName;
    return (
      target.isContentEditable ||
      tagName === "INPUT" ||
      tagName === "TEXTAREA" ||
      tagName === "SELECT"
    );
  }

  function renderHistory() {
    history.innerHTML = "";

    if (guesses.length === 0) {
      const item = document.createElement("li");
      item.className = "empty-history";
      item.textContent = "Nenhum palpite válido ainda.";
      history.appendChild(item);
      historyScroll.scrollTop = historyScroll.scrollHeight;
      return;
    }

    guesses.forEach((entry, index) => {
      const item = document.createElement("li");
      if (entry.result === "hit") {
        item.classList.add("history-hit");
      }

      const resultText = {
        higher: "mais alto",
        lower: "mais baixo",
        hit: "acertou"
      }[entry.result];

      const guess = document.createElement("span");
      guess.className = "history-guess";
      guess.textContent = `#${index + 1} :: ${entry.guess}`;

      const result = document.createElement("span");
      result.className = "history-result";
      result.textContent = resultText;

      item.append(guess, result);
      history.appendChild(item);
    });

    historyScroll.scrollTop = historyScroll.scrollHeight;
  }

  function resetGame() {
    maxLimit = randomInt(50, 500);
    secretNumber = randomInt(minLimit, maxLimit);
    attempts = 0;
    idealAttempts = calculateIdeal(minLimit, maxLimit);
    finished = false;
    guesses = [];

    form.reset();
    input.disabled = false;
    submitButton.disabled = false;
    victoryPanel.hidden = true;
    victoryPanel.classList.remove("is-optimal", "is-over-limit");

    renderStats();
    renderHistory();
    setMessage("Digite um número dentro do intervalo sorteado.", "neutral");
    input.focus();
  }

  function finishGame() {
    finished = true;
    input.disabled = true;
    submitButton.disabled = true;

    const withinIdeal = attempts <= idealAttempts;
    const comparison = withinIdeal
      ? "Dentro do limite da busca binária."
      : "Você acertou, mas passou do limite ideal da busca binária.";

    victorySummary.textContent = comparison;

    victoryPanel.classList.add(withinIdeal ? "is-optimal" : "is-over-limit");
    victoryPanel.hidden = false;
    playVictorySound(withinIdeal);
    setMessage("ACERTOU!!!", "success");
  }

  function handleGuess(event) {
    event.preventDefault();

    if (finished) {
      return;
    }

    const guess = Number(input.value);

    if (!Number.isInteger(guess)) {
      setMessage("Digite um número inteiro.", "error");
      return;
    }

    if (guess < minLimit || guess > maxLimit) {
      setMessage(`Palpite fora do intervalo. Use um número entre 1 e ${maxLimit}.`, "error");
      return;
    }

    attempts += 1;

    if (guess === secretNumber) {
      guesses.push({ guess, result: "hit" });
      renderHistory();
      renderStats();
      finishGame();
      return;
    }

    if (guess < secretNumber) {
      guesses.push({ guess, result: "higher" });
      setMessage("Mais alto.", "neutral");
    } else {
      guesses.push({ guess, result: "lower" });
      setMessage("Mais baixo.", "neutral");
    }

    input.value = "";
    renderHistory();
    renderStats();
    input.focus();
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-screen-target]");
    if (!target) {
      return;
    }

    showScreen(target.dataset.screenTarget);
  });

  document.addEventListener("keydown", (event) => {
    if (isTypingTarget(event.target)) {
      return;
    }

    const key = normalizeEasterKey(event.key);
    const expectedKey = konamiSequence[konamiIndex];

    if (key === expectedKey) {
      konamiIndex += 1;

      if (konamiIndex === konamiSequence.length) {
        revealCreditsEasterEgg("KONAMI OK :: rota secreta desbloqueada.");
        konamiIndex = 0;
      }

      return;
    }

    konamiIndex = key === konamiSequence[0] ? 1 : 0;
  });

  if (githubEasterTrigger) {
    githubEasterTrigger.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      githubClickCount += 1;

      if (githubClickCount >= 5) {
        revealCreditsEasterEgg("GITHUB x5 :: deploy successful.");
        githubClickCount = 0;
      }
    });
  }

  if (creditsMenuButton) {
    creditsMenuButton.addEventListener("pointerdown", () => {
      creditsHoldTimer = window.setTimeout(() => {
        revealCreditsEasterEgg("GLITCH MODE :: 01000010 01010011 01000011.");
      }, 850);
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
      creditsMenuButton.addEventListener(eventName, () => {
        window.clearTimeout(creditsHoldTimer);
      });
    });
  }

  form.addEventListener("submit", handleGuess);
  playAgain.addEventListener("click", resetGame);
})();
