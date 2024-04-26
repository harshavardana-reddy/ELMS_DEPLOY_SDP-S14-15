import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackendURLS from "../config";
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@nextui-org/react';

export default function ViewLeave() {
  const [leaves, setLeaves] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  const fetchLeaves = async () => {
    const empid = JSON.parse(sessionStorage.getItem('employee')).EmployeeID
    try {
      const response = await axios.get(`${BackendURLS.Employee}/viewleavehistory/${empid}`,{
        headers:{
          Authorization:sessionStorage.getItem('EmployeeToken')
        }
      });
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
    
  };
  const renderStatusCell=(status)=>{
    if(status === 'Approved'){
      return <td align='center' className='bg-green-300 rounded-lg' >{status} &#9989;</td>
    }
    else if(status === 'Rejected'){
      return <td align='center' className='bg-red-300 rounded-lg' >{status} &#10060;</td>
    }
    else{
      return <td align='center' className='bg-yellow-300 rounded-lg' >{status} </td>
    }
  }
  
  useEffect(() => {
    fetchLeaves();
  }, []);
  

  // Filter leaves based on search query
  const filteredLeaves = leaves.filter(leave =>
    leave.LeaveID.includes(searchQuery) ||
    leave.EmployeeID.includes(searchQuery) ||
    leave.LeaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    leave.LeaveStart.includes(searchQuery) ||
    leave.LeaveEnd.includes(searchQuery) ||
    leave.LeaveStatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);
  

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mt-3">Applied Leaves</h1>
      <div className="m-5" align="center">
          <input
            type="text"
            
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="p-2 mb-4 rounded border-gray-300 focus:outline-none focus:border-indigo-500"
          />
        </div>
      <div className="overflow-x-auto rounded-2xl bg-white mt-4 mx-5">
        
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th align='center'>Your ID</th>
              <th align='center'>Leave ID</th>
              <th align="center">LeaveType</th>
              <th align='center'>Start Date</th>
              <th align='center'>End Date</th>
              <th align='center'>Applied On</th>
              <th align='center'>Status</th>
              <th align='center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaves.length > 0 ? (
              currentLeaves.map(leave => (
                <tr key={leave.LeaveID}>
                  <td align='center'>{leave.EmployeeID}</td>
                  <td align='center'>{leave.LeaveID}</td>
                  <td align='center'>{leave.LeaveType}</td>
                  <td align='center'>{leave.LeaveStart}</td>
                  <td align='center'>{leave.LeaveEnd}</td>
                  <td align='center'>{leave.LeaveAppliedOn}</td>
                  {renderStatusCell(leave.LeaveStatus)}
                  <td align='center'>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/employee/viewLeave/${leave.LeaveID}`)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} align="center">No leave records found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='mt-3' align="center">
      <Pagination
          loop
          showControls
          color="success"
          total={Math.ceil(filteredLeaves.length / itemsPerPage)}
          initialPage={currentPage}
          onChange={paginate}
        />
        </div>
    </div>
  );
}
