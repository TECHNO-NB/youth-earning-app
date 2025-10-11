"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import profilepic from "../../../public/profile pic.webp";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import ParticlesBackground from "@/components/Background";
import { motion } from "framer-motion";
import { addUser, userState } from "@/redux/userSlice";
import toast from "react-hot-toast";

const Me: React.FC = () => {
  const dispatch = useDispatch();
  const userdata = useSelector((state: any) => state.user);
  const router = useRouter();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      setDeferredPrompt(null);
    });
  };

  const handleLogout = () => {
    const isConfirmed = confirm("Are you sure to logout?");
    if (isConfirmed) {
      const initialState: userState = {
        id: "",
        phone: 0,
        depositeAmount: 0,
        package: "",
        referralUsedCount: 0,
        totalAmount: 0,
        referralCode: "",
        referralEarned: 0,
        dailyIncome: 0,
        compoundDays: 0,
        role: "",
        fullName: "",
        avatar: "",
        bankAccount: 0,
        esewaNumber: 0,
      };
      dispatch(addUser(initialState));
      router.push("/");
      toast.success("Logout success");
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 sm:p-10 mb-14 relative">
      <ParticlesBackground />

      {/* User Card */}
      <motion.div
        className="w-full z-2 max-w-md bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <div className="flex relative flex-col items-center">
          {/* Avatar */}
          <Button
            onClick={handleLogout}
            className=" absolute -top-4 left-58 bg-red-600 cursor-pointer"
          >
            Logout
          </Button>
          <motion.div
            className="w-24 h-24  rounded-full overflow-hidden mb-4 border-4 border-purple-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Image
              src={userdata?.avatar || profilepic}
              alt="User Avatar"
              width={96}
              height={96}
              className="object-cover"
            />
          </motion.div>

          {/* Name and Info */}
          <h2 className="text-2xl font-bold">{userdata?.fullName || "User"}</h2>
          <p className="text-gray-400">{userdata?.phone}</p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="px-3 py-1 bg-purple-700 rounded-full text-sm font-semibold">
              {userdata?.package}
            </span>
            <span className="px-3 py-1 bg-gray-700 rounded-full text-sm font-medium">
              {userdata?.role}
            </span>
          </div>

          {/* Total Deposit */}
          <p className="mt-4 text-lg font-semibold">
            Total Deposit:{" "}
            <span className="text-green-400">
              ₹{userdata?.depositeAmount || 0}
            </span>
          </p>
          {userdata?.role === "admin" ? (
            <Button
              className="w-full bg-yellow-500 hover:bg-yellow-600 py-3 rounded-xl font-semibold"
              onClick={() => router.push("/admin/dashboard")}
            >
              GO to Admin Panel
            </Button>
          ) : null}
        </div>
      </motion.div>

      {/* Wallet Section */}
      <motion.div
        className="w-full z-2 max-w-md bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Wallet Balances */}
        <motion.div
          className="flex justify-between items-center"
          /* @ts-ignore */
          variants={cardVariants}
        >
          <div>
            <p className="text-gray-400 text-sm">Main Wallet</p>
            <p className="text-lg font-semibold text-green-400">
              ₹{userdata.totalAmount || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Commission Wallet</p>
            <p className="text-lg font-semibold text-green-400">
              ₹{userdata.referralEarned || 0}
            </p>
          </div>
        </motion.div>

        {/* Buttons */}
        {/* @ts-ignore */}
        <motion.div
          className="flex justify-between space-x-4"
          // @ts-ignore
          variants={cardVariants}
        >
          <Button
            onClick={() => router.push("/deposit")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            Deposit
          </Button>
          <Button
            onClick={() => router.push("/withdraw")}
            className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
          >
            Withdraw
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="w-full z-2 max-w-md bg-gray-800 rounded-3xl shadow-xl p-[0.5rem] sm:p-8 mb-8 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 gap-4 p-0">
          {[
            {
              title: "Today's Income",
              value: userdata.dailyIncome || 0,
              color: "from-blue-700 via-blue-900 to-gray-800",
            },
            {
              title: "Total Deposit",
              value: userdata.depositeAmount || 0,
              color: "from-green-700 via-green-900 to-gray-800",
            },
            {
              title: "Commission Earned",
              value: userdata.referralEarned || 0,
              color: "from-pink-700 via-pink-900 to-gray-800",
            },
            {
              title: "Wallet Balance",
              value: userdata.totalAmount || 0,
              color: "from-yellow-700 via-yellow-900 to-gray-800",
            },
            {
              title: "Pending Withdrawal",
              value: userdata.totalAmount || 0,
              color: "from-indigo-700 via-indigo-900 to-gray-800",
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-br ${card.color} text-white rounded-xl shadow-lg p-6 min-h-[100px] hover:scale-105 transform transition duration-300`}
              // @ts-ignore
              variants={cardVariants}
            >
              <p className="text-sm text-gray-300">{card.title}</p>
              <p className="text-xl font-bold mt-2">{card.value} Rs</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Button
          onClick={() => router.push("/profile-settings")}
          className="w-full h-14 mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-2xl shadow-lg hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300"
        >
          Profile Settings ⚙️
        </Button>
      </motion.div>
    </div>
  );
};

export default Me;
