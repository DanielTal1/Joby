import { useState,useEffect} from 'react';
import React from 'react';
import ReactDOM from 'react-dom'
import './logged_in.css'


const App=()=> {
    const [userName , setUserName] =useState("");
    const [jobTitle , setJobTitle] =useState("");
    const [location , setLocation] =useState("");
    const [company , setCompany] =useState("");


chrome.storage.local.get("user_name", function(data) {
    setUserName(data.user_name)
  });

chrome.storage.local.get("jobTitle", function(data) {
    setJobTitle(data.jobTitle)
});
chrome.storage.local.get("location", function(data) {
    setLocation(data.location)
});
chrome.storage.local.get("company", function(data) {
    setCompany(data.company)
});


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.msg=="addCompany"){
            (document.getElementById("Company") as HTMLInputElement).value=request.data.content
            setCompany(request.data.content)
        }
        else if(request.msg=="addRole"){

            (document.getElementById("Role") as HTMLInputElement).value=request.data.content
            setJobTitle(request.data.content)
        }
        else if(request.msg=="addLocation"){
  
            (document.getElementById("Location") as HTMLInputElement).value=request.data.content
            setLocation(request.data.content)
        }
    }
);




return (
    <div className="wrapper">
    <div className="inner-warpper text-center">
        <h2 className="title">Welcome {userName}</h2>
        <form action="" id="formvalidate">
        <div className="input-group">
            <label className="palceholder" htmlFor="Company">Company</label>
            <input type="text" id="Company" className="form-control mt-1"  defaultValue={company}onChange={(e)=>setCompany(e.target.value)}/>
            <span className="lighting"></span>
        </div>
        <div className="input-group">
            <label className="palceholder" htmlFor="Role">Role</label>
            <input type="text" id="Role" className="form-control mt-1" defaultValue={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} />
            <span className="lighting"></span>
        </div>
        <div className="input-group">
            <label className="palceholder" htmlFor="Location">Location</label>
            <input type="text" id="Location" className="form-control mt-1" defaultValue={location} onChange={(e)=>setLocation(e.target.value)} />
            <span className="lighting"></span>
        </div>
        <button type="submit" id="AddJob">Add Job</button>
        </form>
    </div>
</div>







    );
}

const root=document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>,root)