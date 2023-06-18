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

      }, []); 


    const sunbmitFun = (e) => {
        e.preventDefault();
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
        //send job if send is true and there are no errors
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
            else if(data.message==="Job already exists"){
                setSend(false)
                setError("Job already exists")
            }
            else{
                setSend(false)
                setError("Error")
            }
        } )

    })




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