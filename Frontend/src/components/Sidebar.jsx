import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";
import { FiMenu, FiX } from "react-icons/fi";

const sidebarVariants = {
  hidden: { x: -320, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  },
  exit: {
    x: -320,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const desktopSidebarVariants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: 320,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const inputVariants = {
  focus: {
    scale: 1.02,
    boxShadow: "0 0 0 3px rgba(168, 85, 247, 0.5)"
  }
};

const buttonVariants = {
  initial: { scale: 1 },
  tap: { scale: 0.96 },
};

export default function Sidebar({ rollNumber, setRollNumber, fetchAttendance, loading }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button - visible always */}
      <button
        onClick={toggleSidebar}
        className="fixed z-30 top-4 left-4 p-2 bg-black shadow-lg text-white rounded-md transition"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={isMobile ? "hidden" : "hidden"}
            animate="visible"
            exit="exit"
            variants={isMobile ? sidebarVariants : desktopSidebarVariants}
            className={`${isMobile ? 'fixed' : 'relative'} z-20 w-80 h-screen p-6 bg-neutral-950 rounded-r-[14rem] flex flex-col items-center justify-center`}
          >
            <motion.h2
              className="text-3xl font-extrabold mb-10 text-white tracking-wide"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              CBIT Portal
            </motion.h2>

            <motion.div className="w-full mb-5">
              <motion.input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                maxLength={12}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full p-3 rounded-xl border border-neutral-700 bg-black text-white placeholder-neutral-500 transition"
                variants={inputVariants}
                whileFocus="focus"
              />
            </motion.div>

            <motion.button
              onClick={fetchAttendance}
              disabled={loading}
              className="w-full py-3 px-5 border border-neutral-500 text-white font-semibold rounded-xl shadow-lg relative overflow-hidden transition-all"
              variants={buttonVariants}
              initial="initial"
              whileTap={!loading ? "tap" : ""}
            >
              {loading ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Loading...
                </motion.span>
              ) : (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Get Attendance
                </motion.span>
              )}

              {loading && (
                <motion.div
                  className="absolute inset-0 bg-purple-800 opacity-30"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                />
              )}
            </motion.button>

            {loading && <Loader />}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}