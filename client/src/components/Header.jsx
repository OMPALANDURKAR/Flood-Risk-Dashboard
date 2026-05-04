import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateReport } from "../utils/reportGenerator";

export default function Header({ selectedDistrictData }) {
  const [time, setTime] = useState("");

  // ⏱ Live clock
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        w-full flex items-center justify-between
        bg-white/70 backdrop-blur-xl
        border border-slate-200/80
        rounded-2xl px-6 py-3 shadow-md
      "
    >
      {/* ===== LEFT ===== */}
      <div className="flex items-center gap-4">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="
            w-10 h-10 rounded-xl 
            bg-gradient-to-br from-blue-600 to-cyan-500 
            flex items-center justify-center 
            shadow-sm
          "
        >
          <span className="text-white text-lg">🌊</span>
        </motion.div>

        {/* Title */}
        <div className="leading-tight">
          <h1 className="
            text-lg font-semibold 
            bg-gradient-to-r from-blue-700 to-cyan-500
            bg-clip-text text-transparent
          ">
            Flood Surveillance & Risk Evaluation System
          </h1>

          <p className="text-xs text-slate-500">
            Real-time monitoring platform
          </p>
        </div>
      </div>

      {/* ===== RIGHT ===== */}
      <div className="flex items-center gap-6">

        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-slate-600 font-medium">
            SYSTEM ONLINE
          </span>
        </div>

        {/* Clock */}
        <div className="text-sm font-mono text-slate-500">
          {time}
        </div>

        {/* Report Button */}
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            if (!selectedDistrictData || !selectedDistrictData.district) {
              alert("Please select a district first");
              return;
            }

            generateReport(selectedDistrictData);
          }}
          className="
            px-4 py-2 text-sm rounded-lg 
            bg-blue-600 text-white 
            hover:bg-blue-700
            shadow-md
            transition-all
          "
        >
          Report Summary
        </motion.button>

      </div>
    </motion.header>
  );
}