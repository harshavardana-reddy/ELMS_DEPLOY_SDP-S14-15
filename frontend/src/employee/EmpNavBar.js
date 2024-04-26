import React,{useEffect, useState} from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import ApplyLeave from "./ApplyLeave";
import EmployeeHome from "./EmployeeHome";
import EmployeeProfile from "./EmployeeProfile";
import LeaveHistory1 from "./LeaveHistory";
import BackendURLS from "../config";
import axios from 'axios'
import ViewLeave from "./ViewLeave";
import PageNotFound from "./PageNotFound";
import LeaveAnalysis from './LeaveAnalysis';
export default function EmpNavBar() {
  const [empid,setEmpID] = useState('')
  const navigate = useNavigate();
  const [profile,setProfile] = useState('')
  const handlelogout = () => {
    sessionStorage.removeItem("employee");
    sessionStorage.removeItem("isEmployeeLoggedIn");
    sessionStorage.removeItem('EmployeeToken')
    navigate("/employeelogin");
    window.location.reload();
  };
  
  useEffect(() => {
    const employee = JSON.parse(sessionStorage.getItem('employee'));
    if (employee) {
      setEmpID(employee.EmployeeID);
      axios.get(`${BackendURLS.Employee}/viewProfile/${employee.EmployeeID}`, {
        headers: {
          Authorization: sessionStorage.getItem('EmployeeToken')
        },
        responseType:"arraybuffer"
      })
      .then(response => {
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        // console.log(response)
        const dataUrl = `data:image/jpeg;base64,${base64}`;
        setProfile(dataUrl);
      })
      .catch(error => {
        console.error('Error fetching employee profile:', error);
      });
    }
  }, []);
  // console.log(empid)
  
  return (
    <div style={{overflow:'visible'}} >
      <div
        className="navbar bg-lightblue border-b-2 border-gray-400 rounded-lg"
        style={{
          backgroundColor: "gray",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem",
          zIndex:999
        }}
      >
        <div className="flex-1 flex" align="center">
          <Link className="btn btn-ghost text-xl" style={{ textAlign: "left" }}>
            Employee Leave Management System
          </Link>
          <div 
          className="mx-auto"
          //  style={{ maxWidth: '200px' }}
          // style={{ marginLeft:'auto',marginRight: '26%' }}
          >
            <Link className="btn btn-ghost text-xl">Employee-Portal</Link>
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/employee/EmpHome">Home</Link>
            </li>
            <li>
              <details>
                <summary>Leave</summary>
                <ul className="p-3 bg-base-100 rounded-t-none">
                  <li>
                    <Link to="/employee/applyleave">Apply Leave</Link>
                  </li>
                  <li>
                    <Link to="/employee/leaverecords">Leave History</Link>
                  </li>
                  
                </ul>
              </details>
             
            </li>
            <li>
                    <Link to="/employee/leaveAnalysis">Analysis</Link>
              </li>
            <li>
              <Link to="/employee/profile">Profile</Link>
              {/* <img src={profileImgUrl} alt="Profile" style={{ marginLeft: "5px", width: "20px", height: "20px", borderRadius: "50%" }} /> */}
            </li>
            <li>
              <Link onClick={handlelogout}>logout</Link>
            </li>
          </ul>
          <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="Profile" src={profile} />
            </div>
          </div>
        </div>  
        </div>
      </div>
      <Routes>
        <Route path="/" element={<EmployeeHome />} exact/>
        <Route path="/employee/EmpHome" element={<EmployeeHome />} exact/>
        <Route path="/employee/applyleave" element={<ApplyLeave />} exact/>
        <Route path="/employee/profile" element={<EmployeeProfile />} exact/>
        <Route path="/employee/leaverecords" element={<LeaveHistory1 />} exact/>
        <Route path="/employee/viewLeave/:ID" element={<ViewLeave/>}  exact/>
        <Route path="/employee/leaveAnalysis" element={<LeaveAnalysis/>}  exact/>
        <Route path="*" element={<PageNotFound/>} exact/>
      </Routes>
    </div>
  );
}
