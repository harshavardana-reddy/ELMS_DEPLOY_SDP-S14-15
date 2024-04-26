import React from 'react';
import { Link } from 'react-router-dom';
import { Routes,Route } from 'react-router-dom';
import MainHome from '../components/MainHome';
import AdminLogin from '../components/AdminLogin';
import Login from '../components/Login';
import About from '../components/About';
import PageNotFound from '../components/PageNotFound';

export default function NavBar1({onAdminLogin,onEmployeeLogin}) {
  return (
    <div>
    <div className="navbar bg-lightblue border-b-2 border-gray-400 rounded-lg" style={{ backgroundColor: 'gray', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>
      <div className="flex-1 flex" align="center">
        <a  className="btn btn-ghost text-xl" style={{ textAlign: 'left' }}>Employee Leave Management System</a>
      </div>

      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/employeelogin">Login</Link></li>
          <li><Link to="/adminlogin">Admin Login</Link></li>
        </ul>
      </div>
    </div>
      <Routes>
          <Route path="/" element={<MainHome/>} exact />
          <Route path="/about" element={<About/>} exact/>
          <Route path="/employeelogin" element={<Login onEmployeeLogin={onEmployeeLogin} />}  exact />
          <Route path="/adminlogin" element={<AdminLogin onAdminLogin={onAdminLogin} />}  exact />
          <Route path="*" element={<PageNotFound/>} exact />
      </Routes>
    </div>
    
  );
}
