(function () {
  function initializeCaptionObserver() {
    const captionContainer = findCaptionContainer();

    if (captionContainer) {
      let lastText = "";

      const observer = new MutationObserver((mutations) => {
        const currentText = captionContainer.innerText.trim();

        if (currentText && currentText !== lastText && currentText !== "…") {
          console.log(`Transcrição (console): ${currentText}`);
          lastText = currentText;

          // ---- Envia a transcrição para o background.js ----
          chrome.runtime.sendMessage({
            type: "NEW_TRANSCRIPTION",
            text: currentText,
          });
        }
      });

      observer.observe(captionContainer, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } else {
      setTimeout(initializeCaptionObserver, 1000);
    }
  }

  function findCaptionContainer() {
    const container = document.querySelector('[jsname="YSxPC"]');
    if (container) {
      const textContent = container.innerText.trim();
      if (textContent && textContent !== "…") {
        console.log("Transcrição inicial (console):", textContent);
        // Também envia a primeira transcrição para o background
        chrome.runtime.sendMessage({
          type: "NEW_TRANSCRIPTION",
          text: textContent,
        });
      }
    }
    return container;
  }

  initializeCaptionObserver();
})();
