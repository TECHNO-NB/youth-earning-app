"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import PendingTasks from "@/components/PendingTasks";
import CompletedTasks from "@/components/CompletedTasks";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

export default function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const user =useSelector((state:any)=> state.user)

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 mb-14">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center mb-6"
      >
        <Button
          onClick={() => router.push("/home")}
          variant="ghost"
          size="icon"
          className="text-white mr-2 border border-gray-700 hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Task List</h1>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex gap-2 mb-6"
      >
        <Button
          onClick={() => setActiveTab("pending")}
          variant={activeTab === "pending" ? "default" : "outline"}
          className={`flex-1 rounded-xl ${
            activeTab === "pending"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "border-gray-700 text-gray-300 hover:bg-gray-800"
          }`}
        >
          Pending
        </Button>
        <Button
          onClick={() => setActiveTab("completed")}
          variant={activeTab === "completed" ? "default" : "outline"}
          className={`flex-1 rounded-xl ${
            activeTab === "completed"
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "border-gray-700 text-gray-300 hover:bg-gray-800"
          }`}
        >
          Completed
        </Button>
      </motion.div>

      {/* Content */}
      {/* @ts-ignore */}
      <AnimatePresence exitBeforeEnter>
        {activeTab === "pending" ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PendingTasks />
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CompletedTasks />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
