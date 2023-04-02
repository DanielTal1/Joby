

window.onload=function(){
    chrome.storage.local.get("isIndeed", function(data) {
        if(data.isIndeed){
            setTimeout(function(){indeedClickedByClass()}, 4000);
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
                if (request.message === 'log_true'){
                    alert("log_true");

                }
                if(request.message === 'log_false'){
                    alert("log_false");
                }  
            }
        });

  });





function messageBackground(){
    chrome.runtime.sendMessage(null,'openForm')
}





function indeedGetData(innerDoc){
    console.log("hi2")
    var jobTitle = innerDoc.getElementsByClassName("icl-u-xs-mb--xs icl-u-xs-mt--none jobsearch-JobInfoHeader-title is-embedded");
    var location=innerDoc.getElementsByClassName("css-6z8o9s eu4oa1w0");
    var company=innerDoc.getElementsByClassName("css-1cjkto6 eu4oa1w0")[1].children[0];

    if(jobTitle.length>0&&location.length>0&&company!=null){
        chrome.storage.local.set({jobTitle: jobTitle[0].innerText.trim()});
        chrome.storage.local.set({location: location[0].innerText.trim()});
        chrome.storage.local.set({company: company.innerText.trim()});
    }
}



function indeedClickedByClass(){
    const buttonId=["indeedApplyButton","applyButtonLinkContainer"];
    console.log("hi");
    var element=null;
    var iframe = document.getElementById('vjs-container-iframe') as HTMLIFrameElement;
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    for(var i=0;i<buttonId.length;i++){
        element=innerDoc.getElementById(buttonId[i]);
        if(element!=null){
            break;
        } 
    }
    if(element==null){
        return;
    }
    var company=innerDoc.getElementsByClassName("css-1cjkto6 eu4oa1w0")[1];
    console.log(company.children[0].innerHTML)
    element.onclick=function(){
                alert("Clicked");
        indeedGetData(innerDoc);
        chrome.storage.local.get("log", function(data) {
            alert(data.log);
            if(data.log){
                messageBackground();
            }
          });
    }

}

