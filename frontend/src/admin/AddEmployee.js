  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { TextField, Button, Select, MenuItem, InputLabel } from '@mui/material';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css'; 
  import BackendURLS from "../config";
  import { Dialog } from 'primereact/dialog';


  export default function AddEmployee() {
    const [box,setBox] = useState(false)
    const [file,setFile] = useState('')
    
    const [token,setToken] = useState('')
    const [employeeData, setEmployeeData] = useState({
      EmployeeName: '',
      EmployeeDOB: '',
      EmployeeGender:'',
      EmployeeAge: '',
      EmployeeMailID: '',
      EmployeeContact: '',
      EmployeeDepartment: '',
      EmployeeQualification: '',
      EmployeeSalary: '',
      EmployeeLocation: '', 
    });
    const handleChange = (e) => {
      const { name, value } = e.target;
      // setEmployeeData({...employeeData, [e.target.id]: e.target.value});
      // Update state based on the input name
      setEmployeeData((prevState) => ({
        ...prevState,
        [name]: name === 'EmployeeName' ? value.toUpperCase() : value,
      }));
    
      if (name === 'EmployeeDOB') {
        const birthDate = new Date(value);
        const today = new Date();
        const years = today.getFullYear() - birthDate.getFullYear();
        const months = today.getMonth() - birthDate.getMonth();
        const ageDecimal = years + months / 12;
        setEmployeeData((prevState) => ({
          ...prevState,
          EmployeeAge: ageDecimal.toFixed(1),
        }));
      } else if (name === 'EmployeeSalary') {
        setEmployeeData((prevState) => ({
          ...prevState,
          [name]: parseFloat(value) 
        }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post(`${BackendURLS.Admin}/addEmployee`, employeeData,{
          headers:{
            Authorization:sessionStorage.getItem('AdminToken')
          }
        });
        //console.log(response.data);
        if (response.status === 200) {
          toast.success("Employee added successfully");
          setEmployeeData({
            EmployeeName: '',
            EmployeeDOB: '',
            EmployeeGender:'',
            EmployeeAge: '',
            EmployeeMailID: '',
            EmployeeContact: '',
            EmployeeDepartment: '',
            EmployeeQualification: '',
            EmployeeSalary: '',
            EmployeeLocation: '', 
          });
        } else {
          toast.error("Error adding employee. Please try again later.");
        }
      } catch (error) {
        console.error('Error adding employee:', error);
        toast.error("Error adding employee. Please try again later.");
      }
    };

  const handleFileSubmit = async()=>{
    if(!file){
      toast.error("No file Selected");
      return
    }

    try {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${BackendURLS.Admin}/UploadEmployees`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization":sessionStorage.getItem('AdminToken')
          },
         
        }
      );
      if (response.status === 200) {
        toast.success("Employee Data Uploaded Successfully!");
        setBox(false);
      }
    } catch (e) {
      console.log(e);
    }
  }


    return (
      <div>
        <div className="p-4 bg-gray-200 shadow-lg rounded-md" id='wrapper'>
          <h2 className="text-2xl text-center font-bold mb-4">Add Employee</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                <MenuItem value="Male">MALE</MenuItem>
                <MenuItem value="Female">FEMALE</MenuItem>
                <MenuItem value="Others">OTHERS</MenuItem>
              </Select>
              <InputLabel id="age-label">Age</InputLabel>
              <TextField
                name="EmployeeAge"
                value={employeeData.EmployeeAge}
                onChange={handleChange}
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
                inputProps={{ pattern: "[6789][0-9]{9}", title: "Please enter a valid 10-digit mobile number" }}
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
              <Button type="submit" variant="contained" color="primary">Add Employee</Button>&nbsp;&nbsp;
              <Button variant="contained" color="primary" onClick={()=>setBox(true)}>Import As CSV/Excel</Button>
              </div>
            </div>
          </form>
        </div>
        <Dialog
        visible={box}
        header="Upload Files"
        onHide={()=>setBox(false)}
        footer = {
          <div align="center" >
            <Button variant="contained" color="primary" onClick={handleFileSubmit} >Upload</Button>
          </div>
        }
        >
          <label>Choose file</label>
          <input type="file" onChange={(e)=>setFile(e.target.files[0])} accept='.csv, .xlsx' />
        </Dialog>
        <ToastContainer/>
      </div>
    );
  }
