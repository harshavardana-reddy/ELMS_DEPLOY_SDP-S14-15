import React, { useState, useEffect } from 'react';
import AdminNavBar from './AdminNavBar';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import BackendURLS from "../config";
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button, Spinner } from '@nextui-org/react';

export default function ViewEmployeeByID() {
  const [employeeData, setEmployeeData] = useState(null);
  const [profile,setProfile] = useState('')
  
  const navigate  = useNavigate()
  const { id } = useParams();

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/employeebyID/${id}`,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      });
      setEmployeeData(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const getProfile =async()=>{
    try {
      const response = await axios.get(`${BackendURLS.Admin}/viewProfile/${id}`, {
          headers: {
              Authorization: sessionStorage.getItem('AdminToken')
          },
          responseType: 'arraybuffer'
      });

      const base64 = btoa(
          new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
          )
      );
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      return dataUrl;
  } catch (error) {
      console.error('Error fetching profile image:', error);
      return ''; // Return an empty string if there's an error
  }
  }

  useEffect(() => {
    fetchEmployeeData();   
  }, [id]);
  useEffect(() => {
    if (employeeData && employeeData.EmployeeID) {
      getProfile(employeeData.EmployeeID).then(profileUrl => {
        setProfile(profileUrl); // Set loading state to false when profile image is loaded
      });
    }
  }, [employeeData]);

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
                  <img
                    src={profile}
                    alt="avatar"
                    className="rounded-full mx-auto mb-4"
                    style={{ width: "150px", height: "150px" }}
                  />
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
                    <button className="button" onClick={() => navigate(`/admin/UpdateEmployee/${employeeData.EmployeeID}`)} >
                      Update
                    </button>
                    &nbsp;&nbsp;
                    <button className="button" onClick={() => navigate(`/admin/viewleaveHistory/${employeeData.EmployeeID}`)} >
                      View Leave History
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
            
          ) : (
            <Spinner size='lg' label='Loading....' />
          )}
          <div align="center" >
            <Button color="secondary" variant='shadow' onClick={()=>navigate(`/admin/viewemployees`)} >Go Back</Button>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
