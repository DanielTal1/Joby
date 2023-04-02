

window.onload=function(){
    chrome.storage.local.get("isLinkedin", function(data) {
        if(data.isLinkedin){
            linkedinClickedByText()
        }
      });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.local.get("isLinkedin", function(data) {
            if(data.isLinkedin){
                if (request.message === 'newUrl!') {
                    setTimeout(function(){linkedinClickedByText()}, 2000);
                  }
                  if (request.message === 'log_true'){
                    alert("log_true");
            
                  }
                  if(request.message === 'log_false'){
                    alert("log_false");
                  }
            }
          });
  });






function linkedinClickedByText(){
    var elements = document.getElementsByTagName("button");  
    var searchedText="Apply"
    for(var i=0;i<elements.length;i++){
        if (elements[i].textContent.includes(searchedText)) {
            console.log("----------------------------------")
            console.log("found");
            console.log(elements[i].id)
            elements[i].addEventListener('click', function() {
                alert("Clicked");
                linkedinGetData();
                chrome.storage.local.get("log", function(data) {
                    alert(data.log);
                    if(data.log){
                        chrome.runtime.sendMessage(null,'openForm');
                    }
                  });
            },true);
          }
    }

}


function linkedinGetData(){
    console.log("hi2")
    var jobTitle = document.getElementsByClassName("t-24 t-bold jobs-unified-top-card__job-title");
    var location=document.getElementsByClassName("jobs-unified-top-card__bullet");
    var company=document.getElementsByClassName("jobs-unified-top-card__company-name");
    if(jobTitle.length>0&&location.length>0&&company.length>0){
        chrome.storage.local.set({jobTitle: jobTitle[0].textContent.trimStart().trimEnd()});
        chrome.storage.local.set({location: location[0].textContent.trimStart().trimEnd()});
        chrome.storage.local.set({company: company[0].textContent.trimStart().trimEnd()});
    }
}



