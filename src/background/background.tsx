chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install"||details.reason == "update") {
        chrome.storage.local.set({log: false});
        chrome.storage.local.set({window_open: false});
        chrome.storage.local.set({isLinkedin: true});
        chrome.storage.local.set({isIndeed: true});
    }
});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      // read changeInfo data and do something with it
      // like send the new url to contentscripts.js
      if (changeInfo.url) {
        chrome.tabs.sendMessage( tabId, {
          message: 'newUrl!',
        })
      }
    }
  );

chrome.runtime.onMessage.addListener((msg,sender,sendResponse)=>{
    if(msg==='openForm'){
        chrome.storage.local.set({window_open: true});
        openForm();
    }
});


chrome.windows.onRemoved.addListener(function(windowid) {
    chrome.storage.local.set({jobTitle:""});
    chrome.storage.local.set({location:""});
    chrome.storage.local.set({company:""});
    chrome.storage.local.set({window_open: false});
   })

function openForm(){
    chrome.windows.create({
        width: 600,
        height: 650,
        type: 'popup',
        url: 'logged_in.html',
        top: 0,
        left: 0,
        focused: true
      },
      () => {});

}

function assignAction(Func,info){
    chrome.storage.local.get("log", function(data) {
        if(data.log){
            Func(info,sendMessage)
        }
    });
}

const CONTEXT_MENU_ID = "parent";
function getAction(info,tab) {
  if (info.menuItemId === "Company") {
    assignAction(addCompany,info)
  } else if(info.menuItemId === "Role"){
    assignAction(addRole,info)
  } else if(info.menuItemId ==="Location"){
    assignAction(addLocation,info)
  }
}

function sendMessage(info,message){
    chrome.runtime.sendMessage({
        msg: message, 
        data: {
            content: info.selectionText
        }
    });
}

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
      port.onDisconnect.addListener(function() {
        chrome.storage.local.set({jobTitle:""});
        chrome.storage.local.set({location:""});
        chrome.storage.local.set({company:""});
        chrome.storage.local.set({window_open: false});
      });
  }
});


async function openFormContextMenu(){
    chrome.storage.local.get(null, function(data) {
        if(!data.window_open){
            openForm();
            chrome.storage.local.set({window_open: true});
        }
      });
}

async function addCompany(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({company: info.selectionText});
    sendMessageFunc(info,"addCompany");
}

async function addRole(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({jobTitle: info.selectionText});
    sendMessageFunc(info,"addRole");
}


async function addLocation(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({location: info.selectionText});
    sendMessageFunc(info,"addLocation");
}


var x=chrome.contextMenus.create({
  title: "Jobsy", 
  contexts:["selection"], 
  id: CONTEXT_MENU_ID,
},()=>{
    chrome.contextMenus.create({
        title: "Add Company",
        parentId: CONTEXT_MENU_ID,
        contexts:["selection"],
        id: "Company"
    
      });
      chrome.contextMenus.create({
        title: "Add Role",
        parentId: CONTEXT_MENU_ID,
        contexts:["selection"],
        id: "Role"
      });
      chrome.contextMenus.create({
        title: "Add Location",
        parentId: CONTEXT_MENU_ID,
        contexts:["selection"],
        id: "Location"
      });
});
chrome.contextMenus.onClicked.addListener(getAction)