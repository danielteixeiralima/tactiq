// background.js

// Um array para manter todas as mensagens transcritas
let transcriptions = [];

// Quando a aba é atualizada
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("https://meet.google.com/")
  ) {
    // Injetar o script (CASO deseje injetar manualmente):
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
      world: "MAIN", // injetar no contexto da página
    });
  }
});

// Ouvir mensagens vindas do content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NEW_TRANSCRIPTION") {
    // Salva a nova transcrição
    transcriptions.push(request.text);

    // Notifica todos os scripts (incluindo popup.js se estiver aberto)
    chrome.runtime.sendMessage({
      type: "NEW_TRANSCRIPTION",
      text: request.text,
    });
  } else if (request.type === "GET_TRANSCRIPTIONS") {
    // Quando o popup pedir, enviamos a lista completa
    sendResponse({ transcriptions });
  }
});
