document.addEventListener("DOMContentLoaded", function () {
  // 1. Elementos principais
  const navbar = document.getElementById("main-navbar");
  // Verifica se o elemento foi encontrado (para evitar erros)
  if (!navbar) {
    console.error(
      "Elemento '#main-navbar' não encontrado. Sticky Nav desativado."
    );
    // Retorna se a navbar não for encontrada, mas permite que o resto do script continue se houver botões
  }

  // Captura a posição inicial da navbar
  const stickyOffset = navbar ? navbar.offsetTop : 0;

  // Elementos dos novos botões e rodapé
  const btnTop = document.getElementById("go-to-top");
  const btnBottom = document.getElementById("go-to-bottom");
  const footer = document.querySelector("footer");

  // Variável para definir o quanto rolar (em pixels) para os botões aparecerem
  const showButtonScrollPoint = 300;

  // ----------------------------------------------------
  // FUNÇÃO PRINCIPAL DE ROLAGEM (Scroll Handler)
  // ----------------------------------------------------
  function handleScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // A. Lógica para Fixar a Barra de Navegação (Sticky Nav)
    if (navbar) {
      // Verifica se a navbar existe antes de tentar manipulá-la
      if (scrollPosition > stickyOffset) {
        navbar.classList.add("sticky");
      } else {
        navbar.classList.remove("sticky");
      }
    }

    // B. Lógica para Mostrar/Esconder os Botões "Top" e "Bottom"
    if (btnTop && btnBottom) {
      // Verifica se os botões existem
      if (scrollPosition > showButtonScrollPoint) {
        btnTop.classList.add("show-button");
        btnBottom.classList.add("show-button");
      } else {
        btnTop.classList.remove("show-button");
        btnBottom.classList.remove("show-button");
      }
    }
  }

  // ----------------------------------------------------
  // FUNÇÕES DE AÇÃO DOS BOTÕES (Scroll Suave)
  // ----------------------------------------------------

  // Voltar ao Topo
  if (btnTop) {
    btnTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Rolagem suave
      });
    });
  }

  // Ir para o Final (Rodapé)
  if (btnBottom) {
    btnBottom.addEventListener("click", function (e) {
      e.preventDefault();

      let bottomPosition = document.body.scrollHeight;

      // Tenta rolar até o topo do rodapé (mais preciso que o final do body)
      if (footer) {
        bottomPosition = footer.offsetTop;
      }

      window.scrollTo({
        top: bottomPosition,
        behavior: "smooth",
      });
    });
  }

  // ----------------------------------------------------
  // EVENT LISTENERS
  // ----------------------------------------------------
  window.addEventListener("scroll", handleScroll);

  // Executa a função uma vez ao carregar
  handleScroll();
});
