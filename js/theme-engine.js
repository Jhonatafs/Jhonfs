(function() {
    // Definição dos Temas baseada no seu variables.css
    const themes = [
        { id: 'root', name: 'CODEX.SYS' },      // O padrão (:root)
        { id: 'tungsten', name: 'TUNGSTEN.MOD' },
        { id: 'botanica', name: 'BOTANICA.BIO' },
        { id: 'grimorio', name: 'GRIMORIO.ARC' },
        { id: 'sudo', name: 'SUDO.READ' }
    ];

    function applyTheme(themeId) {
        const html = document.documentElement;
        
        // Se for root, remove o atributo para usar as variáveis do :root
        if (themeId === 'root') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', themeId);
        }
        
        // Persistência
        localStorage.setItem('jhonfs-theme', themeId);
        
        // Atualiza o texto do botão/display se existir
        const display = document.getElementById('theme-display');
        if (display) {
            const themeName = themes.find(t => t.id === themeId)?.name || 'UNKNOWN';
            display.innerText = `[ ${themeName} ]`;
        }

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            const bgBase = getComputedStyle(html).getPropertyValue('--bg-base').trim();
            if (bgBase) {
                themeColor.setAttribute('content', bgBase);
            }
        }
    }

    function getCurrentTheme() {
        return localStorage.getItem('jhonfs-theme') || document.documentElement.dataset.theme || 'root';
    }

    function initTheme() {
        applyTheme(getCurrentTheme());
    }

    // Função pública para alternar (Cycling)
    window.cycleTheme = function() {
        const current = getCurrentTheme();
        const currentIndex = themes.findIndex(t => t.id === current);
        const nextIndex = (currentIndex + 1) % themes.length;
        applyTheme(themes[nextIndex].id);
    };

    // Inicializa imediatamente para evitar flash
    initTheme();
})();
