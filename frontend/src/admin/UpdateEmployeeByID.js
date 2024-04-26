import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavBar from './AdminNavBar';
import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import BackendURLS from '../config';

export default function UpdateEmployee({ employeeId }) {
  const navigate = useNavigate()
  const { id } = useParams();
  
  const [employeeData, setEmployeeData] = useState({
    EmployeeName: '',
    EmployeeDOB: '',
    EmployeeGender: '',
    EmployeeMailID: '',
    EmployeeContact: '',
    EmployeeDepartment: '',
    EmployeeQualification: '',
    EmployeeSalary: '',
    EmployeeLocation: '', 
    EmployeeAge:'',
  });
  const [originalEmployeeData, setOriginalEmployeeData] = useState({});
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/employeebyID/${id}`,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      });
      if (response.status === 200) {
        setEmployeeData(response.data || {});
        setOriginalEmployeeData(response.data || {});
      } else {
        toast.error("Error fetching employee data. Please try again later.");
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
      toast.error("Error fetching employee data. Please try again later.");
    }
  };
  
  useEffect(() => {
    
    // setToken(JSON.parse(sessionStorage.getItem('AdminToken')))

    fetchEmployeeData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'EmployeeDOB') {
      const birthDate = new Date(value);
      const today = new Date();
      const years = today.getFullYear() - birthDate.getFullYear();
      const months = today.getMonth() - birthDate.getMonth();
      const ageDecimal = years + (months / 12); 
      setEmployeeData(prevState => ({
        ...prevState,
        EmployeeAge: ageDecimal.toFixed(1) 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (JSON.stringify(originalEmployeeData) === JSON.stringify(employeeData)) {
      toast.warning("No Updated Changes were found!",{theme:'colored'});
      return;
    }
    try {
      const response = await axios.put(`${BackendURLS.Admin}/updateEmployeebyID/${id}`, employeeData,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      });
      if (response.status === 200) {
        toast.success("Employee updated successfully",{theme:'colored'});
        setTimeout(()=>{
          navigate('/admin/viewemployees')
        },1000)
      } else {
        toast.error("Error updating employee. Please try again later.",{theme:'colored'});
      }
    } catch (error) {
      console.error('Error updating employee:', error.message);
      toast.error(error.response.data);
    }
  };

  return (
    <div>
      <div className="p-4 bg-gray-200 shadow-lg rounded-md" id='wrapper'>
        <h2 className="text-2xl text-center font-bold mb-4">Update Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
          <InputLabel id="name-label">Employee ID</InputLabel>
            <TextField
              
              name="EmployeeName"
              value={employeeData.EmployeeID}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
              disabled
            />
            <InputLabel id="name-label">Employee Name</InputLabel>
            <TextField
              label="Employee Name"
              name="EmployeeName"
              value={employeeData.EmployeeName}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <InputLabel id="dob-label">Date of Birth</InputLabel>
            <TextField
              label=""
              name="EmployeeDOB"
              value={employeeData.EmployeeDOB}
              onChange={handleChange}
              variant="outlined"
              type="date"
              fullWidth
              required
            />
            <InputLabel id="gender-label">Employee Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="EmployeeGender"
              value={employeeData.EmployeeGender}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="">Select Genders</MenuItem>
              <MenuItem value="Male">MALE</MenuItem>
              <MenuItem value="Female">FEMALE</MenuItem>
              <MenuItem value="Others">OTHERS</MenuItem>
            </Select>
            <InputLabel id="age-label">Age</InputLabel>
            <TextField
              name="EmployeeAge"
              value={employeeData.EmployeeAge}
              // onChange={handleChange}
              variant="outlined"
              type="number"
              fullWidth
              disabled
            />
            <InputLabel id="email-label">Employee Email</InputLabel>
            <TextField
              label="Email ID"
              name="EmployeeMailID"
              value={employeeData.EmployeeMailID}
              onChange={handleChange}
              variant="outlined"
              type="email"
              fullWidth
              required
            />
            <InputLabel id="contact-label">Employee Contact</InputLabel>
            <TextField
              label="Contact"
              name="EmployeeContact"
              value={employeeData.EmployeeContact}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              inputProps={{ pattern: "[6789][0-9]{9}", title: "Please enter a valid 10-digit Indian mobile number" }}
              required
            />
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              name="EmployeeDepartment"
              value={employeeData.EmployeeDepartment}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="">Select Department</MenuItem>
              <MenuItem value="CSE(Honors)">CSE(Honors)</MenuItem>
              <MenuItem value="CSE(Regulars)">CSE(Regulars)</MenuItem>
              <MenuItem value="ECE">ECE</MenuItem>
              <MenuItem value="BT">BT</MenuItem>
              <MenuItem value="MECH">MECH</MenuItem>
            </Select>
            <InputLabel id="qualification-label">Qualification</InputLabel>
            <Select
              labelId="qualification-label"
              name="EmployeeQualification"
              value={employeeData.EmployeeQualification}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            >
              <MenuItem value="">Select Qualification</MenuItem>
              <MenuItem value="Ph.D">Ph.D</MenuItem>
              <MenuItem value="M.Tech">M.Tech</MenuItem>
              <MenuItem value="PG">PG</MenuItem>
              <MenuItem value="B.Tech">B.Tech</MenuItem>
            </Select>
            <InputLabel id="salary-label">Employee Salary</InputLabel>
            <TextField
              label="Salary"
              name="EmployeeSalary"
              value={employeeData.EmployeeSalary}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="number"
              required
            />
            <InputLabel id="location-label">Employee Location</InputLabel>
            <TextField
              label="Location"
              name="EmployeeLocation"
              value={employeeData.EmployeeLocation}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              type="text"
              required
            />
            <div align="center" >
              <Button type="submit" variant="contained" color="primary">Update Employee</Button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}
