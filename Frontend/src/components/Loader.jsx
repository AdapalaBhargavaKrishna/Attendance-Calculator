import React from "react";
import { motion } from "framer-motion";

export default function Loader() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="flex justify-center items-center py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.img 
        src="/loading1.gif" 
        alt="Loading..." 
        className="w-40 h-40"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}