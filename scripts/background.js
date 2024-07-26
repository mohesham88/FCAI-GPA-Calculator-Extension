let inter = null;

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage({ from: 'background', to: 'popup', gpa: message.gpa }, function(response) {
    if (response && response.success) {
      clearInterval(inter);
      inter = null; // Clear the interval and reset the variable
    }
  });
}



chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.from === 'content' && message.to === 'popup') {

    inter = setInterval(sendMessageToPopup , 1000 , message , inter);

  }/*  else if (message.from === 'popup' && message.to === 'content') {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {from: 'background', to: 'content', data: message.data});
    });
  } */
});