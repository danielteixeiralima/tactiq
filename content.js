// content.js
(function () {
  let lastProcessedText = ""; // Armazena a última transcrição processada
  let lastSpeaker = ""; // Armazena o último nome do usuário falante
  let captionObserver = null; // Referência ao MutationObserver para legendas
  let bodyObserver = null; // Referência ao MutationObserver para o body

  // Função para localizar o container de legendas
  function findCaptionContainer() {
    return document.querySelector('[jsname="YSxPC"]');
  }

  // Função para localizar o nome do usuário que está falando
  function findCurrentSpeaker() {
    const speakerElement = document.querySelector('.KcIKyf.jxFHg');
    if (speakerElement) {
      console.log("Falante encontrado:", speakerElement.innerText.trim());
      return speakerElement.innerText.trim();
    }
    console.log("Falante não encontrado.");
    return null;
  }

  // Função para processar mudanças nas legendas
  function processCaptionChange() {
    const captionContainer = findCaptionContainer();
    if (!captionContainer) {
      console.log("processCaptionChange: Caption container não encontrado.");
      return;
    }

    const currentText = captionContainer.innerText.trim();
    const currentSpeaker = findCurrentSpeaker();

    console.log("Texto Atual:", currentText);
    console.log("Falante Atual:", currentSpeaker);

    if (currentText === "…" || currentText === "") {
      // Resetar o estado durante o silêncio
      if (lastProcessedText !== "" || lastSpeaker !== "") {
        console.log("Silêncio detectado. Resetando estado.");
        lastProcessedText = "";
        lastSpeaker = "";
      }
      return; // Não processar silêncios
    }

    // Verifica se há uma nova transcrição ou um novo falante
    if (
      currentText &&
      currentSpeaker &&
      (currentText !== lastProcessedText || currentSpeaker !== lastSpeaker)
    ) {
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
  }

  // Função para inicializar o MutationObserver nas legendas
  function initializeCaptionObserver(captionContainer) {
    if (!captionContainer) return;

    console.log("Caption container encontrado:", captionContainer);

    // Se já houver um observador, desconecte-o antes de criar um novo
    if (captionObserver) {
      captionObserver.disconnect();
      console.log("Observador anterior de legendas desconectado.");
    }

    // Cria um novo MutationObserver para as legendas
    captionObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log("MutationObserver de legendas: Detected mutation.");
        processCaptionChange();
      });
    });

    // Inicia a observação das mudanças no container de legendas
    captionObserver.observe(captionContainer, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    console.log("MutationObserver de legendas iniciado.");

    // Processa qualquer texto existente imediatamente
    processCaptionChange();
  }

  // Função para monitorar adições e remoções do container de legendas
  function monitorCaptionContainerChanges() {
    // Cria um MutationObserver para o body
    bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        console.log("MutationObserver do body: Detected mutation.", mutation);

        // Verifica nós adicionados
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const captionContainer = node.matches('[jsname="YSxPC"]') ? node : node.querySelector('[jsname="YSxPC"]');
            if (captionContainer) {
              console.log("Novo container de legendas adicionado.");
              initializeCaptionObserver(captionContainer);
            }
          }
        });

        // Verifica nós removidos
        mutation.removedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const captionContainerRemoved = node.matches('[jsname="YSxPC"]') || node.querySelector('[jsname="YSxPC"]');
            if (captionContainerRemoved) {
              console.log("Container de legendas removido.");
              if (captionObserver) {
                captionObserver.disconnect();
                captionObserver = null;
                console.log("MutationObserver de legendas desconectado.");
              }
              lastProcessedText = "";
              lastSpeaker = "";
            }
          }
        });
      });
    });

    // Inicia a observação das mudanças no body
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.log("MutationObserver do body iniciado.");
  }

  // Função de inicialização do script
  function initialize() {
    const captionContainer = findCaptionContainer();
    if (captionContainer) {
      initializeCaptionObserver(captionContainer);
    }

    monitorCaptionContainerChanges();

    // Fallback: Verifica a cada 2 segundos se o container de legendas existe e não está sendo observado
    setInterval(() => {
      const currentContainer = findCaptionContainer();
      if (currentContainer && !captionObserver) {
        console.log("Fallback: Caption container encontrado.");
        initializeCaptionObserver(currentContainer);
      }
    }, 2000);
  }

  // Executa a função de inicialização quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }

})();
