// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url.includes("https://meet.google.com/")) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js'],
            world: 'MAIN' // Injetar no contexto da página
        });
    }
});
