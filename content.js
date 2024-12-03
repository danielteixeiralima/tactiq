(function () {
    function initializeCaptionObserver() {
        // Localiza o contêiner de legendas pelo atributo `jsname`
        const captionContainer = findCaptionContainer();

        if (captionContainer) {
            console.log('Contêiner de legendas encontrado.');

            // Cria um observador para monitorar mudanças no contêiner de legendas
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            console.log('Nó adicionado detectado:', node);

                            // Verifica se há um elemento de texto de legenda
                            const textElement = node.querySelector('[jsname="tgaKEf"] span');
                            const userElement = node.closest('[jsname="dsyhDe"]')?.querySelector('img')?.alt || 
                                node.closest('[jsname="dsyhDe"]')?.querySelector('div.KcIkFf')?.innerText;

                            if (textElement) {
                                const captionText = textElement.innerText.trim();
                                const userName = userElement ? userElement.trim() : 'Desconhecido';

                                if (captionText) {
                                    console.log(`${userName}: ${captionText}`);
                                } else {
                                    console.log('Legenda detectada, mas está vazia.');
                                }
                            } else {
                                console.log('Texto da legenda não encontrado no nó.');
                            }
                        }
                    });
                });
            });

            // Configuração do observador
            observer.observe(captionContainer, { childList: true, subtree: true });

            console.log('Observador de legendas iniciado.');
        } else {
            console.log('Contêiner de legendas não encontrado. Tentando novamente em 1 segundo.');
            setTimeout(initializeCaptionObserver, 1000);
        }
    }

    // Função para localizar o contêiner de legendas
    function findCaptionContainer() {
        const container = document.querySelector('[jsname="YSxPC"]');
        if (container) {
            console.log('findCaptionContainer: Contêiner de legendas localizado:', container);
        } else {
            console.log('findCaptionContainer: Contêiner de legendas não encontrado.');
        }
        return container;
    }

    // Inicializa o observador
    initializeCaptionObserver();
})();
