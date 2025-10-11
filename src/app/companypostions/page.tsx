"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Headphones, Briefcase } from "lucide-react";
import ParticlesBackground from "@/components/Background";

const positions = [
  {
    id: 1,
    title: "Admin",
    icon: <ShieldCheck size={28} />,
    description:
      "Admins oversee the entire platform, manage users, approve requests, and maintain system integrity.",
  },

  {
    id: 3,
    title: "Support Executive",
    icon: <Headphones size={28} />,
    description:
      "Support Executives handle user queries, guide new users, and ensure smooth communication across the platform.",
  },
  {
    id: 4,
    title: "Community Manager",
    icon: <Users size={28} />,
    description:
      "Community Managers engage with users, moderate discussions, and organize events or promotions.",
  },
];

const CompanyPositions: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-10 px-5 md:px-20">
      <ParticlesBackground/>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl z-2 font-bold mb-10 text-yellow-400 text-center"
      >
        Company Positions
      </motion.h1>

      <div className="grid  realtive z-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {positions.map((position) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: position.id * 0.1 }}
            className="bg-gray-900 z-2 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
          >
            <div className="flex items-center mb-4 text-yellow-400">
              {position.icon}
              <h2 className="text-2xl font-semibold ml-3">{position.title}</h2>
            </div>
            <p className="text-gray-300">{position.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPositions;
