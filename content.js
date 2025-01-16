(function () {
  let lastProcessedText = ""; // Armazena a última transcrição processada
  let lastSpeaker = ""; // Armazena o último nome do usuário falante

  function initializeCaptionObserver() {
    const captionContainer = findCaptionContainer();

    if (captionContainer) {
      const observer = new MutationObserver(() => {
        const currentText = captionContainer.innerText.trim();
        const currentSpeaker = findCurrentSpeaker();

        // Evita capturar strings vazias ou "..." e verifica mudanças
        if (currentText && currentSpeaker && currentText !== "…" && currentText !== lastProcessedText) {
          lastProcessedText = currentText;
          lastSpeaker = currentSpeaker;

          const formattedTranscription = `${currentSpeaker}: ${currentText}`;
          console.log(`Transcrição formatada: ${formattedTranscription}`);

          // Envia a transcrição formatada para o background.js
          chrome.runtime.sendMessage({
            type: "NEW_TRANSCRIPTION",
            text: formattedTranscription,
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

  // Função para localizar o container de legendas
  function findCaptionContainer() {
    return document.querySelector('[jsname="YSxPC"]');
  }

  // Função para localizar o nome do usuário que está falando
  function findCurrentSpeaker() {
    const speakerElement = document.querySelector('.KcIKyf.jxFHg'); // Seleciona o nome do usuário
    return speakerElement ? speakerElement.innerText.trim() : null;
  }

  initializeCaptionObserver();
})();
