document.addEventListener("DOMContentLoaded", () => {
  const themeToggleButton = document.getElementById("theme-toggle");
  const currentYearSpan = document.getElementById("current-year");
  const body = document.body;

  // --- Atualiza o ano no footer ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- Lógica do Tema Claro/Escuro ---
  const currentTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Função para aplicar o tema
  const applyTheme = (theme) => {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      if (themeToggleButton) themeToggleButton.textContent = "🌙"; // Lua
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      if (themeToggleButton) themeToggleButton.textContent = "☀️"; // Sol
      localStorage.setItem("theme", "light");
    }
  };

  // Define o tema inicial baseado no localStorage ou preferência do sistema
  if (currentTheme) {
    applyTheme(currentTheme);
  } else if (prefersDark) {
    applyTheme("dark");
  } else {
    applyTheme("light"); // Default para light se nada for definido
  }

  // Event listener para o botão de alternar tema
  if (themeToggleButton) {
    themeToggleButton.addEventListener("click", () => {
      if (body.classList.contains("dark-mode")) {
        applyTheme("light");
      } else {
        applyTheme("dark");
      }
    });
  }

  // Ouve mudanças na preferência do sistema
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Só muda se o usuário não tiver definido manualmente uma preferência
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
});

// Botões Voltar e Ir
document.addEventListener("DOMContentLoaded", () => {
  const backToTopButton = document.getElementById("back-to-top");
  const goToBottomButton = document.getElementById("go-to-bottom"); // Seleciona o novo botão

  // Define a distância de rolagem para mostrar os botões
  const scrollThreshold = 300;

  // Função para atualizar a visibilidade dos botões
  const updateScrollButtonsVisibility = () => {
    const scrolledDistance = window.scrollY;
    const pageHeight = document.body.scrollHeight;
    const viewportHeight = window.innerHeight;
    const remainingScroll = pageHeight - (scrolledDistance + viewportHeight); // Distância restante para o final

    // Mostra ambos os botões quando o usuário rolar para baixo do topo
    if (scrolledDistance > scrollThreshold) {
      backToTopButton.classList.add("show");
      goToBottomButton.classList.add("show");
    } else {
      // Oculta ambos os botões no topo da página
      backToTopButton.classList.remove("show");
      goToBottomButton.classList.remove("show");
    }

    // Opcional: Oculta o botão "Ir ao Final" perto do final da página
    // if (remainingScroll < scrollThreshold) { // Esconde o botão Ir ao Final perto do final
    //      goToBottomButton.classList.remove('show');
    // }

    // Opcional: Oculta o botão "Voltar ao Topo" perto do topo da página (se você quiser lógicas separadas)
    // if (scrolledDistance < scrollThreshold) { // Esconde o botão Voltar ao Topo perto do topo
    //      backToTopButton.classList.remove('show');
    // }
  };

  // Atualiza a visibilidade na rolagem
  window.addEventListener("scroll", updateScrollButtonsVisibility);

  // Atualiza a visibilidade ao carregar a página (útil se a página carregar já rolada)
  updateScrollButtonsVisibility();

  // Rola suavemente para o topo ao clicar no botão Voltar ao Topo
  backToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Rola suavemente para o final ao clicar no botão Ir ao Final
  goToBottomButton.addEventListener("click", (e) => {
    e.preventDefault();
    // Rola para o final da página (altura total do corpo ou documento)
    window.scrollTo({
      top: document.body.scrollHeight, // Ou document.documentElement.scrollHeight
      behavior: "smooth",
    });
  });
});
