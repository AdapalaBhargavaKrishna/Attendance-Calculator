import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FutureScenarioCalculator({ attended, total }) {
  const [planSkip, setPlanSkip] = useState(0);
  const [planAttend, setPlanAttend] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);

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

  const futureTotal = total + planSkip + planAttend;
  const futureAttended = attended + planAttend;
  const percentage = futureTotal > 0 ? 
    ((futureAttended / futureTotal) * 100).toFixed(2) : 
    "0.00";

  // Color based on percentage
  const percentageColor = parseFloat(percentage) >= 75 ? 
    "text-green-400" : 
    parseFloat(percentage) >= 65 ? 
    "text-yellow-400" : 
    "text-red-400";

  const handleInputChange = (setter) => (e) => {
    setter(Math.max(0, Number(e.target.value)));
    setHasInteracted(true);
  };

  const handleButtonClick = (setter, value) => () => {
    setter(prev => Math.max(0, prev + value));
    setHasInteracted(true);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-black rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col"
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-200 mb-6 text-center"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Future Scenario Planning
      </motion.h2>
      
      <div className="w-full flex flex-col gap-6">
        {/* Classes to skip */}
        <div>
          <motion.p 
            className="text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Classes planning to skip
          </motion.p>
          <motion.div 
            className="flex items-center gap-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <input
              type="number"
              min="0"
              value={planSkip}
              onChange={handleInputChange(setPlanSkip)}
              className="flex-1 bg-black text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
            <div className="flex gap-2">
              <motion.button 
                onClick={handleButtonClick(setPlanSkip, -1)}
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
                onClick={handleButtonClick(setPlanSkip, 1)}
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
        </div>
        
        {/* Classes to attend */}
        <div>
          <motion.p 
            className="text-gray-300 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Classes planning to attend
          </motion.p>
          <motion.div 
            className="flex items-center gap-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <input
              type="number"
              min="0"
              value={planAttend}
              onChange={handleInputChange(setPlanAttend)}
              className="flex-1 bg-black text-white p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <div className="flex gap-2">
              <motion.button 
                onClick={handleButtonClick(setPlanAttend, -1)}
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
                onClick={handleButtonClick(setPlanAttend, 1)}
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
        </div>
        
        {/* Conditional rendering */}
        {!hasInteracted ? (
          <motion.div 
            className="bg-blue-900/30 text-blue-200 p-4 rounded-lg border border-blue-800/50 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm">Enter the number of classes you plan to attend or skip to see your projected attendance percentage</p>
          </motion.div>
        ) : (
          <motion.div 
            className="mt-2"
            initial="initial"
            animate="animate"
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
              {percentage}%
            </motion.h1>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}