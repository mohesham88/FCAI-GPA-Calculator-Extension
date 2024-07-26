
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




document.addEventListener("DOMContentLoaded", async function() {
  const gpaDiv = document.querySelector('.gpa-div');
  const gpaText = document.querySelector('#gpa');
  const storedGpa = await chrome.storage.local.get('gpa');

  console.log(storedGpa)

  
  if (storedGpa) {
    const gpa = storedGpa.gpa;
    gpaDiv.style.display = "block";
    gpaText.textContent = gpa.toFixed(2);
  }



  /* chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const gpa = request.gpa;
    console.log(`request: ${gpa}`);
    if (gpa) {
      gpaDiv.style.display = "block";
      gpaText.textContent = gpa.toFixed(2);
    }
    sendResponse({
      data : "GPA received"
    })
    return true;
  }); */
})





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