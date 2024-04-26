//import logo from './logo.svg';
import "./App.css";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import NavBar1 from "./navigationbar/NavBar1";
import EmpNavBar from "./employee/EmpNavBar";
import AdminNavBar from "./admin/AdminNavBar";
import { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";

function App() {

  
  
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  useEffect(() => {
    const adminLoggedIn = sessionStorage.getItem("isAdminLoggedIn") === "true";
    const employeeLoggedIn = sessionStorage.getItem("isEmployeeLoggedIn") === "true";
    
    setIsAdminLoggedIn(adminLoggedIn);
    setIsEmployeeLoggedIn(employeeLoggedIn);
  }, []);

  const onAdminLogin = () => {
    sessionStorage.setItem("isAdminLoggedIn", "true");
    setIsAdminLoggedIn(true);
  };

  const onEmployeeLogin = () => {
    sessionStorage.setItem("isEmployeeLoggedIn", "true");
    setIsEmployeeLoggedIn(true);
  };
  

  return (
    <NextUIProvider>
      <div className="App">
        <BrowserRouter>
          {isAdminLoggedIn ? (
            <AdminNavBar />
          ) : isEmployeeLoggedIn ? (
            <EmpNavBar />
          ) : (
            <NavBar1
              onAdminLogin={onAdminLogin}
              onEmployeeLogin={onEmployeeLogin}
            />
          )}
        </BrowserRouter>
        <Footer />
      </div>
    </NextUIProvider>
  );
}
export default App;
