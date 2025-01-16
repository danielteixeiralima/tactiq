// background.js

// Armazena todas as transcrições processadas
let transcriptions = [];

// Buffer para consolidar transcrições antes de enviá-las
let buffer = "";
let bufferTimer = null;
const BUFFER_TIMEOUT = 500; // Tempo de espera para consolidar fragmentos

// Função para processar o buffer e adicionar ao array de transcrições
function processBuffer() {
  if (buffer.trim().length > 0) {
    const consolidatedText = buffer.trim();

    // Adiciona a transcrição consolidada ao array
    transcriptions.push(consolidatedText);

    // Notifica o popup com a transcrição consolidada
    chrome.runtime.sendMessage({
      type: "NEW_TRANSCRIPTION",
      text: consolidatedText,
    });

    // Limpa o buffer
    buffer = "";
    bufferTimer = null;
  }
}

// Listener para mensagens do content.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "NEW_TRANSCRIPTION") {
    buffer += " " + request.text; // Adiciona ao buffer

    // Reinicia o timer para consolidar o texto
    if (bufferTimer) {
      clearTimeout(bufferTimer);
    }

    bufferTimer = setTimeout(() => {
      processBuffer(); // Processa o buffer após o timeout
    }, BUFFER_TIMEOUT);
  } else if (request.type === "GET_TRANSCRIPTIONS") {
    // Envia todas as transcrições ao popup
    chrome.runtime.sendMessage({ type: "ALL_TRANSCRIPTIONS", transcriptions });
  }
});
