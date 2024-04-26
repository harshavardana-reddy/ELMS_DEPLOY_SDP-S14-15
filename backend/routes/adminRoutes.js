const express = require('express')
const adminController = require('../controllers/adminController')
const adminrouter = express.Router()

const { verifytoken, authorize } = require('../utils/Auth');

adminrouter.post('/checkadminlogin', adminController.checkAdminLogin)
adminrouter.post('/addEmployee', [verifytoken, authorize("admin"), adminController.addEmployee])
adminrouter.get('/viewEmployees', [verifytoken, authorize("admin"), adminController.viewEmployees])
adminrouter.delete('/deleteEmployee/:id', [verifytoken, authorize("admin"), adminController.deleteEmployeeByID])
adminrouter.get('/leavesapplied', [verifytoken, authorize("admin"), adminController.viewAppliedLeaves])
adminrouter.get('/viewLeavesbyeid/:id',[verifytoken, authorize("admin"),adminController.viewleaveHistoryByEID])
adminrouter.put('/approve/:id', [verifytoken, authorize("admin"), adminController.approveLeave])
adminrouter.put('/reject/:id', [verifytoken, authorize("admin"), adminController.rejectLeave])
adminrouter.delete('/deleteleaveByid/:id', [verifytoken, authorize("admin"), adminController.deleteLeaveByID])
adminrouter.get('/leaveAnalysis', [verifytoken, authorize("admin"), adminController.leaveAnalysis])
adminrouter.post('/UploadEmployees', [verifytoken, authorize("admin"), adminController.UploadEmployees])
adminrouter.put('/changeStatus/:ID', [verifytoken, authorize("admin"), adminController.setStatus])
adminrouter.get('/employeebyID/:ID', [verifytoken, authorize("admin"), adminController.fetchEmployeebyID])
adminrouter.put('/updateEmployeebyID/:ID', [verifytoken, authorize("admin"), adminController.UpdateEmployeebyID])
adminrouter.get('/viewLeaveByLID/:ID', [verifytoken, authorize("admin"), adminController.viewLeaveByLID])
adminrouter.get('/viewProfile/:ID',[verifytoken, authorize("admin"),adminController.ViewProfile])
adminrouter.get('/viewLetterByLID/:ID', [verifytoken, authorize("admin"),adminController.viewLetterByLID])
adminrouter.post('/changePassword/:uname', [verifytoken, authorize("admin"), adminController.ChangePassword])

module.exports = adminrouter
