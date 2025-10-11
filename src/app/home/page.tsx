"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ChevronRight,
  BanknoteArrowUp,
  HandCoins,
  Users,
  BookOpen,
  Building2,
  Gift,
  PiggyBank,
  Headphones,
} from "lucide-react";
import logo from "../../../public/logoyeapng.png";
import earnapp1 from "../../../public/earnapp1.webp";
import earnapp2 from "../../../public/earnapp2.webp";
import vip from "../../../public/vip.png";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import ParticlesBackground from "@/components/Background";

const images = [earnapp1, earnapp2, vip, earnapp1];

type VideoType = {
  _id: string;
  title: string;
  thumbnail: string;
  reward: number;
};

const Page = () => {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useSelector((state: any) => state.user);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-video`,
          { method: "GET" }
        );
        const data = await res.json();
        setVideos(data || []);
      } catch (error) {
        console.error("Failed to load videos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const otherFeatures = [
    { title: "Deposit", icon: <BanknoteArrowUp />, gradient: "from-green-400 to-green-600", link: "/deposit" },
    { title: "Withdraw", icon: <HandCoins />, gradient: "from-yellow-400 to-yellow-600",link:"/withdraw" },
    { title: "Company Profile", icon: <Building2 />, gradient: "from-blue-400 to-blue-600",link:"/companyprofile" },
    { title: "Add People", icon: <Users />, gradient: "from-pink-400 to-pink-600",link:"/addpeople" },
    { title: "Employee Handbook", icon: <BookOpen />, gradient: "from-purple-400 to-purple-600",link:"/employeehandbook" },
    { title: "Company Positions", icon: <Building2 />, gradient: "from-indigo-400 to-indigo-600",link:"/companypostions" },
    { title: "Spin Wheel", icon: <Gift />, gradient: "from-red-400 to-red-600", link: "/luckywheel" },
    { title: "Compounding", icon: <PiggyBank />, gradient: "from-orange-400 to-orange-600", link: "/componding" },
    { title: "Customer Service", icon: <Headphones />, gradient: "from-cyan-400 to-cyan-600" ,  link: "/customer-service"},
  ];

  return (
    <div className="bg-black min-h-screen p-4 text-white mb-16">
      <ParticlesBackground/>
      {/* Logo */}
      <motion.div
        className="w-full flex items-center justify-center mb-6 z-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image src={logo} alt="logo" height={70} width={70} />
      </motion.div>

      {/* Slider */}
      <div className="relative w-full h-64 overflow-hidden rounded-xl mb-8 z-2">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {images.map((img, index) => (
            <div key={index} className="min-w-full h-64 relative">
              <Image
                src={img}
                alt={`slide-${index}`}
                fill
                className="object-cover rounded-xl border-2 shadow-2xl shadow-amber-200"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Task Hall */}
      <motion.div
        className="flex justify-between px-3 border-b-2 mb-4 z-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-xl z-2 font-bold mb-2">Task Hall</h2>
        <h2
          onClick={() => router.push("/task")}
          className="text-xl font-bold mb-2 z-2 flex items-center cursor-pointer hover:text-blue-400"
        >
          {user.package} <ChevronRight />
        </h2>
      </motion.div>

      {/* Video Cards */}
      {loading ? (
        <p className="text-center text-gray-400 z-2">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-center text-gray-400 z-4">No videos found</p>
      ) : (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 z-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {videos.map((video) => (
            <motion.div
              key={video._id}
              onClick={() => router.push("/task")}
              className="bg-gray-800 rounded-xl z-2 overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative w-full h-40 z-2">
                <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg">{video.title}</h3>
                <p className="mt-2 font-semibold text-green-400">{video.reward} NPR</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Services */}
      <motion.div
        className="mt-8 z-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Services</h2>
        <div className="grid z-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {otherFeatures.map((val, i) => (
            <motion.div
              onClick={() => val.link && router.push(val.link)}
              key={i}
              className="flex flex-col z-2 items-center justify-center bg-gray-900 p-4 rounded-2xl shadow-md cursor-pointer hover:bg-gray-800 transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${val.gradient} rounded-full text-3xl text-white mb-2 shadow-lg`}
              >
                {val.icon}
              </div>
              <h1 className="text-sm font-medium text-center">{val.title}</h1>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
