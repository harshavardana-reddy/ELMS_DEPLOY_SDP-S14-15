# Employee Leave Management System (ELMS)

![ELMS Banner](https://img.shields.io/badge/ELMS-Employee%20Leave%20Management%20System-blue)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A simple, professional Employee Leave Management System built with the MERN stack (MongoDB, Express, React, Node.js). Designed for organisations to manage employee profiles, leave requests, approvals, and email notifications — with secure JWT authentication and role-based access control (Admin / Employee).

---

## Table of Contents

- About
- Features
- Tech Stack
- Quick Start (Windows / cmd.exe)
- Environment Variables
- Backend Routes & Controllers
- Project Structure
- Deployment & Notes
- Contributing
- License

---

## About

ELMS provides an admin dashboard and employee portal. Admins can add employees, review and approve/reject leaves, view analytics and upload employees in bulk. Employees can apply for leave, view leave history, upload profiles, and authenticate using email OTP.

This repository contains both the backend (API) and the frontend (React app). The backend exposes REST APIs under `/admin` and `/employee`. The frontend consumes those APIs and provides a responsive UI.

## Key Features

- JWT-based authentication and authorization (RBAC)
- Employee OTP email login flow
- Email notifications (approve/reject/confirmation/password reset)
- Admin: Add / update / delete employees, view leaves, approve/reject
- Employee: Apply for leave, view leave history, upload profile
- CSV / bulk employee upload (Admin)
- Leave analysis endpoints for simple analytics
- Static build for frontend ready to deploy (Netlify-friendly)

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Atlas recommended)
- Auth: JSON Web Tokens (JWT)
- Email: Nodemailer (configured via environment variables)

---

## Quick Start (Windows - cmd.exe)

Prerequisites: Node.js (>=14), npm, a MongoDB Atlas cluster or MongoDB connection string.

1) Clone repository

```cmd
cd "d:\\Git Repositories\\ELMS_DEPLOY_SDP-S14-15"
```

2) Backend: install and run

```cmd
cd backend
npm install
REM create a .env file with required variables (see next section)
npm start
```

3) Frontend: install and run (in a new terminal)

```cmd
cd frontend
npm install
npm start
```

Frontend development server runs (typically) on http://localhost:3000 and backend on the configured PORT (default 2863).

---

## Environment Variables (.env)

Create a `.env` file in the `backend` folder with the following variables (example names used in this project):

- MONGODB_URI_MAIN - MongoDB Atlas connection string
- PORT - (optional) port for backend (default 2863)
- SECRET_KEY - JWT signing secret
- EMAIL_HOST - SMTP host for sending emails
- EMAIL_USER - SMTP user (from address)
- EMAIL_PASS - SMTP password

Example `.env` (do NOT commit credentials):

```text
MONGODB_URI_MAIN=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/elms?retryWrites=true&w=majority
PORT=2863
SECRET_KEY=your_jwt_secret_here
EMAIL_HOST=smtp.example.com
EMAIL_USER=youremail@example.com
EMAIL_PASS=supersecretpassword
```

---

## Backend Routes & Controllers

The backend mounts admin routes under `/admin` and employee routes under `/employee`.

Controllers (located in `backend/controllers`):

- `adminController.js` — admin-related operations
- `employeeController.js` — employee-related operations

Key routes available (method — path — controller.function):

Admin routes (prefix: /admin)

- POST  /admin/checkadminlogin — adminController.checkAdminLogin
- POST  /admin/addEmployee — adminController.addEmployee (admin only)
- GET   /admin/viewEmployees — adminController.viewEmployees (admin only)
- DELETE /admin/deleteEmployee/:id — adminController.deleteEmployeeByID (admin only)
- GET   /admin/leavesapplied — adminController.viewAppliedLeaves (admin only)
- GET   /admin/viewLeavesbyeid/:id — adminController.viewleaveHistoryByEID (admin only)
- PUT   /admin/approve/:id — adminController.approveLeave (admin only)
- PUT   /admin/reject/:id — adminController.rejectLeave (admin only)
- DELETE /admin/deleteleaveByid/:id — adminController.deleteLeaveByID (admin only)
- GET   /admin/leaveAnalysis — adminController.leaveAnalysis (admin only)
- POST  /admin/UploadEmployees — adminController.UploadEmployees (admin only)
- PUT   /admin/changeStatus/:ID — adminController.setStatus (admin only)
- GET   /admin/employeebyID/:ID — adminController.fetchEmployeebyID (admin only)
- PUT   /admin/updateEmployeebyID/:ID — adminController.UpdateEmployeebyID (admin only)
- GET   /admin/viewLeaveByLID/:ID — adminController.viewLeaveByLID (admin only)
- GET   /admin/viewProfile/:ID — adminController.ViewProfile (admin only)
- GET   /admin/viewLetterByLID/:ID — adminController.viewLetterByLID (admin only)
- POST  /admin/changePassword/:uname — adminController.ChangePassword (admin only)

Employee routes (prefix: /employee)

- POST  /employee/checkemplogin — employeeController.checkemployeelogin
- POST  /employee/sendotp/:ID — employeeController.sendotpmail
- POST  /employee/verifyotp/:ID — employeeController.verifyotp
- GET   /employee/employeeprofile/:id — employeeController.empProfile (employee only)
- POST  /employee/applyleave/:ID — employeeController.applyLeave (employee only)
- GET   /employee/viewleavehistory/:id — employeeController.viewleaveHistory (employee only)
- POST  /employee/uploadprofile/:ID — employeeController.uploadEmpProfile (employee only)
- GET   /employee/viewProfile/:ID — employeeController.ViewProfile (employee only)
- POST  /employee/ChangePassword/:ID — employeeController.ChangePassword (employee only)
- GET   /employee/viewLetterByLID/:ID — employeeController.viewLetterByLID (employee only)
- GET   /employee/viewLeaveByLID/:ID/:LID — employeeController.viewLeaveByLID (employee only)
- GET   /employee/leaveanalysis/:id — employeeController.leaveAnalysis (employee only)

Note: Protected routes require a valid Authorization header: `Authorization: Bearer <token>` and appropriate role.

---

## Project Structure (high level)

- backend/
  - controllers/ (adminController.js, employeeController.js)
  - models/ (Admin.js, Employees.js, Empotp.js, LeaveApplications.js, Tasks.js)
  - routes/ (adminRoutes.js, employeeRoutes.js)
  - utils/ (Auth.js, otp.js, Send*.js)
  - Server.js
- frontend/ (React app, Tailwind CSS, Netlify-ready)

---

<!-- ## UI & Screenshots

The frontend is implemented in `frontend/src` and already contains production build files in `frontend/build`.

Add your screenshots into `frontend/public` or `frontend/src/images` and reference them here. Example preview placeholder:

![App Screenshot](./frontend/build/static/media/placeholder.png)

Replace the placeholder above with a real screenshot to make the README pop.

--- -->

## Deployment & Notes

- Frontend: you can deploy the `frontend/build` folder to Netlify or any static host. There's a `netlify.toml` in `frontend` that addresses refresh issues.
- Backend: deploy to any Node-capable host (Heroku, Render, DigitalOcean). Ensure environment variables are set and SMTP credentials are valid for email features.
- Use MongoDB Atlas for a production-ready DB and whitelist your host IPs / set correct network rules.

Security note: Do not commit your `.env` or credentials. Use secrets management on your hosting platform.

---

## Contributing

Contributions are welcome. Open an issue describing the change, then send a pull request. Keep changes focused and include tests when adding features.

---

## License

This project is distributed under the MIT License. See the `LICENSE` file for details.

---

If you'd like, I can also:

- add a screenshot and badges that show build/test status (if CI is added),
- create a short `CONTRIBUTING.md`, or
- generate a small Postman collection documenting the APIs.

If you want any of the above, tell me which and I'll add it next.
