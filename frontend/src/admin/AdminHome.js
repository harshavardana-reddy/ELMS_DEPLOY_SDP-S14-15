import React,{useState, useEffect} from "react";
import image21 from "../components/images/21.png";
import Typed from "typed.js";
import BackendURLS from "../config";
import axios from 'axios';
import { motion } from "framer-motion";

// Separate component for displaying analysis data
const AnalysisCard = ({ title, value }) => (
  <motion.div
    className="border rounded-md p-4 m-4"
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-xl font-bold text-center ">{value}</p>
  </motion.div>
);

export default function AdminHome() {
  
  const [analysis, setAnalysis] = useState(null);

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`${BackendURLS.Admin}/leaveAnalysis`,{
        headers:{
          Authorization:sessionStorage.getItem('AdminToken')
        }
      });
      setAnalysis(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  useEffect(() => {
    const admin = JSON.parse(sessionStorage.getItem("admin"));
    const typed = new Typed("#typed-text", {
      strings: [`Welcome, ${admin.username}`],
      typeSpeed: 50,
      loop: false,
    });
    const typed1 = new Typed("#typed-text2", {
      strings: ["This is Admin-Portal"],
      typeSpeed: 50,
      loop: false,
    });

    return () => {
      typed.destroy();
      typed1.destroy();
    };
  }, []);

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mt-8 text-center">
          <span id="typed-text"></span> {/* Placeholder for typed text */}
        </h1>
        <p className="mt-4 text-center"></p>
        <div className="flex justify-center">
          <img
            src={image21}
            alt="Employee Leave Management System"
            className="mt-8 max-w-full h-auto lg:max-w-none lg:h-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mt-8 text-center">
          <span id="typed-text2"></span> {/* Placeholder for typed text */}
        </h1>
        <p className="mt-4 text-center"></p>

        {/* Display analysis data in separate cards */}
        <div className="flex justify-center">
          {analysis && (
            <>
              <AnalysisCard title="Employee Count" value={analysis.EmployeeCount} />
              <AnalysisCard title="Total Leaves" value={analysis.LeaveCount} />
              <AnalysisCard title="Pending Leaves" value={analysis.LeavePendingCount} />
              <AnalysisCard title="Approved Leaves" value={analysis.LeaveApprovedCount} />
              <AnalysisCard title="Rejected Leaves" value={analysis.LeaveRejectedCount} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
