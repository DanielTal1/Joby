import { useState, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom'
import './options.css'
const App=()=> {

    //function to set default radio button selection
    function defaultRadioBtn(id_true,id_false){
        var radBtnDefault = document.getElementById(id_true) as HTMLInputElement;;
        radBtnDefault.defaultChecked = true;
        var radBtnDefault = document.getElementById(id_false) as HTMLInputElement;;
        radBtnDefault.defaultChecked = false;
    }

    //function to change the storage value based on the radio button selection
    function changeStorage(value){
        if(value==="linkedin_disable"){
            chrome.storage.local.set({isLinkedin: false});
        } else if(value==="linkedin_enable"){
            chrome.storage.local.set({isLinkedin: true});
        } else if(value==="indeed_enable"){
            chrome.storage.local.set({isIndeed: true});
        }else if(value==="indeed_disable"){
            chrome.storage.local.set({isIndeed: false});
        }
    }


    //set the initial radio button selection for Linkedin and Indeed options from storage
    chrome.storage.local.get("isLinkedin", function(data) {
        if(data.isLinkedin){
            defaultRadioBtn("linkedin_enable","linkedin_disable");
        } else{
            defaultRadioBtn("linkedin_disable","linkedin_enable");
        }
      });
    chrome.storage.local.get("isIndeed", function(data) {
        if(data.isIndeed){
            defaultRadioBtn("indeed_enable","indeed_disable");
        } else{
            defaultRadioBtn("indeed_disable","indeed_enable");
        }
      });

    //function to handle logout
    const logOutFunc = (e) => {
        e.preventDefault();
        chrome.storage.local.set({log: false});
        chrome.storage.local.set({user_name:""});
        chrome.action.setPopup({popup: "popup.html"});
        chrome.storage.local.set({jobTitle:""});
        chrome.storage.local.set({location:""});
        chrome.storage.local.set({company:""});
        chrome.storage.local.set({url: ""});
        window.close();
    };
    

    return (
        <div className="wrapper">
            <div className="inner-warpper text-center">
                <h2 className="title">OPTIONS</h2>
                <form action="" id="formvalidate" >
                    <div className="input-group">
                        <h2 className="title2">Linkedin automatic</h2>
                        <label className="container">Enable
                            <input type="radio" id="linkedin_enable"  name='linkedin' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => changeStorage(e.target.id)}/>
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">Disable
                            <input type="radio" id="linkedin_disable" name='linkedin' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => changeStorage(e.target.id)}/>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                    <div className="input-group">
                        <h2 className="title2">Indeed automatic</h2>
                        <label className="container">Enable
                            <input type="radio"  id="indeed_enable" name='indeed' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => changeStorage(e.target.id)} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="container">Disable
                            <input type="radio" id="indeed_disable" name='indeed' onChange={(e: React.ChangeEvent<HTMLInputElement>): void => changeStorage(e.target.id)}/>
                            <span className="checkmark"></span>
                        </label>
                    </div>
                <button className="logOut" onClick={logOutFunc} >Log out</button>
                </form>
            </div>
        </div>

    );
}

const root=document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>,root)