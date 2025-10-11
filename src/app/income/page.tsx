"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, Zap } from "lucide-react";
import ParticlesBackground from "@/components/Background";

// ---------------- DATA ----------------
const LEVEL_PACKAGES = [
  { id: 1, name: "Y1", amount: 500 },
  { id: 2, name: "Y2", amount: 2000 },
  { id: 3, name: "Y3", amount: 6000 },
  { id: 4, name: "Y4", amount: 15000 },
  { id: 5, name: "Y5", amount: 45000 },
  { id: 6, name: "Y6", amount: 120000 },
  { id: 7, name: "Y7", amount: 190000 },
  { id: 8, name: "Y8", amount: 240000 },
  { id: 9, name: "Y9", amount: 350000 },
  { id: 10, name: "Y10", amount: 510000 },
];
const DAILY_RETURN_RATE = "3%";

const COMPOUNDING_PACKAGES = [
  { buy: 1500, duration: "120 days", dailyReturn: "Rs 45 / day", totalReturn: 5400 },
  { buy: 4000, duration: "120 days", dailyReturn: "Rs 100 / day", totalReturn: 12000 },
  { buy: 10000, duration: "120 days", dailyReturn: "Rs 170 / day", totalReturn: 22100 },
  { buy: 30000, duration: "120 days", dailyReturn: "Rs 400 / day", totalReturn: 52100 },
  { buy: 80000, duration: "120 days", dailyReturn: "Rs 850 / day", totalReturn: 110500 },
  { buy: 150000, duration: "120 days", dailyReturn: "Rs 1500 / day", totalReturn: 195000 },
  { buy: 400000, duration: "120 days", dailyReturn: "Rs 4000 / day", totalReturn: 520000 },
];

// ---------------- CARD COMPONENT ----------------
interface PackageProps {
  id: number;
  name: string;
  amount: number;
}

const PackageCard: React.FC<PackageProps> = ({ id, name, amount }) => (
  <motion.div
  className=" z-2"
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: id * 0.05 }}
  >
    
    <Card className="bg-[#0f0f0f] z-2 border border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all duration-300 rounded-2xl shadow-lg backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-blue-400">
          {name} <span className="text-gray-400 text-sm">(Lvl {id})</span>
        </CardTitle>
        <Badge className="bg-blue-500/10 text-blue-400 border border-blue-400/30">
          <Zap className="h-4 w-4 mr-1" />
          Active
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-4xl font-extrabold text-white">
          Rs {amount.toLocaleString("en-IN")}
        </div>

        <div className="space-y-3 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
              Min. Investment
            </span>
            <span className="font-semibold text-white">
              Rs {amount.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
              Daily Return
            </span>
            <span className="font-semibold text-green-400">{DAILY_RETURN_RATE}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ---------------- MAIN PAGE ----------------
export default function DashboardPage() {
  return (
    <>
    <ParticlesBackground/>
    <div className="min-h-screen z-2 bg-black text-white py-12 px-6 mb-10">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="text-3xl z-2 md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Income Packages Overview
        </h1>
        <p className="text-gray-400 z-4 mt-3 text-lg">
          Explore our levels and compounding investment opportunities.
        </p>
      </motion.header>

      {/* Levels Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl z-4 relative font-bold mb-8 text-blue-400"
        >
          Package Levels (Y1 - Y10)
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid  z-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {LEVEL_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} {...pkg} />
          ))}
        </motion.div>
      </section>

      <Separator className="my-16 bg-gray-800" />

      {/* Compounding Packages Section */}
      <section>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl font-bold mb-8 text-blue-400"
        >
          Compounding Income Packages
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-4 overflow-x-auto shadow-lg shadow-blue-500/10"
        >
          <Table>
            <TableCaption className="text-gray-500 pt-4">
              Compounding packages have  z-2a fixed 120-day duration.
            </TableCaption>
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-transparent">
                <TableHead className="text-blue-400">Buy (₹)</TableHead>
                <TableHead className="text-blue-400">Duration</TableHead>
                <TableHead className="text-blue-400">Daily Return</TableHead>
                <TableHead className="text-blue-400 text-right">
                  Total Return (₹)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPOUNDING_PACKAGES.map((pkg, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-500/10 transition-all border-gray-800"
                >
                  <TableCell className="font-semibold text-white">
                    ₹ {pkg.buy.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-gray-400">{pkg.duration}</TableCell>
                  <TableCell className="text-green-400 font-medium">
                    {pkg.dailyReturn}
                  </TableCell>
                  <TableCell className="text-right font-bold text-white">
                    ₹ {pkg.totalReturn.toLocaleString("en-IN")}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      Rs 
      </section>
    </div>
    </>
  );
}
