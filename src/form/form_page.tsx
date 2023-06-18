import { useState, useEffect } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import './form_page.css';


const App = () => {
  const [userName, setUserName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [send, setSend] = useState(false);
  //connect to the background script(popup is the name of the port to passing messages)
  chrome.runtime.connect({ name: 'popup' });

  //fetch initial data from Chrome storage
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
  }, []); //works once at the when form created

  //function to handle form submission
  const sunbmitFun = (e) => {
    e.preventDefault();
    setError('');
    setSend(checkErrors());
  };

  //function to check form errors
  const checkErrors = () => {
    if (jobTitle === '' || location === '' || company === '') {
      setError('Please insert all values');
      return false;
    }
    return true;
  };

  //use effect to send job data when send and error states change
  useEffect(() => {
    if (send && error === '') {
      sendJob();
      setSend(false);
    }
  }, [error, send]);

  //HTTP headers and request body for sending job data
  const headers = new Headers();
  headers.append('content-type', 'application/json');
  const init = {
    method: 'POST',
    headers,
    body: JSON.stringify({ username: userName, company: company, location: location, role: jobTitle, url: url }),
  };

  //function to send job data to the server
  const sendJob = async () => {
    fetch('http://localhost:3000/jobs', init)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Job added successfully') {
          window.close();
        } else {
          setSend(false);
          setError('Error');
        }
      });
  };

  //listen for messages from the background script
  //when changing values with marking text and right click
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
        <form action="" id="formvalidate" onSubmit={sunbmitFun}>
          <div className="input-group">
            <label className="palceholder" htmlFor="Company">
              Company
            </label>
            <input
              type="text"
              id="Company"
              className="form-control mt-1 rounded-input"
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="palceholder" htmlFor="Role">
              Role
            </label>
            <input
              type="text"
              id="Role"
              className="form-control mt-1 rounded-input"
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="palceholder" htmlFor="Location">
              Location
            </label>
            <input
              type="text"
              id="Location"
              className="form-control mt-1 rounded-input"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <p className="error">{error}</p>
          <button type="submit" id="AddJob" className="rounded-button">
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<App />, root);
