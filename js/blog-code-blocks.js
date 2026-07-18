(function () {
  "use strict";

  const LANGUAGE_NAMES = {
    bash: "Bash",
    sh: "Shell",
    shell: "Shell",
    javascript: "JavaScript",
    js: "JavaScript",
    typescript: "TypeScript",
    ts: "TypeScript",
    python: "Python",
    py: "Python",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    sql: "SQL",
    java: "Java",
    text: "Texto",
    plaintext: "Texto"
  };

  const IGNORED_CLASSES = new Set([
    "sourceCode",
    "numberLines",
    "lineAnchors"
  ]);

  function getLanguage(pre, code) {
    const classes = [...code.classList, ...pre.classList];
    const language = classes.find((className) => !IGNORED_CLASSES.has(className));

    if (!language) {
      return "Código";
    }

    return LANGUAGE_NAMES[language.toLowerCase()] || language.toUpperCase();
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      textarea.remove();
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    if (!fallbackCopy(text)) {
      throw new Error("Clipboard API indisponível");
    }
  }

  function codeContainerFor(pre) {
    const sourceCodeContainer = pre.parentElement;

    if (sourceCodeContainer && sourceCodeContainer.classList.contains("sourceCode")) {
      sourceCodeContainer.classList.add("code-block");
      return sourceCodeContainer;
    }

    const container = document.createElement("div");
    container.className = "code-block";
    pre.parentNode.insertBefore(container, pre);
    container.appendChild(pre);
    return container;
  }

  function enhanceCodeBlock(pre) {
    const code = pre.querySelector(":scope > code");

    if (!code) {
      return;
    }

    const container = codeContainerFor(pre);
    const toolbar = document.createElement("div");
    const language = document.createElement("span");
    const status = document.createElement("span");
    const button = document.createElement("button");
    let resetTimer;

    toolbar.className = "code-toolbar";
    language.className = "code-language";
    language.textContent = getLanguage(pre, code);
    status.className = "code-copy-status";
    status.setAttribute("aria-live", "polite");
    button.className = "code-copy-button";
    button.type = "button";
    button.textContent = "Copiar";
    button.setAttribute("aria-label", `Copiar código ${language.textContent}`);

    toolbar.append(language, status, button);
    container.insertBefore(toolbar, pre);

    button.addEventListener("click", async function () {
      clearTimeout(resetTimer);
      button.disabled = true;

      try {
        await copyText(code.textContent);
        button.textContent = "Copiado!";
        status.textContent = "Código copiado para a área de transferência.";
      } catch (error) {
        button.textContent = "Não foi possível copiar";
        status.textContent = "Não foi possível copiar o código.";
      } finally {
        button.disabled = false;
        resetTimer = window.setTimeout(function () {
          button.textContent = "Copiar";
          status.textContent = "";
        }, 2200);
      }
    });
  }

  function initCodeBlocks() {
    document.querySelectorAll(".post-content pre").forEach(enhanceCodeBlock);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCodeBlocks);
  } else {
    initCodeBlocks();
  }
})();
