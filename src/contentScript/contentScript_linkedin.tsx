/*
contentScript is a file that runs in the context of web pages.
It is injected into a webpage by the browser when specified conditions are met,
such as when the extension is enabled for a particular website.
*/

//when loading page
window.onload=function(){
    chrome.storage.local.get("isLinkedin", function(data) {
        if(data.isLinkedin){
            chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Wait' }); //changing the badge to wait
            setTimeout(function(){linkedinClickedByText()}, 7000);//waiting to let the page load
        }
      });
}

//listens to a new url message from background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.local.get("isLinkedin", function(data) {
            if(data.isLinkedin){
                // listen for messages sent from background.js
                if (request.message === 'newUrl!') {
                    chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Wait'});//changing the badge to wait
                    setTimeout(function(){linkedinClickedByText()}, 2000);//waiting to let the page load
                  }
            }
          });
  });




//function to get the applying button and assign an callback to it
function linkedinClickedByText(){
    var elements = document.getElementsByTagName("button");  
    var searchedText="Apply"
    chrome.runtime.sendMessage(null,'getUrl');
    for(var i=0;i<elements.length;i++){
        if (elements[i].textContent.includes(searchedText)) {
            console.log("----------------------------------")
            console.log("found");
            console.log(elements[i].id)
            chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Ready' });
            elements[i].addEventListener('click', function() {
                linkedinGetData();
                chrome.storage.local.get("log", function(data) {
                    if(data.log){
                        chrome.runtime.sendMessage(null,'openForm');
                    }
                  });
            },true);
          }
    }

}

 //function to get the job title, location, and company elements from web page
function linkedinGetData(){
    var jobTitle = document.getElementsByClassName("t-24 t-bold jobs-unified-top-card__job-title");
    var location=document.getElementsByClassName("jobs-unified-top-card__bullet");
    var company=document.getElementsByClassName("jobs-unified-top-card__company-name");
    if(jobTitle.length>0&&location.length>0&&company.length>0){
        chrome.storage.local.set({jobTitle: jobTitle[0].textContent.trimStart().trimEnd()});
        chrome.storage.local.set({location: location[0].textContent.trimStart().trimEnd()});
        chrome.storage.local.set({company: company[0].textContent.trimStart().trimEnd()});
    }
}



