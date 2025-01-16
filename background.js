// background.js

// Armazena todas as transcrições finais processadas
let transcriptions = [];

// Listener para mensagens do content.js e popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FINAL_TRANSCRIPTION") {
    // Adiciona a transcrição final ao array
    transcriptions.push(request.text);
    console.log(`Transcrição final armazenada: ${request.text}`);

    // Envia a transcrição final para o popup.js
    chrome.runtime.sendMessage({
      type: "FINAL_TRANSCRIPTION",
      text: request.text,
    });

    sendResponse({ status: "success" });
  } else if (request.type === "GET_TRANSCRIPTIONS") {
    // Retorna todas as transcrições finais armazenadas
    sendResponse({ transcriptions });
  }

  // Retorna true para indicar que a resposta será enviada de forma assíncrona
  return true;
});
