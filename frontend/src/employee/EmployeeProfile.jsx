import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackendURLS from "../config";
import "./style.EmployeeProfile.css"; // Import CSS file for styling
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Spinner } from "@nextui-org/react";

export default function EmployeeProfile() {
  const [employeeData, setEmployeeData] = useState(null);
  const [pwdBox, setPwdBox] = useState(false);
  const [profileBox, SetProfileBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [File, setFile] = useState(null);
  const [profile,setProfile] = useState('')

  const fetchEmployeeData = async () => {
    try {
      const empdata = JSON.parse(sessionStorage.getItem("employee"));
      if (empdata) {
        setEmployeeData(empdata);
        // console.log(empdata)
        await axios.get(`${BackendURLS.Employee}/viewProfile/${empdata.EmployeeID}`, {
          headers: {
            Authorization: sessionStorage.getItem('EmployeeToken')
          },
          responseType:'arraybuffer'
        })
        .then(response => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );
          const dataUrl = `data:image/jpeg;base64,${base64}`;
          // console.log(dataUrl)
          // console.log(response.data)
          setProfile(dataUrl);
        })
        .catch(error => {
          console.error('Error fetching employee profile:', error);
        });
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const ChangePasswordVisible = async () => {
    try {
      setPwdBox(true);
    } catch (e) {
      console.log(e.message);
    }
  };
  const handleSetPassword = async () => {
    try {
      if (
        newPassword.length >= 8 &&
        currentPassword.length >= 8 &&
        confirmPassword.length >= 8
      ) {
        if (newPassword !== confirmPassword) {
          toast.error("Both Passwords must be same",{theme:'colored'});
          return;
        }
        const data = {
          newpwd: newPassword,
          oldpwd: currentPassword,
        };
        console.log(data);
        const response = await axios.post(
          `${BackendURLS.Employee}/ChangePassword/${employeeData.EmployeeID}`,
          data,{
            headers:{
              "Authorization":sessionStorage.getItem('EmployeeToken')
            }
          }
        );
        // console.log(response.data)
        if (response.status === 200) {
          setPwdBox(false);
          toast.success("Password changed successfully!",{theme:'colored'});
        }
      } else if (
        newPassword.length === 0 ||
        currentPassword.length === 0 ||
        confirmPassword.length === 0
      ) {
        toast.warning("All fields must be filled",{theme:'colored'});
      } else {
        toast.warning("Password should atleast contain 8 letters",{theme:'colored'});
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data);
    }
  };
  const handleProfileUpdate = async () => {
    try {
      console.log(File);
      const formData = new FormData();
      formData.append("file", File);
      const response = await axios.post(
        `${BackendURLS.Employee}/uploadprofile/${employeeData.EmployeeID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for FormData
            Authorization:sessionStorage.getItem('EmployeeToken')
          },
        }
      );
      if (response.status === 200) {
        toast.success("Profile Update/Upload successful!");
        SetProfileBox(false);
        window.location.reload();
      }
      
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div>
      <br />
      <br />
      <div className="flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-md rounded-lg p-6 w-full max-w-screen-lg"
        >
          <h1 className="text-3xl text-center font-semibold mb-4">
            Employee Profile
          </h1>
          {employeeData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-container">
              <div className="text-center">
                <div className="card">
                {profile && <img
                    src={profile}
                    alt="avatar"
                    className="rounded-full mx-auto mb-4"
                    style={{ width: "150px", height: "150px" }}
                  />} 
                  <div className="card-info">
                    <p className="text-gray-500 mb-2">
                      Name: {employeeData.EmployeeName}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Date of Birth: {employeeData.EmployeeDOB}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Gender: {employeeData.EmployeeGender}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Age: {employeeData.EmployeeAge}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Email: {employeeData.EmployeeMailID}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Contact: {employeeData.EmployeeContact}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <br />
                <br />
                <br />
                <div className="card">
                  <div className="card-info">
                    <p className="text-gray-500 mb-2">
                      Department: {employeeData.EmployeeDepartment}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Qualification: {employeeData.EmployeeQualification}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Salary: {employeeData.EmployeeSalary}
                    </p>
                    <p className="text-gray-500 mb-2">
                      Location: {employeeData.EmployeeLocation}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <button className="button" onClick={ChangePasswordVisible}>
                      Change Password
                    </button>
                    <button
                      className="button"
                      onClick={(e) => SetProfileBox(true)}
                    >
                      Update Profile Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Spinner size="lg" label="Loading..." />
          )}
        </motion.div>
      </div>
      <Dialog
        visible={pwdBox}
        onHide={() => setPwdBox(false)}
        header="Change Password"
        footer={
          <div align="center">
            <Button
              className="button"
              label="Change Password"
              onClick={handleSetPassword}
            />
          </div>
        }
      >
        <div>
          <label>Current Password:</label>
          <input
            class="cpwd"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            class="cpwd"
            type="password"
            id="newpwd"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            class="cpwd"
            type="password"
            id="pwd"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      </Dialog>
      <Dialog
        visible={profileBox}
        onHide={() => SetProfileBox(false)}
        header="Upload Profile"
        footer={
          <div align="center">
            <Button
              className="button"
              onClick={handleProfileUpdate}
              label="Upload Photo"
            />
          </div>
        }
      >
        <div>
          <label>Choose Picture : </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".jpeg, .jpg, .png"
          />
        </div>
      </Dialog>
      <ToastContainer />
    </div>
  );
}
