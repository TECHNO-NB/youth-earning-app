"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MessageCircle, Wallet, Users } from "lucide-react";
import ParticlesBackground from "@/components/Background";
import logo from "../../../public/logoyeapng.png";
import Image from "next/image";

const tabs = [
  {
    id: "deposit",
    label: "Deposit / Withdraw",
    icon: <Wallet className="w-5 h-5" />,
    message: "Hello, I need assistance with deposit or withdrawal.",
  },
  {
    id: "customer",
    label: "Customer Service",
    icon: <MessageCircle className="w-5 h-5" />,
    message: "Hello, I need customer service support.",
  },
  {
    id: "newjoiner",
    label: "About New Joiner",
    icon: <Users className="w-5 h-5" />,
    message: "Hello, I am a new joiner and need some guidance.",
  },
];

const whatsappBase = "https://wa.me/9779700164201?text=";

const CustomerSupport: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("deposit");

  const activeData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4 relative">
      <ParticlesBackground />
    {/* Logo */}
        <div className="text-center mb-4 z-2 flex items-center justify-center">
          <Image src={logo} height={50} width={70} alt="logo" />
        </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10 bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Customer Support
        </h2>

        {/* Tabs */}
        <div className="flex justify-around mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 text-sm transition-all ${
                activeTab === tab.id
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="h-[2px] w-full bg-yellow-400 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeData?.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <p className="text-gray-300 mb-6 text-sm">
            Click below to get support on WhatsApp for{" "}
            <span className="text-yellow-400 font-medium">
              {activeData?.label}
            </span>
            .
          </p>

          <a
            href={`${whatsappBase}${encodeURIComponent(activeData?.message || "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold h-14 rounded-2xl shadow-lg transition-all duration-300">
              <MessageCircle className="mr-2 w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </a>
        </motion.div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-8"
          >
            Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerSupport;
