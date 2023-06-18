/*
runs in the background of the browser.
It is responsible for handling events, communicating with other parts of the extension,
and performing tasks that require continuous execution
even when the extension's popup or content scripts are not active.
*/

//listener for when the extension is installed or updated to initialize values
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install"||details.reason == "update") {
        chrome.storage.local.set({log: false});//is logged in
        chrome.storage.local.set({window_open: false});//is form currently open
        chrome.storage.local.set({isLinkedin: true}); //automatic open form for linkedin
        chrome.storage.local.set({isIndeed: true}); //automatic open form for indeed
    }
});

//listener for tab updates- a message is sent to contentScripts to check if there is a new linkedin/indeed page opened
chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
      //read changeInfo data and send a message to contentScript when there is a change of new url
      if (changeInfo.url) {
        chrome.action.setBadgeText({ text: '' });
        chrome.tabs.sendMessage( tabId, {
          message: 'newUrl!',
        })
      }
    }
  );

//listener for incoming messages
chrome.runtime.onMessage.addListener(async (msg,sender,sendResponse)=>{
    if(msg==='openForm'){ //opens a send job form
        chrome.storage.local.set({window_open: true});
        openForm();
    }
    if(msg==='getUrl'){//get the current tab url
      await getUrl();
    }
    if(msg.hasOwnProperty('action') && msg.action==='changeBadge'){//for changing the icon image badge
      const badgeText = msg.value.toString();
      chrome.action.setBadgeText({ text: badgeText });
    }
});

//function to get the current url of the active tab and store it in local storage
async function getUrl(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const { url } = tabs[0];
      chrome.storage.local.set({url: url});
       console.log(url);
    }});
}

//listener for window removal to initialize form parameters
chrome.windows.onRemoved.addListener(function(windowid) {
    chrome.storage.local.set({jobTitle:""});
    chrome.storage.local.set({location:""});
    chrome.storage.local.set({company:""});
    chrome.storage.local.set({window_open: false});
    chrome.storage.local.set({url: ""});
    chrome.action.setBadgeText({ text: '' });
   })

//opens a new form
function openForm(){
    const window_width=370
    const window_height=450
    const placing=0
    chrome.windows.create({
        width: window_width,
        height: window_height,
        type: 'popup',
        url: 'form_page.html',
        top: placing,
        left: placing,
        focused: true
      },
      () => {});

}

//function to execute a function if user logged in
//used for assigning the marked text to one of the parameters(role,company,location)
function assignAction(Func,info){
    chrome.storage.local.get("log", function(data) {
        if(data.log){
            Func(info,sendMessage)
        }
    });
}

//function to handle context menu item actions-after marking text and right click
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

//sending the marked text to form_page
function sendMessage(info,message){
    chrome.runtime.sendMessage({
        msg: message, 
        data: {
            content: info.selectionText
        }
    });
}

//listener for connecting to the popup script
chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === "popup") {
      //when closing popup initialize values
      port.onDisconnect.addListener(function() {
        chrome.storage.local.set({jobTitle:""});
        chrome.storage.local.set({location:""});
        chrome.storage.local.set({company:""});
        chrome.storage.local.set({window_open: false});
        chrome.storage.local.set({url: ""});
      });
  }
});

//opens the form to add a new job only if the window isn't open
async function openFormContextMenu(){
    chrome.storage.local.get(null, function(data) {
        if(!data.window_open){
            openForm();
            chrome.storage.local.set({window_open: true});
        }
      });
}

//function to add a company to local storage and send a message to form page
async function addCompany(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({company: info.selectionText});
    sendMessageFunc(info,"addCompany");
}

//function to add a role to local storage and send a message to form page
async function addRole(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({jobTitle: info.selectionText});
    sendMessageFunc(info,"addRole");
}

//function to add a location to local storage and send a message to form page
async function addLocation(info,sendMessageFunc){
    await openFormContextMenu();
    await chrome.storage.local.set({location: info.selectionText});
    sendMessageFunc(info,"addLocation");
}

//create context menu items for right click after marking text
var x=chrome.contextMenus.create({
  title: "Jobsy", 
  contexts:["selection"], 
  id: CONTEXT_MENU_ID,
},()=>{
    chrome.contextMenus.create({
        title: "Add Company",
        parentId: CONTEXT_MENU_ID,
        contexts:["selection"],//only appears when marking text
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