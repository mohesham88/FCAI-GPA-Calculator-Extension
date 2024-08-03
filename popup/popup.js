
function addGPAToDOM(gpa){
  const gpaDiv = document.querySelector('.gpa-div');
  const gpaText = document.querySelector('#gpa');
  console.log(`request: ${gpa}`);
    if (gpa) {
      gpaDiv.style = "display:block;"
      gpaText.textContent = gpa.toFixed(2);
    }

}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}







document.addEventListener("DOMContentLoaded",  async function() {

  const urls = [
    'http://193.227.14.58/#/courses-per-students',
    'http://193.227.14.58/#/courses-per-students/',
    'http://newecom.fci-cu.edu.eg/#/courses-per-students',
    'http://newecom.fci-cu.edu.eg/#/courses-per-students/'
  ]

  const currentTab = await getCurrentTab();
  console.log(currentTab.url)
  if(urls.indexOf(currentTab.url) !== -1){

    // handshake with the worker thread to let it know that the popup is active
    await chrome.runtime.sendMessage({from : 'popup', to : "background", "message" : "handshake"}, function (response) {
      console.log(response)
      if(response.gpa){
        addGPAToDOM(response.gpa)
      }
    });  

  }else {
    const error = document.querySelector('.error');
    error.style.display = 'block';
    error.textContent = `Please go to the FCAI grades page and signin for the extension to work\n ${urls[0]}`;
  }


})


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.from === 'background' && request.to === 'popup'){
    console.log(request);
    if(request && request.gpa){
      const gpa = request.gpa;
      addGPAToDOM(gpa);
    }
  }

})
