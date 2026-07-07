(function () {
  const minLimit = 1;
  const app = document.querySelector(".binary-game-page");
  const screens = Array.from(document.querySelectorAll(".game-screen"));
  const instruction = document.getElementById("game-instruction");
  const attemptDisplay = document.getElementById("attempt-count");
  const idealDisplay = document.getElementById("ideal-count");
  const message = document.getElementById("game-message");
  const form = document.getElementById("guess-form");
  const input = document.getElementById("guess-input");
  const submitButton = form.querySelector("button");
  const historyScroll = document.getElementById("history-scroll");
  const history = document.getElementById("guess-history");
  const victoryPanel = document.getElementById("victory-panel");
  const victorySummary = document.getElementById("victory-summary");
  const playAgain = document.getElementById("play-again");

  let maxLimit;
  let secretNumber;
  let attempts;
  let idealAttempts;
  let finished;
  let guesses;

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

  function renderStats() {
    instruction.textContent = `Descubra o número entre 1 - ${maxLimit}`;
    attemptDisplay.textContent = attempts;
    idealDisplay.textContent = idealAttempts;
    input.min = minLimit;
    input.max = maxLimit;
    input.placeholder = `1 a ${maxLimit}`;
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

    victorySummary.textContent =
      `${comparison} O número secreto era ${secretNumber}. Tentativas: ${attempts} / ${idealAttempts}.`;

    victoryPanel.classList.add(withinIdeal ? "is-optimal" : "is-over-limit");
    victoryPanel.hidden = false;
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

  form.addEventListener("submit", handleGuess);
  playAgain.addEventListener("click", resetGame);
})();
