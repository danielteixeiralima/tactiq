// popup.js

// Array local para armazenar as transcrições que vamos exibir
let transcriptions = [];

// Busca o container para exibir as mensagens
const container = document.getElementById("transcriptionContainer");

// Função para renderizar as transcrições na tela
function renderTranscriptions() {
  container.innerHTML = ""; // limpa o conteúdo

  transcriptions.forEach((text) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "transcription-message";
    messageDiv.textContent = text;
    container.appendChild(messageDiv);
  });
}

// 1. Ao abrir o popup, pede todas as transcrições já salvas no background
chrome.runtime.sendMessage({ type: "GET_TRANSCRIPTIONS" }, (response) => {
  if (response && response.transcriptions) {
    transcriptions = response.transcriptions;
    renderTranscriptions();
  }
});

// 2. Fica escutando novas transcrições que o background avisar
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "NEW_TRANSCRIPTION") {
    transcriptions.push(request.text);
    renderTranscriptions();
  }
});
