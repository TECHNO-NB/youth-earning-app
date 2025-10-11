"use client";

import React from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "@/components/Background";

const Page: React.FC = () => {
  const services = [
    {
      title: "Earn Through Compounding System",
      description:
        "Invest in our compounding system and watch your earnings grow automatically every day.",
    },
    {
      title: "Buy Packages & Earn",
      description:
        "Purchase different earning packages and maximize your daily income.",
    },
    {
      title: "Watch Videos & Spin Lucky Wheel",
      description:
        "Watch short videos and spin the lucky wheel to win instant rewards and bonuses.",
    },
    {
      title: "Referral & Earn",
      description:
        "Invite friends to join Youth Earning App and earn commissions from their activity.",
    },
  ];

  const team = ["John Doe", "Jane Smith", "Alice Johnson"];

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans mb-10">
      {/* Hero Section */}
      <ParticlesBackground/>
      <motion.section
        className="relative  w-full h-[40vh] flex flex-col items-center justify-center bg-gradient-to-r from-purple-800 via-indigo-900 to-black text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl z-2 md:text-6xl font-extrabold mb-4 text-yellow-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Youth Earning App
        </motion.h1>
        <motion.p
          className="text-lg z-2 md:text-xl text-gray-200 max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          The ultimate platform to earn, invest, and grow. Explore multiple ways to earn daily, from compounding systems to referral bonuses and fun lucky wheel spins.
        </motion.p>
      </motion.section>

      {/* About Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-10 py-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl z-2 font-bold mb-6 text-yellow-400 text-center">
          About Youth Earning App
        </h2>
        <p className="text-gray-300 z-2 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          Youth Earning App is designed to help users earn money in multiple
          ways: automated compounding, package purchases, watching videos, spinning the lucky wheel, and referring friends. We empower young individuals to generate income conveniently and securely.
        </p>
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="bg-gray-800 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 text-center">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                className="bg-gray-700 rounded-2xl p-8 text-center shadow-lg hover:scale-105 transform transition-transform"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-yellow-300">
                  {service.title}
                </h3>
                <p className="text-gray-300">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="max-w-6xl mx-auto px-6 md:px-10 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-yellow-400 text-center">
          Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((name, i) => (
            <motion.div
              key={i}
              className="bg-gray-700 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transform transition-transform"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <div className="w-24 h-24 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-xl font-bold">
                {name.split(" ").map((n) => n[0]).join("")}
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-gray-300">Team Member</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        className="bg-gray-800 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto text-center px-6 md:px-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-400">
            Contact Us
          </h2>
          <p className="text-gray-300 mb-6">
            Reach out for collaboration, inquiries, or support.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-xl shadow-lg"
          >
            Get in Touch
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default Page;
