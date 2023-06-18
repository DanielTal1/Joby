/*
contentScript is a file that runs in the context of web pages.
It is injected into a webpage by the browser when specified conditions are met,
such as when the extension is enabled for a particular website.
*/

//when loading page
window.onload=function(){
    chrome.storage.local.get("isIndeed", function(data) {
        if(data.isIndeed){
            chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Wait' }); //changing the badge to wait
            setTimeout(function(){try {
                indeedClickedByClass();
                indeedClickedByClassFrame();
              } catch (error) {
                console.error('An error occurred:', error);
              }}, 4000); //waiting to let the page load
        }
    });
}

//listens to a new url message from background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        chrome.storage.local.get("isIndeed", function(data) {
            if(data.isIndeed){
                // listen for messages sent from background.js
                if (request.message === 'newUrl!') {
                    chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Wait' }); //changing the badge to wait
                    setTimeout(function(){try {
                        indeedClickedByClass();
                        indeedClickedByClassFrame();
                      } catch (error) {
                        console.error('An error occurred:', error);
                      }}, 2000); //waiting to let the page load
                }
            }
        });

  });


//messaging the background to open form
function messageBackground(){
    chrome.runtime.sendMessage(null,'openForm')
}

 //function to get the job title, location, and company elements from web page
function indeedGetData(){
    var jobTitle = document.getElementsByClassName("icl-u-xs-mb--xs icl-u-xs-mt--none jobsearch-JobInfoHeader-title is-embedded");
    var location=document.getElementsByClassName("css-6z8o9s eu4oa1w0");
    var company=document.getElementsByClassName("css-1cjkto6 eu4oa1w0");
    if(jobTitle.length>0&&location.length>0&&company!=null){
        //save the job title, location, and company in the local storage
        chrome.storage.local.set({jobTitle: jobTitle[0].textContent.trim()});
        chrome.storage.local.set({location: location[0].textContent.trim()});
        chrome.storage.local.set({company: company[0].textContent.trim()});
    }
}


//function to get the applying button and assign an callback to it
function indeedClickedByClass(){
    chrome.runtime.sendMessage(null,'getUrl');
    const buttonId=["indeedApplyButton","applyButtonLinkContainer"]; //looked for button id's
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
    chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Ready' }); //ready for clicking
    element.onclick=function(){ //onclick on the button
        indeedGetData();//get the data values
        chrome.storage.local.get("log", function(data) {
            if(data.log){
                messageBackground(); 
            }
          });
    }
}



function indeedGetDataFrame(innerDoc){
    var jobTitle = innerDoc.getElementsByClassName("icl-u-xs-mb--xs icl-u-xs-mt--none jobsearch-JobInfoHeader-title is-embedded");
    var location=innerDoc.getElementsByClassName("css-6z8o9s eu4oa1w0");
    var company=innerDoc.getElementsByClassName("css-1cjkto6 eu4oa1w0")[0];
    console.log(jobTitle);
    console.log(location);
    console.log(company);
    if(jobTitle.length>0&&location.length>0&&company!=null){
        chrome.storage.local.set({jobTitle: jobTitle[0].innerText.trim()});
        chrome.storage.local.set({location: location[0].innerText.trim()});
        chrome.storage.local.set({company: company.innerText.trim()});
    }
}


function indeedClickedByClassFrame(){
    const buttonId=["indeedApplyButton","applyButtonLinkContainer"];
    var element=null;
    var iframe = document.getElementById('vjs-container-iframe') as HTMLIFrameElement;
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    for(var i=0;i<buttonId.length;i++){
        element=innerDoc.getElementById(buttonId[i]);
        console.log(element);
        if(element!=null){
            break;
        } 
    }
    if(element==null){
        return;
    }
    chrome.runtime.sendMessage({ action: 'changeBadge', value: 'Ready' }); //ready for clicking
    element.onclick=function(){
        indeedGetDataFrame(innerDoc);
        chrome.storage.local.get("log", function(data) {
            if(data.log){
                messageBackground();
            }
          });
    }

}

