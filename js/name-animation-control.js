(() => {
  const title = document.querySelector(".home-name");
  const toggle = document.querySelector("[data-name-animation-toggle]");

  if (!title || !toggle) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const playLabel = "Reproduzir animação do nome em loop";
  const stopLabel = "Parar animação e voltar para JhonFs";
  const reducedLabel = "Animação reduzida nas preferências do sistema";

  const setButtonState = (isPlaying) => {
    const label = isPlaying ? stopLabel : playLabel;

    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
  };

  const stopAnimation = () => {
    title.classList.remove("is-looping");
    title.classList.add("is-stopped");
    setButtonState(false);
  };

  const playAnimation = () => {
    title.classList.remove("is-stopped", "is-looping");
    void title.offsetWidth;
    title.classList.add("is-looping");
    setButtonState(true);
  };

  const syncReducedMotion = () => {
    if (reduceMotion.matches) {
      title.classList.remove("is-looping");
      title.classList.add("is-stopped");
      toggle.disabled = true;
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", reducedLabel);
      toggle.title = reducedLabel;
      return;
    }

    toggle.disabled = false;
    setButtonState(title.classList.contains("is-looping"));
  };

  toggle.addEventListener("click", () => {
    if (reduceMotion.matches) {
      return;
    }

    const isPlaying = title.classList.contains("is-looping");

    if (isPlaying) {
      stopAnimation();
      return;
    }

    playAnimation();
  });

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncReducedMotion);
  } else {
    reduceMotion.addListener(syncReducedMotion);
  }

  syncReducedMotion();
})();
