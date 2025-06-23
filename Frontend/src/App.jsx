import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import linkedinlogo from './assets/linkedin.svg'
import Sidebar from "./components/Sidebar";
import AttendanceTable from "./components/AttendanceTable";
import CurrentAttendanceCalculator from "./components/CurrentAttendanceCalculator";
import SubjectwiseAttendance from "./components/SubjectwiseAttendance";
import FutureScenarioCalculator from "./components/FutureScenarioCalculator";
import TargetCalculator from "./components/TargetCalculator";
import Loader from "./components/Loader";

export default function App() {
  const [rollNumber, setRollNumber] = useState("");
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // State for calculators
  const [currentAttended, setCurrentAttended] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Fetch attendance from backend
  const fetchAttendance = async () => {
    if (!/^\d{12}$/.test(rollNumber)) {
      setErrorMsg("Please enter exactly 12 digits.");
      return;
    }
    setLoading(true);
    setAttendanceData(null);
    setErrorMsg("");
    try {
      const res = await fetch("http://localhost:3001/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: rollNumber }),
      });
      const data = await res.json();
      if (!Array.isArray(data)) {
        setErrorMsg(data.error || "No data found for the entered roll number.");
        setAttendanceData(null);
      } else {
        setAttendanceData(data);
      }
    } catch (err) {
      setErrorMsg("Failed to fetch attendance data. Please try again.");
    }
    setLoading(false);
  };

  // Extract unique subjects for subject-wise attendance
  const subjects = Array.isArray(attendanceData)
    ? [
        ...new Set(
          attendanceData
            .map((row) => row["Subject"])
            .filter((s) => s && s !== "N/A")
        ),
      ]
    : [];

  // Find the "Total" row for current attendance
  const totalRow =
    Array.isArray(attendanceData) &&
    attendanceData.find((row) => row["Faculty"] === "Total");

  // Update current attendance values when data loads
  useEffect(() => {
    if (totalRow) {
      setCurrentAttended(parseInt(totalRow["Classes Attended"] || 0));
      setCurrentTotal(parseInt(totalRow["Classes Held"] || 0));
    }
  }, [totalRow]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen max-h-screen bg-black "
    >
      <Sidebar
        rollNumber={rollNumber}
        setRollNumber={setRollNumber}
        fetchAttendance={fetchAttendance}
        loading={loading}
      />

      <motion.main 
        className="flex-1 p-6 overflow-y-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <div className="text-white md:hidden flex items-center justify-end pb-40 w-full">
          <a href="https://www.linkedin.com/in/bhargavakrishnaadapala/" target="_blank">

          <button className="group active:scale-95 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-2xl px-6 font-medium text-white transition-colors focus:outline-none">
          <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">Linked In</div>
            <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
              <img src={linkedinlogo} alt="" />
            </div>
          </button>
        </a>
        </div>
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <Loader />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ type: "spring" }}
              className="bg-black text-white p-4 rounded-lg mb-6 text-center shadow-md"
            >
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {Array.isArray(attendanceData) && (
          <motion.div 
            variants={itemVariants}
            className="bg-black rounded-xl shadow-md overflow-auto scrollbar-none mb-24 flex flex-col items-center"
          >
            <AttendanceTable data={attendanceData} />
          </motion.div>
        )}

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <CurrentAttendanceCalculator
              totalRow={totalRow}
              attended={currentAttended}
              total={currentTotal}
              setAttended={setCurrentAttended}
              setTotal={setCurrentTotal}
            />
          </motion.div>

          {Array.isArray(attendanceData) && (
            <motion.div variants={itemVariants}>
              <SubjectwiseAttendance subjects={subjects} data={attendanceData} />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <FutureScenarioCalculator
              attended={currentAttended}
              total={currentTotal}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <TargetCalculator
              attended={currentAttended}
              total={currentTotal}
            />
          </motion.div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
}