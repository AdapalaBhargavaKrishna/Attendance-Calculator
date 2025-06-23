import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export default function SubjectwiseAttendance({ subjects, data }) {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0] || "");
  const [skip, setSkip] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  const percentageVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  // Filter data for selected subject
  const subjectRows = useMemo(
    () =>
      data.filter(row =>
        selectedSubject === "ALL" ? true : row["Subject"] === selectedSubject
      ),
    [data, selectedSubject]
  );

  // Calculate totals
  const { totalHeld, totalAttended } = subjectRows.reduce(
    (acc, row) => {
      acc.totalHeld += parseInt(row["Classes Held"] || 0);
      acc.totalAttended += parseInt(row["Classes Attended"] || 0);
      return acc;
    },
    { totalHeld: 0, totalAttended: 0 }
  );

  const subjectTotalClasses = totalHeld + skip;
  const subjectAttPercentage =
    subjectTotalClasses > 0
      ? ((totalAttended / subjectTotalClasses) * 100).toFixed(2)
      : "0.00";

  // Color based on percentage
  const percentageColor = parseFloat(subjectAttPercentage) >= 75 ? 
    "text-green-400" : 
    parseFloat(subjectAttPercentage) >= 65 ? 
    "text-yellow-400" : 
    "text-red-400";

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className=" bg-black rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col"
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-200 mb-6 text-center"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Subject-wise Attendance
      </motion.h2>
      
      <div className="w-full flex flex-col gap-6">
        {/* Subject Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="text-gray-300 block mb-2">Select Subject:</label>
          <select
            className="w-full  bg-black text-gray-200 border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subj, index) => (
              <option 
                key={subj} 
                value={subj}
                className=" bg-black"
              >
                {subj}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Skip Classes Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-300 mb-2">Classes planning to skip</p>
          <motion.div 
            className="flex items-center gap-2 w-full"
            whileHover={{ scale: 1.01 }}
          >
            <input
              type="number"
              min="0"
              value={skip}
              onChange={e => setSkip(Math.max(0, Number(e.target.value)))}
              className="flex-1  bg-black text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-2">
              <motion.button 
                onClick={() => setSkip(Math.max(0, skip - 1))}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button 
                onClick={() => setSkip(skip + 1)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Attendance Percentage */}
        <motion.div 
          className="mt-2"
          variants={percentageVariants}
        >
          <p className="text-gray-400 text-center mb-1">Projected Attendance</p>
          <motion.h1 
            className={`text-4xl font-bold text-center ${percentageColor}`}
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 0.5 }
            }}
          >
            {subjectAttPercentage}%
          </motion.h1>
          <p className="text-gray-400 text-center mt-2 text-sm">
            {totalAttended} attended / {subjectTotalClasses} total classes
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}