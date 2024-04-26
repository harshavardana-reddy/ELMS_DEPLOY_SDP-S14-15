const EmployeeModel = require("../models/Employees");
const LeaveApplicationModel = require('../models/LeaveApplications')
const sendLeaveMail = require("../utils/SendLeaveMail");
const SendPasswordMail = require('../utils/SendPasswordMail')
const sendotp = require("../utils/Sendotp");
const genotp = require("../utils/otp");
const empotp = require("../models/Empotp");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const moment = require("moment");
const { generateToken } = require('../utils/Auth')

const ProfileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./media/profiles");
  },
  filename: function (req, file, cb) {
    const filename = req.params.ID + "_Profile" +file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, filename);
  },
});

const LettersStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./media/letters"); // Destination folder
  },
  filename: function (req, file, cb) {
    const filename = req.params.ID + "_" + moment().tz('Asia/Kolkata').format('DDMMYYYYHHmmssA') + "_Letter" +file.originalname.substring(file.originalname.lastIndexOf('.'));
    cb(null, filename); // File naming convention
  },
});

const checkemployeelogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const employee = await EmployeeModel.findOne({ EmployeeID: username,EmployeeStatus:"Active" });

    if (!employee) {
      return res.status(404).json({ message: "Employee is Inactive Or Not Found" });
    }

    if (password !== employee.EmployeePassword && employee.EmployeePassword!=="Active") {
      return res.status(401).json({ message: "Invalid Password! Try Again" });
    }
    return res.status(200).json({ message: "Login successful" });
    // return res.status(200).json({ message: 'Login successful', employee });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const empProfile = async (req, res) => {
  try {
    const empid = req.params.id;
    const emp = await EmployeeModel.findOne({ EmployeeID: empid });
    return res.status(200).json(emp);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadLetter = multer({ storage: LettersStorage}).single("file");

const applyLeave = async (req, res) => {
  try {
    uploadLetter(req, res, async (err) => {
      if (err) {
        return res.status(400).send("Error Uploading Letter!" + err.message);
      }
      const path = req.file ? req.file.path : "Not Available";
      const { EmployeeID, LeaveType, LeaveStart, LeaveEnd, LeaveMessage } = req.body;
      const employee = await EmployeeModel.findOne({ EmployeeID: EmployeeID });
      console.log(employee);
      if (!employee) {
        res.status(404).send("No employee found!");
        return;
      }
      // Parse and reformat LeaveStart and LeaveEnd
      const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}-${month}-${year}`;
      };
      
      const formattedLeaveStart = formatDate(LeaveStart);
      const formattedLeaveEnd = formatDate(LeaveEnd);

      const leave = new LeaveApplicationModel({
        EmployeeID,
        EmployeeName: employee.EmployeeName,
        LeaveType,
        LeaveStart: formattedLeaveStart,
        LeaveEnd: formattedLeaveEnd,
        LeaveMessage,
        MedicalLetter: path,
      });
      // console.log(leave);
      await leave.save();
      const emp = await EmployeeModel.findOne({ EmployeeID: leave.EmployeeID });
      const semail = process.env.EMAIL_USER;
      await sendLeaveMail(leave.EmployeeID, emp.EmployeeName, leave.LeaveID, leave.LeaveType, emp.EmployeeMailID, semail);
      res.status(200).send("Leave Applied Successfully!");
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
};

const sendotpmail = async (req, res) => {
  try {
    const employeeID = req.params.ID; // Get employeeID from URL
    const employee = await EmployeeModel.findOne({ EmployeeID: employeeID });
    // console.log(employee);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const email = employee.EmployeeMailID;
    const aotp = genotp();
    const temp = await empotp.findOne({ email: email });
    // console.log(temp)
    if (temp){
      await empotp.deleteOne({ email: email });
    }

    const newEmpotp = await empotp.create({
      email: email,
      otp: aotp,
      createdAt: Date.now(),
    });
    // console.log("OTP document created:", newEmpotp);


    const sent_to = email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = email;
    await sendotp(aotp, sent_to, sent_from, reply_to);

    res
      .status(200)
      .json({ success: true, message: "OTP Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const verifyotp = async (req, res) => {
  try {
    const { otp } = req.body; // Extract OTP from the request body
    const uname = req.params.ID;
    const employeeID = uname;
    // console.log(employeeID); // Get employeeID from URL
    const employee = await EmployeeModel.findOne({ EmployeeID: employeeID },{_id:0,EmployeePassword:0,EmployeeProfile:0,__v:0});

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const email = employee.EmployeeMailID;
    // console.log("Employee Email:", email);

    const user = await empotp.findOne({ email: email });
    // console.log("User Data:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedOtp = user.otp;
    // console.log("Stored OTP: ", storedOtp);
    // console.log("Given OTP: ", otp);

    if (otp === storedOtp) {
      // OTP is correct
      await empotp.deleteOne({ email: email });
      const token = generateToken({ employeeID, role: "employee" });
      return res.status(200).json({employee,token});
    } else {
      // Incorrect OTP
      return res.status(400).json({ message: "Incorrect OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const viewleaveHistory = async (req, res) => {
  try {
    const empid = req.params.id;
    const leaveData = await LeaveApplicationModel.find({ EmployeeID: empid }).sort({LeaveAppliedOn:-1});
    res.status(200).json(leaveData);
  } catch (e) {
    res.status(500).send(e.message);
    console.log(e.message);
  }
};

const viewLeaveByLID = async(req,res)=>{
  try{
    const empid = req.params.ID;
    const lid = req.params.LID
    const leave = await LeaveApplicationModel.findOne({LeaveID:lid,EmployeeID:empid})
    // console.log(leave)
    if(!leave){
      return res.send(200).status("No leave record is found!")
    }
    res.status(200).send(leave)
  }
  catch(e){
    res.status(500).send(e.message);
    console.log(e.message);
  }
}

const uploadProfile = multer({ storage: ProfileStorage }).single("file");

const uploadEmpProfile = async (req, res) => {
  try {
    const empid = req.params.ID;
    const emp = await EmployeeModel.findOne({ EmployeeID: empid });
    if (!emp) {
      res.status(404).send("No Employee ID found");
    } else {
      uploadProfile(req, res, async function (err) {
        if (err) {
          console.error(err); 
          return res.status(500).send(err.message);
        }
        emp.EmployeeProfile = req.file.path;
        await emp.save();
        res.status(200).send("Profile Uploaded/Updated Succesfully!");
      });
    }
  } catch (e) {
    console.log(e.messsge);
    res.status(500).send("Internal Server Error");
  }
};

const ViewProfile = async (req, res) => {
  try {
    const ID = req.params.ID;
    const emp = await EmployeeModel.findOne({ EmployeeID: ID });
    if (!emp) {
      return res.status(404).send("No Employee Found!");
    } else {
      const location = emp.EmployeeProfile;
      const filepath = path.join(__dirname,'../',location);
      const filename = path.basename(location);
      // console.log("Filepath:", filepath);
      // console.log("Filename:", filename)
      if (!fs.existsSync(filepath)) {
        return res.status(404).send("File not found!");
      }

      fs.readFile(filepath, (err, data)=>{
        
        const ext = path.extname(filename).toLowerCase();
        // console.log(ext)
        if (err) 
        {
          return res.status(500).send('Error reading image file');
        }
        
        let contentType = "application/octet-stream";

        if (ext === ".png") {
          contentType = "image/png";
        } else if (ext === ".jpg" || ext === ".jpeg") {
          contentType = "image/jpeg";
        }
        res.setHeader("Content-Type", contentType);
        res.send(data);
      })
    }
  } catch (e) {
    console.log(e.message);
  }
};

const ChangePassword = async (req, res) => {
  const { newpwd, oldpwd } = req.body;
  const empid = req.params.ID;
  try {
    const employee = await EmployeeModel.findOne({ EmployeeID: empid, EmployeePassword: oldpwd });
    if (!employee) {
      return res.status(400).send("Incorrect Old Password");
    } else {
      if (newpwd === oldpwd) {
        return res.status(400).send("Both passwords are the same");
      } else {
        
        await EmployeeModel.updateOne({ EmployeeID: empid }, { $set: { EmployeePassword: newpwd } });
        await SendPasswordMail(employee.EmployeeID,employee.EmployeeName,employee.EmployeeMailID)
        res.status(200).json("Password updated successfully!");
      }
    }
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Internal Server Error");
  }
};
const viewLetterByLID = async(req,res)=>{
  try {
      const LID = req.params.ID;
      const leave = await LeaveApplicationModel.findOne({ LeaveID: LID });
      if (!leave) {
      return res.status(404).send("No Leave record Found!");
      } else {
      const location = leave.MedicalLetter
      if(location === "Not Availble"){
          res.status(200).send("No Letters are Applicable for this leave!");
          return
      }
      const filepath = path.join(__dirname,'../',location);
      const filename = path.basename(location);
      // console.log("Filepath:", filepath);
      // console.log("Filename:", filename)
      if (!fs.existsSync(filepath)) {
          return res.status(404).send("File not found!");
      }

      fs.readFile(filepath, (err, data)=>{
          
          const ext = path.extname(filename).toLowerCase();
        // console.log(ext)
      if (err) 
          {
          return res.status(500).send('Error reading image file');
          }
      
          let contentType = "application/octet-stream";
          if (ext === ".pdf") {
          contentType = "application/pdf";
          }
          else if(ext==".jpg"||ext==".jpeg"){
            contentType = "image/jpeg";
          }
          res.setHeader("Content-Type", contentType);
          res.send(data);
      })
  }
  } catch (e) {
      console.log(e.message);
  }
}

const leaveAnalysis = async(req,res)=>{
  try{
      const eid = req.params.id;
      const LeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid})
      const CasualLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Casual Leave"})
      const SickLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Sick Leave"})
      const MaternityLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Maternity Leave"})
      const MedicalLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Medical Leave"})
      const CompensatedCasualLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Compensated Casual Leave"})
      const HalfPaidLeaveLeaveCount = await LeaveApplicationModel.countDocuments({EmployeeID: eid,LeaveType:"Half-Paid Leave"})
      const LeaveCountDayByDay = await LeaveApplicationModel.aggregate([
        {
          $match: { EmployeeID: eid }
        }
        ,{
            $addFields: {
                ampmIndex: { $indexOfCP: ["$LeaveAppliedOn", " AM"] },
                pmIndex: { $indexOfCP: ["$LeaveAppliedOn", " PM"] }
            }
        },
        {
            $addFields: {
                dateString: {
                    $cond: {
                        if: { $ne: ["$ampmIndex", -1] },
                        then: { $substrCP: ["$LeaveAppliedOn", 0, "$ampmIndex"] },
                        else: {
                            $cond: {
                                if: { $ne: ["$pmIndex", -1] },
                                then: { $substrCP: ["$LeaveAppliedOn", 0, "$pmIndex"] },
                                else: "$LeaveAppliedOn"
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                parsedDate: {
                    $dateFromString: {
                        dateString: "$dateString",
                        format: "%d-%m-%Y %H:%M:%S"
                    }
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$parsedDate" } },
                count: { $sum: 1 }
            }
        }
    ]);
      res.status(200).json({LeaveCount,CasualLeaveCount,MaternityLeaveCount,MedicalLeaveCount,HalfPaidLeaveLeaveCount,CompensatedCasualLeaveCount,SickLeaveCount,LeaveCountDayByDay})

  }
  catch(e){
      res.status(500).send(e.message)
  }
}


module.exports = {
  checkemployeelogin,
  empProfile,   
  applyLeave,
  sendotpmail,
  verifyotp,
  viewleaveHistory,
  uploadEmpProfile,
  ViewProfile,
  ChangePassword,
  viewLetterByLID,
  viewLeaveByLID,
  leaveAnalysis
};
