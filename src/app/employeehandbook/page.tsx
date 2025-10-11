"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ParticlesBackground from "@/components/Background";

const handbookSections = [
  {
    id: 1,
    title: "Welcome to Youth Earning App",
    content:
      "The ultimate platform to earn, invest, and grow. Explore multiple ways to earn daily, from compounding systems to referral bonuses and fun lucky wheel spins. This handbook will guide you through our platform features and policies.",
  },
  {
    id: 2,
    title: "Getting Started",
    content:
      "Create your account, complete your profile, and explore our dashboard. Learn how to track your earnings, invest wisely, and participate in referral programs.",
  },
  {
    id: 3,
    title: "Earning Opportunities",
    content:
      "Earn through daily activities, referral bonuses, compounding systems, and lucky wheel spins. Keep an eye on notifications for new earning events and challenges.",
  },
  {
    id: 4,
    title: "Investment Rules",
    content:
      "Understand the investment tiers, growth rates, and withdrawal limits. Make informed decisions to maximize your returns safely.",
  },
  {
    id: 5,
    title: "Community Guidelines",
    content:
      "Maintain respect and integrity in all platform interactions. Avoid fraudulent activity and follow our ethical guidelines to keep the community safe.",
  },
  {
    id: 6,
    title: "Support & FAQs",
    content:
      "Access our 24/7 support for any queries. Check FAQs for instant answers to common issues regarding earnings, withdrawals, and account management.",
  },
];

const EmployeeHandbook: React.FC = () => {
  const [activeSection, setActiveSection] = useState(handbookSections[0]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <ParticlesBackground/>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full z-2 md:w-1/4 bg-gray-900 p-5 md:h-screen"
      >
        <h1 className="text-2xl font-bold mb-6 text-yellow-400">
          Youth Earning App
        </h1>
        <ul className="space-y-3">
          {handbookSections.map((section) => (
            <li
              key={section.id}
              className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-colors ${
                activeSection.id === section.id
                  ? "bg-yellow-600 text-black font-semibold"
                  : "hover:bg-gray-800"
              }`}
              onClick={() => setActiveSection(section)}
            >
              <span>{section.title}</span>
              <ChevronRight size={18} />
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeSection.id}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 md:h-screen overflow-y-auto"
      >
        <h2 className="text-3xl font-semibold mb-4 text-yellow-400">
          {activeSection.title}
        </h2>
        <p className="text-gray-300 leading-relaxed">{activeSection.content}</p>
      </motion.div>
    </div>
  );
};

export default EmployeeHandbook;
