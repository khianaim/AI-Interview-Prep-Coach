"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type TextLightProps = {
  text: string;
  fontSize?: string;
  layout?: "centered" | "left"; // New layout prop
};

export const TextLight = ({
  text,
  fontSize = "text-7xl",
  layout = "centered",
}: TextLightProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Prevent SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define container class based on layout type
  const containerClass =
    layout === "centered"
      ? "w-full h-screen flex justify-center items-center"
      : "w-full flex justify-start items-center";

  // Define the x position for text based on layout type
  const textX = layout === "centered" ? "50%" : "18%";

  return isClient ? (
    <div className={containerClass}>
      <svg
        ref={svgRef}
        width="100%"
        height="auto" // Allow height to adjust to the content
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        className="select-none"
      >
        <defs>
          {/* Glowing Gradient */}
          <linearGradient id="textGradient" gradientUnits="userSpaceOnUse">
            <motion.stop
              offset="0%"
              stopColor="#2205ff"
              animate={{
                stopColor: ["#2205ff", "#ff3333", "#deff66", "#2205ff"],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.stop
              offset="50%"
              stopColor="#ff3333"
              animate={{
                stopColor: ["#ff3333", "#deff66", "#2205ff", "#ff3333"],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <motion.stop
              offset="100%"
              stopColor="#deff66"
              animate={{
                stopColor: ["#deff66", "#2205ff", "#ff3333", "#deff66"],
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Main Text with Glowing Outline */}
        <motion.text
          x={textX} // Use textX for positioning
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          stroke="url(#textGradient)"
          strokeWidth="2" // Increase the outline stroke width for visibility
          className={`fill-transparent font-[inter] ${fontSize} font-extralight`}
          filter="url(#glow)"
          initial={{ opacity: 0 }} // Set initial opacity to 0 (hidden at first)
          animate={{ opacity: 1 }} // Animate to opacity 1 immediately
          transition={{ duration: 1 }} // Optional: Add a duration for the fade-in effect
        >
          {text}
        </motion.text>
      </svg>
    </div>
  ) : null;
};
