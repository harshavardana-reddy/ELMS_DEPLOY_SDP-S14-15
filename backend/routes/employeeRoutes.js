const express =  require('express')
const employeeController = require('../controllers/employeeController')
const employeeRouter = express.Router()

const { verifytoken, authorize } = require('../utils/Auth');

employeeRouter.post('/checkemplogin', employeeController.checkemployeelogin)
employeeRouter.post('/sendotp/:ID',  employeeController.sendotpmail)
employeeRouter.post('/verifyotp/:ID', employeeController.verifyotp)
employeeRouter.get('/employeeprofile/:id', verifytoken, authorize('employee'), employeeController.empProfile)
employeeRouter.post('/applyleave/:ID', verifytoken, authorize('employee'), employeeController.applyLeave)
employeeRouter.get('/viewleavehistory/:id', verifytoken, authorize('employee'), employeeController.viewleaveHistory)
employeeRouter.post('/uploadprofile/:ID', verifytoken, authorize('employee'), employeeController.uploadEmpProfile)
employeeRouter.get('/viewProfile/:ID', verifytoken, authorize('employee'), employeeController.ViewProfile)
employeeRouter.post('/ChangePassword/:ID', verifytoken, authorize('employee'), employeeController.ChangePassword)
employeeRouter.get('/viewLetterByLID/:ID',verifytoken, authorize('employee'),  employeeController.viewLetterByLID)
employeeRouter.get('/viewLeaveByLID/:ID/:LID',verifytoken, authorize('employee'),employeeController.viewLeaveByLID)
employeeRouter.get('/leaveanalysis/:id',verifytoken, authorize('employee'), employeeController.leaveAnalysis)
module.exports = employeeRouter
