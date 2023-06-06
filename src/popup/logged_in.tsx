import { useState,useEffect} from 'react';
import React from 'react';
import ReactDOM from 'react-dom'
import './logged_in.css'


const App=()=> {
    
    const [userName , setUserName] =useState("");
    const [jobTitle , setJobTitle] =useState("");
    const [location , setLocation] =useState("");
    const [company , setCompany] =useState("");
    const [url , setUrl] =useState("");
    const[error, setError]=useState("");
    const[send,setSend]=useState(false);
    chrome.runtime.connect({ name: "popup" });

    useEffect(() => {
        chrome.storage.local.get("user_name", function(data) {
            setUserName(data.user_name)
        
        });
        chrome.storage.local.get("jobTitle", function(data) {
            if(data.jobTitle!=null){
                setJobTitle(data.jobTitle);
                (document.getElementById("Role") as HTMLInputElement).value=data.jobTitle
            }
        });
        chrome.storage.local.get("location", function(data) {
            if(data.location!=null){
                setLocation(data.location);
                (document.getElementById("Location") as HTMLInputElement).value=data.location
            }
        });
        chrome.storage.local.get("company", function(data) {
            if(data.company!=null){
                setCompany(data.company);
                (document.getElementById("Company") as HTMLInputElement).value=data.company;
            }
        });
        chrome.storage.local.get("url", function(data) {
            if(data.url!=null){
                setUrl(data.url);
                console.log(url);
            }
        });

      }, []); 



    const sunbmitFun = (e) => {
        e.preventDefault();
        console.log(userName)
        console.log(company)
        console.log(location)
        console.log(company)
        setError("")
        setSend(checkErrors());
    };


    const checkErrors=()=>{
        if(jobTitle=="" || location=="" || company==""){
            setError("Please insert all values")
            return false;
        }
        return true           
    };


    useEffect(()=>{
        if(send&&error==""){
            sendJob()
            setSend(false)
        }
    },[error,send]);



    const headers = new Headers();
    headers.append('content-type', 'application/json');
    const init = {
        method: 'POST',
        headers,
        body:JSON.stringify({ username:userName,company:company,location:location,role:jobTitle,url:url })
      };

    const sendJob=(async()=>{
        fetch('http://localhost:3000/jobs', init)
        .then( response => response.json() )
        .then( data => {
            if(data.message==="Job added successfully"){
                window.close();
            }
            else{
                setSend(false)
                setError("Error")
            }
        } )

    })

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log("got_message")
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
            <form action="" id="formvalidate" onSubmit={sunbmitFun}>
            <div className="input-group">
                <label className="palceholder" htmlFor="Company">Company</label>
                <input type="text" id="Company" className="form-control mt-1"  onChange={(e)=>setCompany(e.target.value)}/>
                <span className="lighting"></span>
            </div>
            <div className="input-group">
                <label className="palceholder" htmlFor="Role">Role</label>
                <input type="text" id="Role" className="form-control mt-1"  onChange={(e)=>setJobTitle(e.target.value)} />
                <span className="lighting"></span>
            </div>
            <div className="input-group">
                <label className="palceholder" htmlFor="Location">Location</label>
                <input type="text" id="Location" className="form-control mt-1"  onChange={(e)=>setLocation(e.target.value)} />
                <span className="lighting"></span>
            </div>
            <p className="error">{error}</p>
            <button type="submit" id="AddJob">Add Job</button>
            </form>
        </div>
    </div>







    );
}

const root=document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App/>,root)