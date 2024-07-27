
/* 
const gpaDiv = document.querySelector('.gpa-div');
const gpa = document.querySelector('.gpa')
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (gpa){
      const gpa = request.gpa;
      console.log(gpa);
      gpaDiv.style = "display:block";
      gpa.textContent = gpa;
    }
}); */


/* (async () => {
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result }] = await chrome.scripting.executeScript(({
    target: { tabId: tab.id }, 
    func: () => {
      console.log(document.querySelector('table'))
    }
  }));
})();
 */


function addGPAToDOM(gpa){
  const gpaDiv = document.querySelector('.gpa-div');
  const gpaText = document.querySelector('#gpa');
  console.log(`request: ${gpa}`);
    if (gpa) {
      gpaDiv.style = "display:block;"
      gpaText.textContent = gpa.toFixed(2);
    }

}


document.addEventListener("DOMContentLoaded",  async function() {
  




  await chrome.runtime.sendMessage({from : 'popup', to : "content"});  


  
})


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.from === 'background' && request.to === 'popup'){
      const gpa = request.gpa;
      addGPAToDOM(gpa);
  }
})

/* chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if(request.from === 'background' && request.to === 'popup'){
      const gpa = request.gpa;
      
  }
  
});
 */



/* async function getCurrentTab() {
  let queryOptions = { active: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

function injectContentScript(tab) {
  const { id, url } = tab;
  chrome.scripting.executeScript(
      {
          target: { tabId: id, allFrames: true },
          files: ['scripts/content.js']
      }
  );
};

getCurrentTab().then((tab) => {
  injectContentScript(tab);
}); */