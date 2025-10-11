"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Users, Clipboard, Gift, Activity } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ParticlesBackground from "@/components/Background";

const Page: React.FC = () => {
  const user = useSelector((state: any) => state.user);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(user.referralCode || "");
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    {
      title: "Total People Added",
      value: user.referralUsedCount || 0,
      icon: <Users size={32} className="text-yellow-400" />,
    },
    {
      title: "Your Referral Code",
      value: user.referralCode || "XXXXXX",
      icon: <Clipboard size={32} className="text-yellow-400" />,
      copy: true,
    },
    {
      title: "Total Earnings",
      value: `Rs ${user.referralEarned || 0}`,
      icon: <Gift size={32} className="text-yellow-400" />,
    },
    {
      title: "Tasks Completed",
      value: user.referralUsedCount || 0,
      icon: <Activity size={32} className="text-yellow-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10 mb-14">
      <ParticlesBackground/>
      <Toaster position="top-right" />

      {/* Page Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-2 mb-10"
      >
        <h1 className="text-4xl z-2 md:text-5xl font-bold text-yellow-400 mb-2">
          Add People & Earn
        </h1>
        <p className="text-gray-400 z-2">
          Share your referral code and earn rewards for every user you add
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 z-2 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-gray-800 z-2 rounded-2xl p-6 shadow-lg flex items-center justify-between hover:scale-105 transform transition-transform cursor-pointer"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            onClick={stat.copy ? handleCopy : undefined}
          >
            <div className="flex items-center gap-4">
              {stat.icon}
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
            {stat.copy && (
              <button
                onClick={handleCopy}
                className={`bg-yellow-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-yellow-500 transition`}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Instructions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto mt-16 text-center text-gray-300"
      >
        <h2 className="text-2xl font-semibold mb-4 text-yellow-400">
          How to Earn
        </h2>
        <p className="mb-2">
          1. Share your referral code with friends.
        </p>
        <p className="mb-2">
          2. When a friend signs up using your code, they become your referral.
        </p>
        <p className="mb-2">
          3. Earn rewards automatically when your referrals complete tasks.
        </p>
        <p>
          4. Track your total referrals and earnings here in real-time.
        </p>
      </motion.div>
    </div>
  );
};

export default Page;
