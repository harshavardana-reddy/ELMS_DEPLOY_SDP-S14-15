const AdminModel = require('../models/Admin');
const EmployeeModel = require('../models/Employees');
const LeaveApplicationModel = require('../models/LeaveApplications')
const sendMail = require('../utils/SendConfirmMail');
const sendApproveMail = require('../utils/SendApproveMail')
const sendRejectMail = require('../utils/SendRejectMail');
const multer = require('multer');
const csv = require('csvtojson')
const path = require('path')
const XLSX = require('xlsx');
const fs = require('fs');
const { generateToken } = require('../utils/Auth') 


const checkAdminLogin = async (req, res) => {
    try {
        const input = req.body; 
        const a = await AdminModel.findOne(input);
        // console.log(input)
        if (a != null) {
            const admin = await AdminModel.findOne({ username: input.username }, { _id:0, password:0});
            // console.log(a)
            const username = admin.username
            const token = generateToken({ username, role: "admin" });
            res.status(200).json({admin,token});
        } else {
            res.status(404).send("Invalid username or password");
        }
    } catch (e) {
        console.log(e); 
        res.status(500).send("Internal Server Error"); 
    }
}

const addEmployee = async(req,res)=>{ 
    try{
        const input = req.body;
        const emp = new EmployeeModel(input)

        await emp.save()
        // console.log(emp)
        res.status(200).send("Successfully added")
        sent_from = process.env.EMAIL_USER 
        await sendMail(emp.EmployeeID,emp.EmployeeMailID,sent_from)
    }
    catch(e){
        console.log(e); 
        res.status(500).send("Internal Server Error"); 
    }
}

const viewEmployees = async (req, res) => {
    try {
        const response = await EmployeeModel.find({},{_id:0,EmployeePassword:0,EmployeeProfile:0,__v:0}).sort({EmployeeID:1});
        res.status(200).json(response);
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    } 
}

const deleteEmployeeByID = async(req,res)=>{
    try{
        const empid = req.params.id
        await EmployeeModel.findOneAndDelete({ EmployeeID: empid })
        await LeaveApplicationModel.deleteMany({ EmployeeID: empid})
        res.status(200).send("Deleted Succesfully")
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }
}

const setStatus = async (req, res) => {
    try {
        const empid = req.params.ID;
        const employee = await EmployeeModel.findOne({ EmployeeID: empid });
        if (employee) {
            const newStatus = employee.EmployeeStatus === "Active" ? "Inactive" : "Active";
            await EmployeeModel.findOneAndUpdate({ EmployeeID: empid }, { $set: { EmployeeStatus: newStatus } });
            res.status(200).send(`Status set to ${newStatus}`);
        } else {
            res.status(404).send("Employee not found.");
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }
}

const viewAppliedLeaves = async(req,res)=>{
    try{
        const leaves = await LeaveApplicationModel.find().sort({LeaveAppliedOn:-1})
        await res.json(leaves)
    }
    catch(e){
        console.log(e.message)
    }
}

const viewleaveHistoryByEID = async (req, res) => {
    try {
        const empid = req.params.id;
        const leaveData = await LeaveApplicationModel.find({ EmployeeID: empid }).sort({LeaveAppliedOn:-1});
        res.status(200).json(leaveData);
    } catch (e) {
        res.status(500).send(e.message);
        console.log(e.message);
    }
};

const approveLeave = async (req, res) => {
    const lid = req.params.id;
    try {
        const leave = await LeaveApplicationModel.findOne({ LeaveID: lid });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        await LeaveApplicationModel.updateOne({ LeaveID: lid }, { $set: { LeaveStatus: "Approved" } });
        // console.log(leave);
        const emp = await EmployeeModel.findOne({EmployeeID: leave.EmployeeID})
        semail = process.env.EMAIL_USER
        await sendApproveMail(leave.EmployeeID,emp.EmployeeName,leave.LeaveID,leave.LeaveType,emp.EmployeeMailID,semail)
        return res.status(200).json({ message: 'Leave approved successfully' });
    } catch (error) {
        console.error('Error approving leave:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const rejectLeave = async(req,res)=>{
    const lid = req.params.id;
    try {
        const leave = await LeaveApplicationModel.findOne({ LeaveID: lid });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        await LeaveApplicationModel.updateOne({ LeaveID: lid }, { $set: { LeaveStatus: "Rejected" } });
        console.log(leave);
        const emp = await EmployeeModel.findOne({EmployeeID: leave.EmployeeID})
        semail = process.env.EMAIL_USER
        await sendRejectMail(leave.EmployeeID,emp.EmployeeName,leave.LeaveID,leave.LeaveType,emp.EmployeeMailID,semail)
        return res.status(200).json({ message: 'Leave approved successfully' });
    } catch (error) {
        console.error('Error approving leave:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}
const deleteLeaveByID = async(req,res)=>{
    try{
        const empid = req.params.id
        await LeaveApplicationModel.findOneAndDelete({ LeaveID: empid })
        res.status(200).send("Deleted Succesfully")
    }
    catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server Error.");
    }

}

const leaveAnalysis = async(req,res)=>{
    try{
        const EmployeeCount = await EmployeeModel.countDocuments();
        const LeaveCount = await LeaveApplicationModel.countDocuments();
        const LeavePendingCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Pending'});
        const LeaveApprovedCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Approved'});
        const LeaveRejectedCount = await LeaveApplicationModel.countDocuments({LeaveStatus: 'Rejected'});
        const CasualLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Casual Leave"})
        const SickLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Sick Leave"})
        const MaternityLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Maternity Leave"})
        const MedicalLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Medical Leave"})
        const CompensatedCasualLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Compensated Casual Leave"})
        const HalfPaidLeaveLeaveCount = await LeaveApplicationModel.countDocuments({LeaveType:"Half-Paid Leave"})
        const LeaveCountDayByDay = await LeaveApplicationModel.aggregate([
            {
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

        res.status(200).json({EmployeeCount,LeaveCount,LeavePendingCount,LeaveApprovedCount,LeaveRejectedCount,CasualLeaveCount,MaternityLeaveCount,MedicalLeaveCount,HalfPaidLeaveLeaveCount,CompensatedCasualLeaveCount,SickLeaveCount,LeaveCountDayByDay})

    }
    catch(e){
        res.status(500).send(e.message)
    }
}

const CSVStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./media/CSV_EXCEL"); // Destination folder
    },
    filename: function (req, file, cb) {
        const filename = Date.now()+file.originalname.substring(file.originalname.lastIndexOf('.'));
        cb(null, filename); // File naming convention
    },
});

const uploadCSV = multer({storage:CSVStorage}).single('file')

const UploadEmployees = async(req,res)=>{
    try{
        uploadCSV(req,res,async function(err){
            if (err) {
                console.error(err);
                return res.status(500).send(err.message);
            }
            const filepath = req.file ? req.file.path : null;
            console.log(filepath);
            if (!filepath) {
                return res.status(400).send("No file uploaded.");
            }
            const filename = path.basename(filepath)
            const ext = path.extname(filename)
            
            if(ext === '.xlsx'){
                const workbook = XLSX.readFile(filepath); 
                const sheetName = workbook.SheetNames[0]; 
                const worksheet = workbook.Sheets[sheetName];
                const employees = XLSX.utils.sheet_to_json(worksheet);
                for (const emp of employees) {
                    const insertedemployee = new EmployeeModel(emp)
                    insertedemployee.save()
                    sent_from = process.env.EMAIL_USER 
                    await sendMail(insertedemployee.EmployeeID,insertedemployee.EmployeeMailID,sent_from)
                }
                res.status(200).send("Employee Excel Data Uploaded")
            }
            else if(ext === '.csv'){
                const employees = await csv().fromFile(filepath)
                // // console.log(employees)
                for (const emp of employees) {
                    const insertedemployee = new EmployeeModel(emp)
                    insertedemployee.save()
                    sent_from = process.env.EMAIL_USER 
                    await sendMail(insertedemployee.EmployeeID,insertedemployee.EmployeeMailID,sent_from)
                }
                res.status(200).send("Employee CSV Data Uploaded")
            } 
        })   
    }
    catch(e){
        console.log(e.message)
        res.status(500).send("Internal Server Error")
    }
}
const fetchEmployeebyID = async(req,res)=>{
    try{
        const empid = req.params.ID
        const employee = await EmployeeModel.findOne({EmployeeID: empid})
        // console.log(employee)
        res.status(200).json(employee)
    }
    catch(e){
        res.status(500).send("Internal Server Error")
    }

}

const UpdateEmployeebyID = async(req,res)=>{
    try{
        const empid = req.params.ID
        const input = req.body
        const response = await EmployeeModel.updateOne({ EmployeeID: empid }, { $set: input });
        res.status(200).send("Employee Updated successfully!")
    }
    catch(e){
        res.status(500).send("Internal Server Error"+e.message) 
    }
}

const viewLeaveByLID = async(req,res)=>{
    const lid = req.params.ID;
    const leave = await LeaveApplicationModel.findOne({LeaveID:lid},{_id:0,__v:0})
    if(!leave){
        res.status(200).send("No leave record is found!")
        return
    }
    else{
        res.status(200).send(leave)
    }
}

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
        if (!fs.existsSync(filepath)) {
            return res.status(404).send("File not found!");
        }

        fs.readFile(filepath, (err, data)=>{
            
            const ext = path.extname(filename).toLowerCase();
        if (err) 
            {
            return res.status(500).send('Error reading file');
            }
        
            let contentType = "application/octet-stream";
            if (ext === ".pdf") {
                contentType = "application/pdf";
            }
            else if(ext==='.png'){
                contentType = "image/png"
            }else if(ext==".jpg"||ext==".jpeg"){
                contentType = "image/jpeg";
            }
            res.setHeader("Content-Type", contentType);
            res.send(data);
        })
    }
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error"+e.message);
    }
}

const ChangePassword = async(req,res)=>{
    const { newpwd, oldpwd } = req.body;
    const uname = req.params.uname;
    try {
        const admin = await AdminModel.findOne({ username: uname, password: oldpwd });
        if (!admin) {
        return res.status(400).send("Incorrect Old Password");
        } else {
        if (newpwd === oldpwd) {
            return res.status(400).send("Current and New passwords are same!");
        } else {
            await AdminModel.updateOne({ username: uname }, { $set: { password: newpwd } });
            res.status(200).json("Password updated successfully!");
        }
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
}


module.exports = { checkAdminLogin,addEmployee,viewEmployees,deleteEmployeeByID,viewAppliedLeaves,approveLeave,rejectLeave,deleteLeaveByID,leaveAnalysis,UploadEmployees,setStatus, fetchEmployeebyID,UpdateEmployeebyID,viewLeaveByLID,ViewProfile,viewLetterByLID,ChangePassword,viewleaveHistoryByEID };
