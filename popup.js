// popup.js

// Elemento do container onde exibiremos a transcrição
const container = document.getElementById("transcriptionContainer");

// Mantém um conjunto das transcrições já exibidas para evitar duplicações
const displayedTranscriptions = new Set();

// Atualiza a transcrição no popup
function updateTranscription(newText) {
  if (!newText) return; // Garante que não processe textos vazios
  if (displayedTranscriptions.has(newText)) return; // Evita duplicações

  // Remove a mensagem padrão se existir
  const noTranscriptionElement = document.getElementById('noTranscriptions');
  if (noTranscriptionElement) {
    noTranscriptionElement.remove();
  }

  // Adiciona a transcrição ao conjunto de transcrições exibidas
  displayedTranscriptions.add(newText);

  // Formatar o texto com duas quebras de linha
  const [speaker, ...transcriptionParts] = newText.split(":");
  const transcription = transcriptionParts.join(":").trim(); // Junta a transcrição, caso haja ":" no texto

  const formattedText = `${speaker}:\n\n${transcription}`;

  // Cria um novo elemento para exibir a transcrição formatada
  const transcriptionElement = document.createElement("div");
  transcriptionElement.classList.add("transcription-message"); // Adiciona a classe CSS
  transcriptionElement.textContent = formattedText;

  // Adiciona a nova transcrição ao container sem limpar o histórico
  container.appendChild(transcriptionElement);

  // Scroll automático para a transcrição mais recente
  container.scrollTop = container.scrollHeight;
}

// Solicita todas as transcrições finais ao carregar o popup
chrome.runtime.sendMessage({ type: "GET_TRANSCRIPTIONS" }, (response) => {
  if (response && response.transcriptions.length > 0) {
    response.transcriptions.forEach((transcription) => {
      updateTranscription(transcription);
    });
  } else {
    // Se não houver transcrições, exibe uma mensagem padrão com um ID específico
    const noTranscriptionElement = document.createElement('div');
    noTranscriptionElement.id = 'noTranscriptions'; // ID para facilitar a remoção
    noTranscriptionElement.textContent = "Nenhuma transcrição disponível.";
    container.appendChild(noTranscriptionElement);
  }
});

// Escuta novas transcrições finais enviadas pelo background.js
chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "FINAL_TRANSCRIPTION") {
    updateTranscription(request.text);
  }
});
