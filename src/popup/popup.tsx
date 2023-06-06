import { useState, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom'
import './popup.css'

const App=()=> {
    const [userName , setUserName] =useState("");
    const [password , setPassword] =useState("");
    const[errors, setErrors ]=useState(2);
    const[isFound, setIsFound] = useState(false);
    const[isSubmit, setIsSubmit]=useState(false);
    const[isChecked, setIsChecked]=useState(false);
    const[isRedirect, setIsRedirect]=useState(false);
    const[userNameError,setUserNameError]=useState("");
    const[passWordError,setpassWordError]=useState("");
    const[loginError,setloginError]=useState("");
    //checks values when log in clicked
    const sunbmitFun = (e) => {
        e.preventDefault();
        setIsSubmit(true);
        setErrors(checkErrors(userName,password));
    };




    //checking errors in entered values
    const checkErrors=(userName,password)=>{
        setUserNameError("");
        setpassWordError("");
        setloginError("");
        var isError=0;
        if(!userName){
            setUserNameError("Username is required");
            isError=1;
        }
        if(!password){
            setpassWordError("password is required");
            isError=1;
        }
        return isError;
    };


    const headers = new Headers();
    headers.append('content-type', 'application/json');
    const init = {
        method: 'POST',
        headers,
        body:JSON.stringify({ username:userName,password:password })
      };

    const checkDataBase=(async()=>{
        fetch('http://localhost:3000/auth/login', init)
        .then( response => response.json() )
        .then( data => {
            if(data.message==="logged in successfully"){
                setIsFound(true)
            }
            setIsChecked(true)
        } )
    })

    //checks if there are no errors and user found in database
    useEffect(()=>{
        if(!errors&&isSubmit){
            checkDataBase();
        }
        else if(errors && isSubmit){
            setIsSubmit(false)
        }
    },[errors,loginError]);


    function sendLogIn() {
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {"message": "log_true"});
        });
    }

    function login_success() {
        chrome.storage.local.set({log: true});
        sendLogIn();
        chrome.storage.local.set({user_name:userName});
        chrome.action.setPopup({popup: "logged_in.html"});
        window.location.href = 'logged_in.html';
      }
    useEffect(()=>{
        if(isFound){
            login_success()
        }
        else if(!isFound&&isChecked&&isSubmit){
            setUserNameError("");
            setpassWordError("");
            setloginError("Invalid username or password");
            setIsSubmit(false);
            setIsChecked(false);
        }
    },[isChecked]);

    return (
        
        <div className="wrapper">
            <div className="inner-warpper text-center">
                <h2 className="title">Login</h2>
                <form action="" id="formvalidate" onSubmit={sunbmitFun}>
                <div className="input-group">
                    <label className="palceholder" htmlFor="userName">User Name</label>
                    <input className="form-control" name="userName" id="userName" type="text" placeholder="" onChange={(e)=>setUserName(e.target.value)} />
                    <span className="lighting"></span>
                    <p className="error">{userNameError}</p>
                </div>
                <div className="input-group">
                    <label className="palceholder" htmlFor="userPassword">Password</label>
                    <input className="form-control" name="userPassword" id="userPassword" type="password" placeholder="" onChange={(e)=>setPassword(e.target.value)} />
                    <span className="lighting"></span>
                    <p className="error">{passWordError}</p>
                </div>
                <p className="error">{loginError}</p>
                <button type="submit" id="login">Login</button>
                </form>
            </div>
        </div>

    );
}

const root=document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>,root)