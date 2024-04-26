const mongoose = require('mongoose');
const moment = require('moment-timezone');

const LeaveSchema = new mongoose.Schema({
    EmployeeID:{
        type:String,
        required:true
    },
    EmployeeName:{
        type:String,
        required:true
    },
    LeaveID:{
        type:String,
        required:true,
        default:generateID ,
        unique: true,
    },
    LeaveType:{
        type:String,
        required:true,
        enum:["Sick Leave","Casual Leave","Maternity Leave","Medical Leave","Compensated Casual Leave","Half-Paid Leave"]
    },
    LeaveStart:{
        type:String,
        required:true,
    },
    LeaveEnd:{
        type:String,
        required:true,
    },
    LeaveMessage:{
        type:String,
        required:true
    },
    LeaveStatus:{
        type:String,
        required:true,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    },
    MedicalLetter:{
        type:String,
        default:"Not Available"
    },
    LeaveAppliedOn:{
        type: String,
        default: () => moment().tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss A')
    }
})

function generateID() {
    const id = Math.floor(Math.random() * (900000 - 500000 + 1)) + 500000;
    return id.toString(); 
}
LeaveSchema.pre('save', function(next) {
    if (!this.LeaveID) {
        this.LeaveID = generateID();
    }
    next();
});



const LeaveApplicationModel = mongoose.model('Leave',LeaveSchema)
module.exports = LeaveApplicationModel