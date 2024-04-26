import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import img1 from "./images/img1.jpg";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import BackendURLS from "../config";

const StyledButton = styled.button`
  background: #fff;
  font-size: 14px;
  margin-top: 30px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #d4d3e8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  width: 100%;
  color: #4c489d;
  box-shadow: 0px 2px 2px #5c5696;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #4c489d;
    color: #fff;
  }
`;

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Raleway, sans-serif",
    background: "linear-gradient(90deg, #C7C5F4, #776BCC)",
    backgroundAttachment: "fixed",
  },
  screen: {
    background: "linear-gradient(90deg, #5D54A4, #7C78B8)",
    position: "relative",
    height: "600px",
    width: "360px",
    boxShadow: "0px 0px 24px #5C5696",
  },
  screenContent: {
    zIndex: 1,
    position: "relative",
    height: "100%",
  },
  screenBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    WebkitClipPath: "inset(0 0 0 0)",
    clipPath: "inset(0 0 0 0)",
  },
  backgroundShape: {
    transform: "rotate(45deg)",
    position: "absolute",
  },
  shape1: {
    height: "520px",
    width: "520px",
    background: "#FFF",
    top: "-50px",
    right: "120px",
    borderRadius: "0 72px 0 0",
  },
  shape2: {
    height: "220px",
    width: "220px",
    background: "#6C63AC",
    top: "-172px",
    right: 0,
    borderRadius: "32px",
  },
  shape3: {
    height: "540px",
    width: "190px",
    background: "linear-gradient(270deg, #5D54A4, #6A679E)",
    top: "-24px",
    right: 0,
    borderRadius: "32px",
  },
  shape4: {
    height: "400px",
    width: "200px",
    background: "#7E7BB9",
    top: "420px",
    right: "50px",
    borderRadius: "60px",
  },
  login: {
    width: "320px",
    padding: "30px",
    paddingTop: "156px",
  },
  loginField: {
    padding: "20px 0px",
    position: "relative",
  },
  loginIcon: {
    position: "absolute",
    top: "30px",
    color: "#7875B5",
  },
  loginInput: {
    border: "none",
    borderBottom: "2px solid #D1D1D4",
    background: "none",
    padding: "10px",
    paddingLeft: "24px",
    fontWeight: "700",
    width: "75%",
    transition: ".2s",
  },
  loginSubmit: {
    background: "#fff",
    fontSize: "14px",
    marginTop: "30px",
    padding: "16px 20px",
    borderRadius: "26px",
    border: "1px solid #D4D3E8",
    textTransform: "uppercase",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "#4C489D",
    boxShadow: "0px 2px 2px #5C5696",
    cursor: "pointer",
    transition: ".2s",
  },
  title: {
    fontSize: "50px",
    marginBottom: "20px",
    color: "#fff", // Add some bottom margin to create a gap
  },
};

const dialogStyles = {
  dialog: {
    width: "400px",
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  header: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "10px",
    borderRadius: "4px",
    background: "#4C489D",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

const Login = ({ onEmployeeLogin }) => {
  const [uname, setuname] = useState("");
  const [upwd, setupwd] = useState("");
  //eslint-disable-next-line
  const [employeeID, setEmployeeID] = useState("");
  const [otpDialogVisible, setOtpDialogVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username: uname,
      password: upwd,
    };

    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/checkemplogin`,
        data
      );
      if (response != null) {
        if (response.status === 200) {
          // console.log(response.data);
          setEmployeeID(uname);
          sendOTP(uname);
        } else if (response.status === 401) {
          console.log("Invalid Credentials");
          toast.error("Invalid Credentials");
        } 
      }
    } catch (error) {
      // console.log(error.message);
      toast.error(error.response.data.message,{theme:'colored'});
    }
  };

  const sendOTP = async (uname) => {
    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/sendotp/${uname}`,
        { username: uname }
      );
      if (response.status === 200) {
        console.log(response.data);
        setOtpDialogVisible(true);
      } else {
        console.log("Error sending OTP");
        toast.error("Error sending OTP");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data,{theme:'colored'});
    }
  };

  const verifyOTP = async () => {
    try {
      const response = await axios.post(
        `${BackendURLS.Employee}/verifyotp/${uname}`,
        { otp }
      );

      if (response.status === 200) {
        // console.log(response.data);
        toast.success("OTP verified. Login successful!",{theme:'colored',autoClose:1000 });
        sessionStorage.setItem("employee", JSON.stringify(response.data.employee));
        sessionStorage.setItem("EmployeeToken", "Bearer " +(response.data.token).replace(/"/g, ""));
        setTimeout(() => {
          onEmployeeLogin();
          navigate(`/employee/EmpHome`);
        }, 1000);
        
      } else {
        // console.log("Incorrect OTP");
        toast.error("Incorrect OTP",{theme:'colored'});
        // setOtpDialogVisible(true);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message,{theme:'colored'});
    }
  };

  return (
    <div>
      <div style={styles.container}>
        <img
          src={img1}
          alt="Employee Here"
          style={{ width: "200px", height: "200px", borderRadius: "20%" }}
        />
        &nbsp;&nbsp;&nbsp;&nbsp;
        <motion.span
          style={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 2 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Employee Login
        </motion.span>{" "}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div style={styles.screen}>
          <div style={styles.screenContent}>
            <form style={styles.login} onSubmit={handleSubmit}>
              <div style={styles.loginField}>
                <i style={styles.loginIcon} className="fas fa-user"></i>
                <input
                  type="text"
                  style={styles.loginInput}
                  placeholder="Username"
                  onChange={(e) => setuname(e.target.value)}
                />
              </div>
              <div style={styles.loginField}>
                <i style={styles.loginIcon} className="fas fa-lock"></i>
                <input
                  type="password"
                  style={styles.loginInput}
                  placeholder="Password"
                  onChange={(e) => setupwd(e.target.value)}
                />
              </div>
              <StyledButton type="submit">Log in</StyledButton>
            </form>
          </div>
          <div style={styles.screenBackground}>
            <span
              style={{ ...styles.backgroundShape, ...styles.shape4 }}
            ></span>
            <span
              style={{ ...styles.backgroundShape, ...styles.shape3 }}
            ></span>
            <span
              style={{ ...styles.backgroundShape, ...styles.shape2 }}
            ></span>
            <span
              style={{ ...styles.backgroundShape, ...styles.shape1 }}
            ></span>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Dialog
        visible={otpDialogVisible}
        onHide={() => setOtpDialogVisible(false)}
        style={dialogStyles.dialog}
        header="Verification"
      >
        <h2 style={dialogStyles.header}>Enter OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={dialogStyles.input}
        />
        <Button
          label="Verify OTP"
          onClick={verifyOTP}
          style={dialogStyles.button}
        />
        <ToastContainer/>
      </Dialog>
    </div>
  );
};

export default Login;
