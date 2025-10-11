"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useRouter } from "next/navigation";
import ParticlesBackground from "@/components/Background";
import { useSelector } from "react-redux";

type Package = {
  buy: number;
  duration: number;
  dailyReturn: number;
  totalReturn: number;
};

const packages: Package[] = [
  { buy: 1500, duration: 120, dailyReturn: 45, totalReturn: 5400 },
  { buy: 4000, duration: 120, dailyReturn: 100, totalReturn: 12000 },
  { buy: 10000, duration: 120, dailyReturn: 170, totalReturn: 22100 },
  { buy: 30000, duration: 120, dailyReturn: 400, totalReturn: 52100 },
  { buy: 80000, duration: 120, dailyReturn: 850, totalReturn: 110500 },
  { buy: 150000, duration: 120, dailyReturn: 1500, totalReturn: 195000 },
  { buy: 400000, duration: 120, dailyReturn: 4000, totalReturn: 520000 },
];

export default function Page() {
  const router = useRouter();
  const currentDate = new Date().toLocaleDateString();

  // ✅ Get user info directly from Redux store
  const user = useSelector((state: any) => state.user);

  const deposit = user?.depositeAmount || 0;
  const balance = user?.balance || user?.totalAmount || 0;
  const compoundDays = user?.compoundDays || 0;

  // Find matching package based on deposit
  const activePackage = packages
    .filter((pkg) => deposit >= pkg.buy)
    .sort((a, b) => b.buy - a.buy)[0];

  const userLevel = activePackage
    ? `Package ₹${activePackage.buy.toLocaleString()}`
    : "N/A";

  return (
    <>
      <ParticlesBackground />
      <div className="min-h-screen z-2 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6 mb-14">
        <div className="relative max-w-6xl z-2 mx-auto">
          {/* Header */}
          <div className="flex relative z-4 flex-col sm:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center sm:text-left">
              💰 Compounding Income Packages
            </h1>
            <div className="flex items-center gap-2 text-gray-300 mt-3 sm:mt-0">
              <CalendarDays className="w-5 h-5" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-gray-800 relative p-4 rounded-2xl mb-6 shadow-lg">
            <p>
              <span className="text-gray-400">Your Level:</span>{" "}
              <span className="text-yellow-400 font-semibold">{userLevel}</span>
            </p>
            <p>
              <span className="text-gray-400">Total Deposit:</span>{" "}
              <span className="text-blue-400 font-semibold">₹{deposit.toLocaleString()}</span>
            </p>
            <p>
              <span className="text-gray-400">Current Balance:</span>{" "}
              <span className="text-green-400 font-semibold">₹{balance.toFixed(2)}</span>
            </p>
            <p>
              <span className="text-gray-400">Compounded Days:</span>{" "}
              <span className="text-white font-semibold">{compoundDays}/120 days</span>
            </p>
          </div>

          {/* Packages */}
          <h2 className="text-2xl font-semibold mb-4">Available Packages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const isActive =
                deposit >= pkg.buy &&
                deposit < (packages.find((p) => p.buy > pkg.buy)?.buy || Infinity);

              return (
                <Card
                  key={pkg.buy}
                  className={`relative bg-gradient-to-br from-gray-800 to-gray-900 border ${
                    isActive
                      ? "border-yellow-400 shadow-yellow-500/40 shadow-lg"
                      : "border-gray-700"
                  } text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs rounded-md font-semibold shadow-md">
                      Your Active Package
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-yellow-400">
                      Rs{pkg.buy.toLocaleString()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-400">Duration:</span>{" "}
                      <span className="font-medium">{pkg.duration} days</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Daily Return:</span>{" "}
                      <span className="font-medium text-green-400">Rs{pkg.dailyReturn}</span>
                    </p>
                    <p>
                      <span className="text-gray-400">Total Return:</span>{" "}
                      <span className="font-medium text-blue-400">
                        Rs{pkg.totalReturn.toLocaleString()}
                      </span>
                    </p>
                    <Button
                      onClick={() => router.push("/deposit")}
                      className={`mt-3 w-full ${
                        isActive
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-500 text-black hover:bg-yellow-600"
                      }`}
                      disabled={isActive}
                    >
                      {isActive ? "Active" : "Buy Package"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
