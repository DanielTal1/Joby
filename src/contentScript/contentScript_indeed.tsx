

window.onload=function(){

    chrome.storage.local.get("isIndeed", function(data) {
        if(data.isIndeed){
            setTimeout(function(){indeedClickedByClass()}, 2000);
        }
    });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.local.get("isIndeed", function(data) {
            if(data.isIndeed){
                // listen for messages sent from background.js
                if (request.message === 'newUrl!') {
                    setTimeout(function(){indeedClickedByClass()}, 2000);
                }
            }
        });

  });





function messageBackground(){
    chrome.runtime.sendMessage(null,'openForm')
}





function indeedGetData(){
    var jobTitle = document.getElementsByClassName("icl-u-xs-mb--xs icl-u-xs-mt--none jobsearch-JobInfoHeader-title is-embedded");
    var location=document.getElementsByClassName("css-6z8o9s eu4oa1w0");
    var company=document.getElementsByClassName("css-1cjkto6 eu4oa1w0")[1];

    if(jobTitle.length>0&&location.length>0&&company!=null){
        chrome.storage.local.set({jobTitle: jobTitle[0].textContent.trim()});
        chrome.storage.local.set({location: location[0].textContent.trim()});
        chrome.storage.local.set({company: company.textContent.trim()});
    }
}



function indeedClickedByClass(){
    console.log("hi");
    chrome.runtime.sendMessage(null,'getUrl');
    const buttonId=["indeedApplyButton","applyButtonLinkContainer"];
    var element=null;
    for(var i=0;i<buttonId.length;i++){
        element=document.getElementById(buttonId[i]);
        console.log(element);
        if(element!=null){
            break;
        } 
    }
    if(element==null){
        return;
    }
    element.onclick=function(){
        indeedGetData();
        chrome.storage.local.get("log", function(data) {
            if(data.log){
                messageBackground();
            }
          });
    }

}

