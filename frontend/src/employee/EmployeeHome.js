import React, { useEffect, useState } from "react";
import Typed from "typed.js";
import axios from "axios";
import BackendURLS from "../config";
import image21 from '../components/images/21.png'
import { motion } from 'framer-motion'

const AnalysisCard = ({ title, value }) => (
  <motion.div
    className="border-2 border-white rounded-md p-4 m-4"
    whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)" }}
    transition={{ duration: 0.2 }}
  >
    <h2 className="text-lg font-semibold">{title}</h2>
    <p className="text-xl font-bold text-center ">{value}</p>
  </motion.div>
);

export default function EmployeeHome() {
  const [analysis, setAnalysis] = useState(null);

  const fetchAnalysis = async () => {
    const empid = JSON.parse(sessionStorage.getItem("employee")).EmployeeID;
    try {
      const response = await axios.get(
        `${BackendURLS.Employee}/leaveAnalysis/${empid}`,
        {
          headers: {
            Authorization: sessionStorage.getItem("EmployeeToken"),
          },
        }
      );
      setAnalysis(response.data);
    } catch (error) {
      console.log("Error fetching analysis:", error.message);
    }
  };

  useEffect(() => {
    const employee = JSON.parse(sessionStorage.getItem("employee")).EmployeeName;

    const typed = new Typed("#typed-text", {
      strings: [`Welcome, ${employee}`],
      typeSpeed: 50,
      loop: false,
    });

    const typed1 = new Typed("#typed-text2", {
      strings: ["This is Employee Portal"],
      typeSpeed: 50,
      loop: false,
    });

    fetchAnalysis();

    return () => {
      typed.destroy();
      typed1.destroy();
    };
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mt-8 text-center">
        <span id="typed-text"></span>
      </h1>
      <div className="flex justify-center">
        <img
          src={image21}
          alt="Employee Leave Management System"
          className="mt-8 max-w-full h-auto lg:max-w-none lg:h-auto"
        />
      </div>
      <h1 className="text-3xl font-bold mt-8 text-center">
        <span id="typed-text2"></span>
      </h1>
      <div className="flex justify-center">
        {analysis && (
          <>
            <AnalysisCard title="Total Leaves Taken" value={analysis.LeaveCount} />
            <AnalysisCard title="Casual Leave " value={analysis.CasualLeaveCount} />
            <AnalysisCard title="Sick Leave " value={analysis.SickLeaveCount} />
            <AnalysisCard title="Medical Leave" value={analysis.MedicalLeaveCount} />
            <AnalysisCard title="Compensated Casual Leave " value={analysis.CompensatedCasualLeaveCount} />
            <AnalysisCard title="Half Paid Leave " value={analysis.HalfPaidLeaveLeaveCount} />
          </>
        )}
      </div>
    </div>
  );
}
