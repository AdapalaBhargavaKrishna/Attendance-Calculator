import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function CurrentAttendanceCalculator({ 
  totalRow, 
  attended, 
  total, 
  setAttended, 
  setTotal 
}) {
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
    hover: { scale: 1.05 },
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

  // Autofill from totalRow when available
  useEffect(() => {
    if (totalRow) {
      setAttended(parseInt(totalRow["Classes Attended"] || 0));
      setTotal(parseInt(totalRow["Classes Held"] || 0));
    }
  }, [totalRow, setAttended, setTotal]);

  const percentage = total > 0 ? 
    ((attended / total) * 100).toFixed(2) : 
    "0.00";

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className=" bg-black rounded-xl shadow-lg border border-neutral-700 shadow-md p-6 flex flex-col items-center"
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-200 mb-6"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Current Attendance
      </motion.h2>
      
      <div className="w-full flex flex-col gap-6">
        <div>
          <motion.p 
            className="text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Classes Attended
          </motion.p>
          <motion.div 
            className="flex items-center gap-2  bg-black rounded-lg px-3 py-1 border border-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="number"
              min="0"
              value={attended}
              onChange={e => setAttended(Math.max(0, Number(e.target.value)))}
              className="bg-transparent border-none text-white p-2 w-20 focus:outline-none focus:ring-2 focus:ring-green-400 w-full rounded"
            />
            <div className="flex gap-1">
              <motion.button 
                onClick={() => setAttended(Math.max(0, attended - 1))}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-1 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button 
                onClick={() => setAttended(attended + 1)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-1 bg-green-500/20 hover:bg-green-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        <div>
          <motion.p 
            className="text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Total Classes
          </motion.p>
          <motion.div 
            className="flex items-center gap-2  bg-black rounded-lg px-3 py-1 border border-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="number"
              min="0"
              value={total}
              onChange={e => setTotal(Math.max(0, Number(e.target.value)))}
              className="bg-transparent border-none text-white p-2 w-20 focus:outline-none w-full focus:ring-2 focus:ring-blue-400 rounded"
            />
            <div className="flex gap-1">
              <motion.button 
                onClick={() => setTotal(Math.max(0, total - 1))}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-1 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
              <motion.button 
                onClick={() => setTotal(total + 1)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-1 bg-green-500/20 hover:bg-green-500/40 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-4"
          initial="initial"
          animate="animate"
          variants={percentageVariants}
        >
          <p className="text-gray-400 text-center mb-1">Current Percentage</p>
          <motion.h1 
            className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 via-pink-400 to-red-700 bg-clip-text text-transparent"
            animate={{
              scale: [1, 1.05, 1],
              transition: { duration: 0.5 }
            }}
          >
            {percentage}%
          </motion.h1>
        </motion.div>
      </div>
    </motion.div>
  );
}