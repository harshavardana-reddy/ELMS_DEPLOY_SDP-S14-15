import React, { useState, useEffect, Profiler } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import BackendURLS from './../config';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Progress } from "@nextui-org/react";
import PendingImage from './images/pending.png';
import ApprovedImage from './images/approved.png'
import RejectedImage from './images/rejected.png'
import {Spinner} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
import { Link } from '@nextui-org/react';

export default function ReviewLeaves() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [RBox,setRBox] = useState(false)
  const [ABox,setABox] = useState(false)
  const [profile,setProfile] = useState('')
  const [profileLoading, setProfileLoading] = useState(true);
  const [token,setToken] = useState('')
  const [url,setUrl] = useState('')
  const navigate = useNavigate()
  const { ID } = useParams();

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/viewLeaveByLID/${ID}`,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      });
      setLeaveRequests(response.data);
      
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests');
    }
  };
  const getProfile = async (ID) => {

    try {
        const response = await axios.get(`${BackendURLS.Admin}/viewProfile/${ID}`, {
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
};
const fetchLetter = async () => {
  await axios.get(`${BackendURLS.Admin}/viewLetterByLID/${ID}`, {
          responseType: 'blob',
          headers:{
            Authorization:sessionStorage.getItem('AdminToken')
          }
      })
      .then(response => {
          const contentType = response.headers['content-type'];
          let url;

          if (contentType.includes('pdf')) {
              url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          } else if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
              url = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg' }));
          } else {
              console.error('Unsupported content type:', contentType);
              return;
          }
          setUrl(url);
          
      })
      .catch(err => {
          console.error('Error fetching letter:', err);
      });
}

  useEffect(() => {
    fetchLeaveRequests();
    
  }, [ID]);
  useEffect(() => {
    fetchLetter();
  }, []);
  useEffect(() => {
    if (leaveRequests.EmployeeID) {
      getProfile(leaveRequests.EmployeeID).then(profileUrl => {
          setProfile(profileUrl);
          setProfileLoading(false); // Set loading state to false when profile image is loaded
      });
  }
  })
  
  const handleApprove = async (leaveID) => {
    console.log(sessionStorage.getItem('AdminToken'))
    try {
      await axios.put(`${BackendURLS.Admin}/approve/${leaveID}`, null, {
        headers: {
          Authorization: sessionStorage.getItem('AdminToken')
        }
      });
      toast.success('Leave approved successfully',{theme:'colored'});
      setABox(false)
      fetchLeaveRequests();
    } catch (error) { 
      console.error('Error approving leave:', error);
      toast.error(error.response.data,{theme:'colored'});
    }
  };

  const handleReject = async (leaveID) => {
    try {
      await axios.put(`${BackendURLS.Admin}/reject/${leaveID}`,null,{
        headers:{
          Authorization: sessionStorage.getItem('AdminToken')
        }
      });
      toast.success('Leave rejected successfully',{theme:'colored'});
      setRBox(false)
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error(error.response.data,{theme:'colored'});
    }
  };

  const renderMedicalLetterLink = () => {
    if (leaveRequests.MedicalLetter === "Not Available") {
      return <p className="text-gray-700 mb-2">Medical Letter: Not Applicable</p>;
    } else {
      return (
        <p className="text-gray-700 mb-2">
        Medical Letter: 
        {/* <button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-block ml-2" 
            onClick={() => { window.open(url, '_blank'); }}
        >
            View Letter
        </button> */}
        <Link href={url} isBlock showAnchorIcon color="warning" target='__blank'>View Letter</Link>
        <Link href={url} title="Download Letter" isBlock  color="success" download={`${leaveRequests.LeaveID}`}>Download Letter &#10515;</Link>
      </p>
      );
    }
  };

  const renderStatus = ()=>{
    if (leaveRequests.LeaveStatus === "Pending"){
      return <img id="img" src={PendingImage} className="w-30 h-24"/>
    }
    else if(leaveRequests.LeaveStatus === "Approved"){
      return <img id="img" src={ApprovedImage} className="w-30 h-24"/>
    }
    else{
      return <img id="img" src={RejectedImage} className="w-30 h-24"/>
    }
  }

  const renderStatus1 = ()=>{
    if(leaveRequests.LeaveStatus === "Approved"){
      return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#9989;</p>
    }
    else if(leaveRequests.LeaveStatus === "Rejected"){
      return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus} &#10060;</p>
    }
    else{
      return <p className="text-gray-700 mb-2">Leave-Status: {leaveRequests.LeaveStatus}</p>
    }
  }

  const renderButtons = ()=>{
    if(leaveRequests.LeaveStatus === "Pending"){
      return(
        <div align="center" >
          <Button radius='full' color='success' variant='shadow' onClick={()=>setABox(true)} >Approve</Button>
            &nbsp;&nbsp;
          <Button radius='full' color='danger' variant='shadow' onClick={()=>setRBox(true)} >Reject</Button>
            &nbsp;&nbsp;
          <Button radius='full' color='secondary' variant='shadow' onClick={()=>navigate(`/admin/viewleaves`)} >Go Back</Button>
        </div>
      )
    }
    else if(leaveRequests.LeaveStatus === 'Approved'){
      return(
        <div align="center" >
          <Button radius='full' color='success' variant='shadow' isDisabled>Already Approved</Button>
            &nbsp;&nbsp;
          <Button radius='full' color='secondary' variant='shadow' onClick={()=>navigate(`/admin/viewleaves`)} >Go Back</Button>
        </div>
      )
    }
    else{
      return(
        <div align="center" >
          <Button radius='full' color='danger' variant='shadow' isDisabled>Already Rejected</Button>
            &nbsp;&nbsp;
          <Button radius='full' color='secondary' variant='shadow' onClick={()=>navigate(`/admin/viewleaves`)} >Go Back</Button>
        </div>
      )
    }
  }

  const calculateLeaveDuration = () => {
    if (!leaveRequests.LeaveStart || !leaveRequests.LeaveEnd) {
      return { days: 0, months: 0 }; // Or any default values you prefer
    }
  
    const startParts = leaveRequests.LeaveStart.split('-').map(Number);
    const endParts = leaveRequests.LeaveEnd.split('-').map(Number);
  
    const start = new Date(startParts[2], startParts[1] - 1, startParts[0]); // Month is 0-indexed
    const end = new Date(endParts[2], endParts[1] - 1, endParts[0]); // Month is 0-indexed
  
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const diffInMonths = end.getMonth() - start.getMonth() + (12 * (end.getFullYear() - start.getFullYear()));
  
    return { days: diffInDays, months: diffInMonths };
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold text-center mb-5">Review Leave Request</h1>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md mx-5"
      >
        {leaveRequests ? (
          <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-container">
                <div className="card">
                  <div className="flex items-center">
                  {profileLoading ? (
                    <Spinner/>
                      ) : (
                      <img src={profile} className="w-24 h-24 rounded-full mr-4" />
                  )}
                  &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
                  {renderStatus()}
                  </div>
                <br/>
                  <div className="card-info">
                    <p className="text-gray-700 mb-2">Leave ID: {leaveRequests.LeaveID}</p>
                    <p className="text-gray-700 mb-2">Employee ID: {leaveRequests.EmployeeID}</p>
                    <p className="text-gray-700 mb-2">Employee Name: {leaveRequests.EmployeeName}</p>
                    <p className="text-gray-700 mb-2">Leave Type: {leaveRequests.LeaveType}</p>
                    {renderStatus1()}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="card">
                <div className="card-info">
                  
                  <p className="text-gray-700 mb-2">LeaveStart: {leaveRequests.LeaveStart}</p>
                  <p className="text-gray-700 mb-2">LeaveEnd: {leaveRequests.LeaveEnd}</p>
                  <p className="text-gray-700 mb-2">Leave Duration: {calculateLeaveDuration().days} days / {calculateLeaveDuration().months} months</p>
                  <div className="mb-2">
                    <p className="text-gray-700">LeaveMessage:</p>
                    <textarea value={leaveRequests.LeaveMessage} disabled className="w-full h-24 p-2 border rounded-md bg-gray-100" />
                  </div>
                  {renderMedicalLetterLink()}
                </div>
              </div>
            </div>
          </div>
            {renderButtons()}
          </div>
        ) : (
          <Progress size="sm" label="Loading..." isIndeterminate aria-label="Loading..." className="max-w-md mx-auto block" />
        )}
      </motion.div>
      <ToastContainer />
      <Modal backdrop={"blur"} isOpen={ABox} onClose={()=>setABox(false)}> 
      <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Approval Alert</ModalHeader>
              <ModalBody>
                <p>Are You Sure you want to approve the leave(LID:{leaveRequests.LeaveID}) of the employee (EID : {leaveRequests.EmployeeID}) ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="success" onPress={()=>handleApprove(leaveRequests.LeaveID)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal backdrop={'blur'} isOpen={RBox} onClose={()=>setRBox(false)}>
      <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Rejection Alert</ModalHeader>
              <ModalBody>
                <p>Are You Sure you want to reject the leave(LID:{leaveRequests.LeaveID}) of the employee (EID : {leaveRequests.EmployeeID}) ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={()=>handleReject(leaveRequests.LeaveID)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
