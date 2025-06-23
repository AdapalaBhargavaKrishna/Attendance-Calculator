import React from "react";
import { motion } from "framer-motion";

export default function AttendanceTable({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 p-4 bg-black rounded-lg text-center"
      >
        No attendance data found.
      </motion.p>
    );
  }

  // Find total attendance percentage
  const totalRow = data.find((row) => row["Faculty"] === "Total");
  const totalPercentage = totalRow?.["Att %"] || "0";
  const numericPercentage = parseFloat(totalPercentage);

  // Get status message based on attendance
  const getStatusMessage = () => {
    if (numericPercentage >= 75) return "Great! Your attendance is on track";
    if (numericPercentage >= 65) return "Good, but try to improve a bit more";
    return "Warning! Your attendance is low";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-black rounded-xl shadow-lg overflow-hidden mx-4 lg:mx-auto max-w-5xl"
    >
      <motion.div 
        className="p-4 md:p-6 bg-black border-b border-[#1a1a1a]"
        variants={headerVariants}
      >
        <div className="flex flex-col items-center text-center">
          <h1 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Attendance Summary</h1>
          <div className="flex flex-col items-center gap-1 md:gap-2">
            <motion.span 
              className={`text-4xl md:text-5xl font-bold ${
                numericPercentage >= 75 
                  ? 'text-[#06970d]' 
                  : numericPercentage >= 65 
                    ? 'text-[#eab308]' 
                    : 'text-[#ef4444]'
              }`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {totalPercentage}%
            </motion.span>
            <p className={`text-xs md:text-sm ${
              numericPercentage >= 75 
                ? 'text-[#06970d]' 
                : numericPercentage >= 65 
                  ? 'text-[#eab308]' 
                  : 'text-[#ef4444]'
            }`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="overflow-x-auto px-2 sm:px-4 md:px-6 pb-4 md:pb-6">
        <table className="w-full rounded-xl overflow-hidden min-w-[500px]">
          <thead>
            <motion.tr 
              className="bg-[#06970d] text-white"
              variants={headerVariants}
            >
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">S.No</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">Subject</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">Held</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">Attended</th>
              <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs sm:text-sm">Percentage</th>
            </motion.tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <motion.tr
                key={idx}
                variants={rowVariants}
                className={`text-white ${idx % 2 === 0 ? 'bg-black' : 'bg-[#121212]'}`}
              >
                <td className="px-3 py-2 sm:px-4 sm:py-4 text-center text-xs sm:text-sm">
                  {row["SlNo"] || idx + 1}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-4 font-medium text-white text-center text-xs sm:text-sm">
                  {row["Subject"] || "N/A"}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-4 text-center text-xs sm:text-sm">
                  {row["Classes Held"] || "0"}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-4 text-center text-xs sm:text-sm">
                  {row["Classes Attended"] || "0"}
                </td>
                <td className="px-3 py-2 sm:px-4 sm:py-4 text-center text-xs sm:text-sm">
                  <span className={`font-semibold ${
                    parseFloat(row["Att %"] || 0) >= 75 
                      ? 'text-[#06970d]' 
                      : parseFloat(row["Att %"] || 0) >= 65 
                        ? 'text-[#eab308]' 
                        : 'text-[#ef4444]'
                  }`}>
                    {row["Att %"] || "0%"}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}