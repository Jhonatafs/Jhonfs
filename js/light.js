function lightStatus() {
    const root = document.documentElement;
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme === "light") {
        root.classList.remove("light-theme");
        localStorage.setItem("theme", "dark"); // Salva o tema escuro
    } else {
        root.classList.add("light-theme");
        localStorage.setItem("theme", "light"); // Salva o tema claro
    }
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.documentElement.classList.add("light-theme"); // Aplica o tema claro se estiver salvo
    }
}

applySavedTheme();
