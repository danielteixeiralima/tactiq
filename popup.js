// Armazena a última transcrição exibida
let lastTranscription = "";

// Elemento do container onde exibiremos a transcrição
const container = document.getElementById("transcriptionContainer");

// Atualiza a transcrição no popup
function updateTranscription(newText) {
  if (newText !== lastTranscription) {
    lastTranscription = newText;

    // Formatar o texto com duas quebras de linha
    const [speaker, ...transcriptionParts] = newText.split(":");
    const transcription = transcriptionParts.join(":").trim(); // Junta a transcrição, caso haja ":" no texto

    const formattedText = `${speaker}:\n\n${transcription}`;

    // Cria um novo elemento para exibir a transcrição formatada
    const transcriptionElement = document.createElement("div");
    transcriptionElement.style.whiteSpace = "pre-wrap"; // Preserva quebras de linha
    transcriptionElement.textContent = formattedText;

    // Limpa o container e adiciona a nova transcrição
    container.innerHTML = ""; // Se quiser manter histórico, remova essa linha
    container.appendChild(transcriptionElement);
  }
}


// Solicita todas as transcrições existentes ao carregar o popup
chrome.runtime.sendMessage({ type: "GET_TRANSCRIPTIONS" }, (response) => {
  if (response && response.transcriptions.length > 0) {
    const lastText = response.transcriptions[response.transcriptions.length - 1];
    updateTranscription(lastText);
  }
});

// Escuta novas transcrições enviadas pelo background.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "NEW_TRANSCRIPTION") {
    updateTranscription(request.text);
  }
});