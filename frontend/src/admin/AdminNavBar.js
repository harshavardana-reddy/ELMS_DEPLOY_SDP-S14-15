import React,{useState,useEffect} from 'react';
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import AdminHome from "../admin/AdminHome";
import AddEmployee from "../admin/AddEmployee";
import ViewEmployees from "../admin/ViewEmployees";
import ViewEmployeeByID from "../admin/ViewEmployeeByID";
import ViewLeaves from "../admin/ViewLeaves";
import UpdateEmployeeByID from './UpdateEmployeeByID'
import BackendURLS from "../config";
import LeaveAnalysis from './LeaveAnalysis';
import ReviewLeaves from './ReviewLeaves';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,Checkbox,Button} from "@nextui-org/react";
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';
import PageNotFound from './PageNotFound';
import LeaveHistoryByEID from './LeaveHistoryByEID';

export default function AdminNavBar() {
  const [box,setBox] = useState(false)
  const [oldpwd,setOldpwd] = useState('')
  const [newpwd,setNewpwd] = useState('')
  const [conpwd,setConpwd] = useState('')
  const [uname,setUname] = useState('')
  const [token,setToken] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    const adminData = JSON.parse(sessionStorage.getItem('admin'));
    if (adminData && adminData.username) {
    setUname(adminData.username);
    }
  },[])
  const handleChangePassword = async()=>{
    // console.log("Clicked")
    // console.log(conpwd,newpwd,oldpwd)
    try {
      if (
        newpwd.length >= 3 &&
        oldpwd.length >= 3 &&
        conpwd.length >= 3
      ) {
        if (newpwd !== conpwd) {
          toast.error("New Password and Current Password must be same");
          return;
        }
        const data = {
          newpwd,
          oldpwd
        };
        // console.log(data);
        const response = await axios.post(
          `${BackendURLS.Admin}/ChangePassword/${uname}`,
          data,{
            headers:{
              Authorization:sessionStorage.getItem('AdminToken')
            }
          }
        );
        // console.log(response.data)
        if (response.status === 200) {
          var btn = document.getElementById('btn');
          btn.disabled = true;
          toast.success("Password changed successfully!",{ autoClose: 1000,theme:'colored' });
          setTimeout(() => {
            setBox(false);
          }, 1000);
        }
      } else if (
        newpwd.length === 0 ||
        oldpwd.length === 0 ||
        conpwd.length === 0
      ) {
        toast.warning("All fields must be filled",{theme:'colored'});
      } 
      // else {
      //   toast.warning("Password should atleast contain 8 letters");
      // }
    } catch (e) {
      // console.log(e);
      toast.error(e.response.data,{theme:'colored'});
    }
  }

  const ShowPassword = ()=>{
    const pwd1 = document.getElementById('oldpwd')
    const pwd2 = document.getElementById('newpwd')
    const pwd3 = document.getElementById('con')
    if(pwd1.type === 'password'&& pwd2.type === 'password' &&pwd3.type === 'password' ){
      pwd1.type = 'text'
      pwd2.type = 'text'
      pwd3.type = 'text'
    }
    else{
      pwd1.type = 'password'
      pwd2.type = 'password'
      pwd3.type = 'password'

    }
  }
  
  
  const handleLogout = ()=>{
    sessionStorage.removeItem("isAdminLoggedIn")
    sessionStorage.removeItem("admin")
    sessionStorage.removeItem("AdminToken")
    navigate('/adminlogin')
    window.location.reload()
  }
  return (
    <div style={{ overflow: 'visible' }}>
      <div className="navbar bg-lightblue border-b-2 border-gray-400 rounded-lg" style={{ backgroundColor: 'gray', zIndex: 999 }}>
        <div className="flex-1 flex" align="center">
          <Link className="btn btn-ghost text-xl" style={{ textAlign: 'left' }}>Employee Leave Management System</Link>
          <div 
          className='mx-auto'
          // style={{ marginLeft:'auto',marginRight: '155px' }}
          >
            <Link className="btn btn-ghost text-xl ">Admin-Portal</Link>
          </div>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/admin/AdminHome" >Home</Link></li>
            <li >
              <details style={{ zIndex: 999 }}>
                <summary>
                  Employee
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none" style={{ overflow: 'visible' }}>
                  <li><Link to="/admin/addemployee" >Add Employee</Link></li>
                  <li><Link to="/admin/viewemployees"  >View Employees</Link></li>
                </ul>
              </details>
            </li>
            <li>
              <details style={{ zIndex: 999 }}>
                <summary>
                  Leave
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none" style={{ overflow: 'visible' }}>
                  <li><Link to="/admin/viewleaves" >Leaves Applied</Link></li>
                  <li><Link to="/admin/leaveAnalysis"  >Leave Analysis</Link></li>
                </ul>
              </details>
            </li>
            <li><Link onClick={()=>setBox(true)} >ChangePassword</Link></li>
            <li><Link onClick={handleLogout} >Logout</Link></li>
          </ul>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<AdminHome />} />
        <Route path="/admin/AdminHome" element={<AdminHome />}  exact/>
        <Route path="/admin/addemployee" element={<AddEmployee />}  exact/>
        <Route path="/admin/viewemployees" element={<ViewEmployees />}  exact/>
        <Route
          path="/admin/viewEmployee/:id"
          element={<ViewEmployeeByID /> }
          exact
        />
        <Route path="/admin/UpdateEmployee/:id" element={<UpdateEmployeeByID/>}  exact/>
        <Route path="/admin/viewleaves" element={<ViewLeaves />} exact />
        <Route path="/admin/leaveAnalysis" element={<LeaveAnalysis/>}  exact/>
        <Route path="/admin/ReviewLeave/:ID" element={<ReviewLeaves/>}  exact/>
        <Route path="/admin/viewleavehistory/:id" element={<LeaveHistoryByEID/>} />
        <Route path="*" element={<PageNotFound/>}  exact/>
      </Routes>
      <Modal backdrop={"blur"} isOpen={box} onClose={() => setBox(false)}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Change Password</ModalHeader>
        <ModalBody>
          <input
            id = "newpwd"
            placeholder="Enter Current Password"
            name="Current Password"
            type="password"
            onChange={(e) => setOldpwd(e.target.value)}
          />
          <input
            id = "oldpwd"
            placeholder="Enter New Password"
            name="New Password"
            type="password"
            
            onChange={(e) => setNewpwd(e.target.value)}
          />
          <input
            id="con"
            placeholder="Enter Confirm Password"
            name="Confirm Password"
            type="password"
            
            onChange={(e) => setConpwd(e.target.value)}
          />
          <Checkbox id="check" onClick={ShowPassword} >Show Pasword</Checkbox>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={() => setBox(false)}>
            Cancel
          </Button>
          <Button color="primary" id="btn" onPress={()=>handleChangePassword()}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
      <ToastContainer/>
    </Modal>
    </div>
  );
}
