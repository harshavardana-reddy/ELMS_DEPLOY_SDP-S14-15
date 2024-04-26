import React from 'react';
import { motion } from 'framer-motion'; // Import the motion component from Framer Motion
import './about.css';

export default function About() {
  return (
    <motion.div // Wrap your component with the motion component
      className="container mx px-4 py-8 border-gray-300 rounded-lg"
      id="about"
      initial={{ opacity: 0, y: -20 }} // Initial animation properties
      animate={{ opacity: 1, y: 0 }} // Animation properties when the component mounts
      transition={{ duration: 0.5 }} // Transition duration
    >
      <h1 className="text-4xl font-bold text-center mb-8">About</h1>
      <p className="text-lg font-serif leading-relaxed font-bold">
        <span className="text-xl font-bold">The system is built on the MERN stack, which includes MongoDB, Express.js, React.js, and Node.js. MongoDB serves as the database, Express.js for server-side development, React.js for frontend development, and Node.js for server-side scripting.</span>
        <br /><br />
        <span className="font-bold">Features:</span>
        <ol className="list-decimal pl-6">
          <li className="text-xl font-bold">User authentication enables employees to sign in securely and access leave-related information.</li>
          <li className="text-xl font-bold">Leave Requests: Employees can submit leave requests specifying the type of leave (e.g., sick leave, vacation), duration, and reason.</li>
          <li className="text-xl font-bold">Leave Balances: The system monitors and shows employees' leave balances, including accumulated, taken, and available leave.</li>
          <li className="text-xl font-bold">Notifications: Employees receive automated notifications when their leave requests are submitted, approved, or rejected.</li>
          <li className="text-xl font-bold">Calendar Integration: Using calendar systems to present leave schedules and availability.</li>
          <li className="text-xl font-bold">Reporting and Analytics: Provides statistics and analytics on leave utilization, trends, and patterns to help with decision-making and resource planning.</li>
        </ol>
        <br />
        <span className="text-xl font-bold">Accessibility and Usability: The system is intended to be user-friendly, with a simple interface for navigation and interaction. It prioritizes accessibility so that all users, regardless of ability, may effectively use the system.</span>
        <br /><br />
        <span className="text-xl font-bold">Scalability and Performance: The system was designed with scalability in mind, so it can accommodate increasing numbers of users and data volumes. It is designed for performance, with rapid data retrieval and processing to reduce latency and improve user experience.</span>
        <br /><br />
        <span className="text-xl font-bold">Security: Uses strong security measures to secure critical employee data and prevent unauthorized access. Data confidentiality and integrity are ensured by the use of encryption, secure authentication procedures, and role-based access control (RBAC).</span>
        <br /><br />
        <span className="font-bold text-xl">Contributor:</span> This project is guided by Mr. Jonnalaggadda Surya Kiran and developed by K. Sanjay and P. Harshavardana Reddy.
      </p>
    </motion.div>
  );
}
