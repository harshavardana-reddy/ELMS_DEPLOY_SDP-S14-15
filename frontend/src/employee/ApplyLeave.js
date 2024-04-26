import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import BackendURLS from "../config";
import {
  Input,
  Button,
  Select,
  Spacer,
  Textarea,
  SelectItem,
} from '@nextui-org/react'; // Import NextUI components
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter} from "@nextui-org/react";
export default function ApplyLeave() {
  const [empid, setEmpid] = useState("");
  const [fileBox,setFileBox] = useState(false)
  const [formData, setFormData] = useState({
    EmployeeID: "",
    LeaveType: "",
    LeaveStart: "",
    LeaveEnd: "",
    LeaveMessage: "",
    file: null
  });
  const fileInputRef = useRef(null);
  const leaveTypeRef = useRef(null);
  useEffect(() => {
    const empdata = JSON.parse(sessionStorage.getItem("employee"));
    setEmpid(empdata.EmployeeID);
    setFormData({ ...formData, EmployeeID: empdata.EmployeeID });
    //eslint-disable-next-line
  }, [empid]);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      const fm = new FormData();
      fm.append("EmployeeID", formData.EmployeeID);
      fm.append("LeaveType", formData.LeaveType);
      fm.append("LeaveStart", formData.LeaveStart);
      fm.append("LeaveEnd", formData.LeaveEnd);
      fm.append("LeaveMessage", formData.LeaveMessage);
      fm.append('file', formData.file);
      console.log(formData)
      const response = await axios.post(
        `${BackendURLS.Employee}/applyleave/${empid}`,
        fm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization":sessionStorage.getItem('EmployeeToken')
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Leave Applied Successfully!",{theme:'colored'});
        // leaveTypeRef.current.value = ""; 
        setFormData({
          EmployeeID: "",
          LeaveType: "",
          LeaveStart: "",
          LeaveEnd: "",
          LeaveMessage: "",
          file: null
        })
        // fileInputRef.current.value = ''
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };
  const [fileName, setFileName] = useState("");
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, file: selectedFile });
      setFileName(selectedFile.name);
    }
  };
  const renderFileUpload = () => {
    // Check if formData.LeaveType is one of the required types
    if (formData.LeaveType === 'Medical Leave' || formData.LeaveType === 'Maternity Leave') {
      return (
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Upload Medical Letter
          </label>
          
          <Button variant="shadow" color="secondary" onClick={()=>setFileBox(true)} >Upload File</Button>
          {fileName && <span className="ml-2">{fileName}</span>}
        </div>
      );
    }
    // Return null if the condition is not met
    return null;
  };

  return (
    <div>
      <div>
      <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-md mt-5">
        <h2 className="text-2xl font-bold mb-6">Leave Application Form</h2>
        <form onSubmit={handleLeaveSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Select Leave Type
            </label>
            <Select
              ref={leaveTypeRef}
              className="w-full"
              value={formData.LeaveType}
              onChange={(e) =>{
                // console.log(e.target.value)
                setFormData({ ...formData, LeaveType: e.target.value })}
              }
              aria-label="Select Leave Type"
              required
            >
              <SelectItem key="" value={""}>
                Select Leave Type
              </SelectItem>
              <SelectItem key="Sick Leave" value={"Sick Leave"}>
                Sick Leave
              </SelectItem>
              <SelectItem key="Casual Leave" value={"Casual Leave"}>
                Casual Leave
              </SelectItem>
              <SelectItem key="Maternity Leave" value={"Maternity Leave"}>
                Maternity Leave
              </SelectItem>
              <SelectItem key="Medical Leave" value={"Medical Leave"}>
                Medical Leave
              </SelectItem>
              <SelectItem
                key="Compensated Casual Leave"
                value={"Compensated Casual Leave"}
              >
                Compensated Casual Leave
              </SelectItem>
              <SelectItem key="Half-Paid Leave" value={"Half-Paid Leave"}>
                Half-Paid Leave
              </SelectItem>
            </Select>
          </div>
          {renderFileUpload()}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Leave Dates
            </label>
            <div className="flex items-center">
              <Input
                type="date"
                variant="outlined"
                className="w-full"
                value={formData.LeaveStart}
                onChange={(e) => {
                  // const date = new Date(e.target.value);
                  // const formattedDate = `${(date.getDate()).toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                  // console.log(e.target.value)
                  setFormData({ ...formData, LeaveStart: e.target.value });
                }}
                required
              />
              <span className="mx-2 my-auto">to</span>
              <Input
                type="date"
                variant="outlined"
                className="w-full ml-2"
                value={formData.LeaveEnd}
                onChange={(e) => {
                  // const date = new Date(e.target.value);
                  // const formattedDate = `${(date.getDate()).toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
                  // console.log(e.target.value)
                  setFormData({ ...formData, LeaveEnd: e.target.value });
                }}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Leave Message
            </label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows={4}
              value={formData.LeaveMessage}
              onChange={(e) =>
                setFormData({ ...formData, LeaveMessage: e.target.value })
              }
              required
            />
          </div>
          <div align="center">
            <Button
              variant="shadow"
              color="primary"
              type="submit"
              radius = "full"
              // className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Apply Leave
            </Button>
          </div>
        </form>
      </div>
      <ToastContainer />
      <Modal backdrop={"blur"} isOpen={fileBox} onClose={()=>setFileBox(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">UploadFile</ModalHeader>
              <ModalBody>
                <input type="file" onChange={handleFileChange} ref={fileInputRef} accept=".jpg,.jpeg,.pdf" required ></input>
                {fileName && <span className="ml-2">{fileName}</span>}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={()=>setFileBox(false)}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
    </div>
  );
}
