"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import vip from "../../../public/vip.png";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/Background";
import { useSelector } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Page = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const [packages, setPackages] = useState<any[]>([]);

  // random color palettes
  const colorCombos = [
    { bg: "from-blue-900 to-blue-700", btn: "bg-blue-500 text-white hover:bg-blue-600" },
    { bg: "from-green-900 to-green-700", btn: "bg-green-500 text-white hover:bg-green-600" },
    { bg: "from-purple-900 to-purple-700", btn: "bg-yellow-500 text-black hover:bg-yellow-600" },
    { bg: "from-red-900 to-red-700", btn: "bg-red-500 text-white hover:bg-red-600" },
    { bg: "from-pink-900 to-pink-700", btn: "bg-pink-500 text-white hover:bg-pink-600" },
    { bg: "from-indigo-900 to-indigo-700", btn: "bg-indigo-500 text-white hover:bg-indigo-600" },
    { bg: "from-cyan-900 to-cyan-700", btn: "bg-cyan-500 text-black hover:bg-cyan-600" },
  ];

  useEffect(() => {
    const fetchAllPkg = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-packages`);
        const data = res.data.data || [];

        // assign random colors
        const randomized = data.map((pkg: any) => {
          const color = colorCombos[Math.floor(Math.random() * colorCombos.length)];
          return {
            ...pkg,
            bgColor: color.bg,
            btnColor: color.btn,
          };
        });

        setPackages(randomized);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch packages");
      }
    };
    fetchAllPkg();
  }, []);

  const handleClick = async (amount: any, level: any) => {
    if (!amount || !level) return;
    try {
      const completedRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/upgrade-package/${user.id}`,
        { amount, level },
        { withCredentials: true }
      );

      if (completedRes.data.status === 200) {
        toast.success("Upgrade package successfully!");
      }
    } catch (error) {
      router.push("/deposit");
      toast.error("Error! please deposit more amount");
    }
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-10 px-4 mb-8 relative">
      <ParticlesBackground />
      <div className="flex z-2 items-center mb-6 gap-2">
        <Button
          onClick={() => router.push("/home")}
          variant="ghost"
          size="icon"
          className="text-white mr-2 border border-gray-700 hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl text-white font-bold">Employee Level</h1>
      </div>

      <motion.div
        className="grid z-2 grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg._id || index}
            className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
            // @ts-ignore
            variants={cardVariants}
          >
            <div className={`bg-gradient-to-br ${pkg.bgColor} relative rounded-2xl`}>
              {/* VIP Badge Image */}
              {pkg.isVip && (
                <motion.div
                  className="absolute -top-0 left-1/2 transform -translate-x-1/2 w-20 h-20"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  <Image src={vip} alt="vip" width={80} height={80} className="rounded-full shadow-lg" />
                </motion.div>
              )}

              <div className="px-6 pt-16 pb-4 text-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold">{pkg.level}</h2>
                  <p className="text-xl font-semibold">{pkg.deposit.toLocaleString()} NPR</p>
                </div>

                <div className="flex justify-between bg-white text-black rounded-lg px-4 py-2 mb-4 shadow-inner">
                  <p>
                    Per Task: <span className="font-semibold">₹{pkg.perTask}</span>
                  </p>
                  <p>
                    Daily Task: <span className="font-semibold">{pkg.dailyTask}</span>
                  </p>
                </div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  <Button
                    onClick={() => handleClick(pkg.deposit, pkg.level)}
                    className={`w-full ${pkg.btnColor} rounded-xl ${
                      user.package === pkg.level ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={user.package === pkg.level}
                  >
                    {user.package === pkg.level ? "Active" : "Join Now"}
                  </Button>
                </motion.div>
              </div>

              {pkg.isVip && (
                <motion.div
                  className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1, type: "spring" }}
                >
                  VIP
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Page;
