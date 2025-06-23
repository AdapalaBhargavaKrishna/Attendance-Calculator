import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TargetCalculator({ attended, total }) {
  const [target, setTarget] = useState(75);
  
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

  const resultVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const currentPercentage = total > 0 ? 
    (attended / total) * 100 : 0;

  // Calculate classes needed to reach target
  const needed = currentPercentage < target ?
    Math.ceil((target * total - 100 * attended) / (100 - target)) :
    0;
    
  // Calculate classes that can be skipped while staying above target
  const canSkip = currentPercentage > target ?
    Math.floor((100 * attended - target * total) / target) :
    0;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className=" bg-black rounded-xl shadow-lg border border-neutral-700 p-6 flex flex-col"
    >
      <motion.h2 
        className="text-xl font-semibold text-gray-200 mb-6 text-center"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Target Calculator
      </motion.h2>
      
      <div className="w-full flex flex-col gap-6">
        {/* Target Slider */}
        <div>
          <motion.p 
            className="text-gray-300 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Target Percentage: <span className="font-bold text-blue-400">{target}%</span>
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="px-2"
          >
            <input
              type="range"
              min="0"
              max="100"
              value={target}
              onChange={e => setTarget(Number(e.target.value))}
              className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-red-400 [&::-webkit-slider-thumb]:to-red-400"
            />
            <div className="flex justify-between text-gray-400 text-xs mt-1 px-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </motion.div>
        </div>
        
        {/* Results */}
        <motion.div 
          className="mt-2"
          variants={resultVariants}
        >
          {currentPercentage < target ? (
            <motion.div 
              className=" bg-black/50 p-4 rounded-lg border border-green-500/30"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-green-300 text-center">Classes needed to reach target:</p>
              <motion.p 
                className="text-4xl font-bold text-center text-green-400 mt-2"
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5 }
                }}
              >
                {needed}
              </motion.p>
              <p className="text-green-200 text-sm text-center mt-2">
                Attend {needed} more class{needed !== 1 ? 'es' : ''} to reach {target}%
              </p>
            </motion.div>
          ) : (
            <motion.div 
              className=" bg-black/50 p-4 rounded-lg border border-yellow-500/30"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-yellow-300 text-center">Classes you can skip safely:</p>
              <motion.p 
                className="text-4xl font-bold text-center text-yellow-400 mt-2"
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.5 }
                }}
              >
                {canSkip}
              </motion.p>
              <p className="text-yellow-200 text-sm text-center mt-2">
                You can skip {canSkip} class{canSkip !== 1 ? 'es' : ''} while staying above {target}%
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}