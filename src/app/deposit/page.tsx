"use client";
/* eslint-disable */

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Download,
  ImagePlus,
  Loader,
  TriangleAlert,
  Banknote,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import bankqr from "../../../public/bankqr.jpg";
import walletqr from "../../../public/walletqr.jpg";

const Page: React.FC = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [preview, setPreview] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [qrType, setQrType] = useState<"wallet" | "bank">("wallet");

  const handleClick = () => fileRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(uploadedFile);
    }
  };

  const loadBalance = async () => {
    try {
      setIsLoading(true);

      if (!amount || amount < 500) {
        setErrorMsg("Please enter a valid coin amount (minimum 500)");
        return;
      }

      if (!file) {
        setErrorMsg("Please upload payment screenshot");
        return;
      }

      const formData = new FormData();
      formData.append("amount", amount.toString());
      formData.append("paymentScreenshot", file);
      formData.append("userId", user?.id);

      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/deposit-balance`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        toast.success("Payment sent for verification");
        router.push("/me");
      } else {
        toast.error(res.data.message || "Load balance failed");
      }
    } catch (error: any) {
      console.error("Error on loadBalance:", error);
      toast.error(error?.response?.data?.message || "Load balance failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (file && amount >= 500) setErrorMsg("");
  }, [file, amount]);

  const currentQR = qrType === "wallet" ? walletqr : bankqr;

  return (
    <div className="min-h-screen w-full bg-[#0e0e0e] text-white flex flex-col items-center justify-start p-4 md:p-10 gap-6 mb-14">
      
      {/* Error Message */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-24 md:top-16 flex gap-3 border border-gray-700 bg-[#1a1a1a] px-4 py-2 rounded-2xl z-50"
        >
          <TriangleAlert color="red" size={20} />
          <h1 className="text-red-500">{errorMsg}</h1>
        </motion.div>
      )}

      {/* QR Type Switch */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 bg-[#1a1a1a] border border-gray-700 rounded-2xl p-3 w-full md:w-[40%] justify-center shadow-md"
      >
        <motion.button
          onClick={() => setQrType("wallet")}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            qrType === "wallet"
              ? "bg-green-500 text-black"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <Wallet size={18} /> Wallet QR
        </motion.button>

        <motion.button
          onClick={() => setQrType("bank")}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            qrType === "bank"
              ? "bg-blue-500 text-black"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          <Banknote size={18} /> Bank QR
        </motion.button>
      </motion.div>

      {/* Instruction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full md:w-[40%] border border-gray-700 bg-[#1a1a1a] rounded-2xl p-5 shadow-md"
      >
        <h1 className="font-semibold text-yellow-400 text-lg mb-2">
          Load Amount Using This {qrType === "wallet" ? "Wallet" : "Bank"} QR
        </h1>
        <div className="flex gap-3 items-center text-sm text-gray-300">
          <TriangleAlert color="red" size={20} />
          <p>Make sure the amount is not less than INR 500.</p>
        </div>
      </motion.div>

      {/* QR Image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full md:w-[40%] bg-[#1a1a1a] border border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center shadow-md"
      >
        <Image
          alt={`${qrType} QR`}
          src={currentQR}
          height={220}
          width={220}
          className="rounded-lg object-contain"
        />
        <p className="mt-3 text-gray-300 font-semibold text-sm text-center">
          {qrType === "wallet" ? "Wallet: Khalti" : "Bank: Global IME Bank"}
        </p>
      </motion.div>

      {/* Download QR */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.open(currentQR.src, "_blank")}
        className="w-full md:w-[40%] bg-red-600 hover:bg-red-700 transition-all py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-white shadow"
      >
        <Download size={20} /> Download {qrType === "wallet" ? "Wallet" : "Bank"} QR
      </motion.button>

      {/* Coin Input & Screenshot Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full md:w-[40%] bg-[#1a1a1a] border border-gray-700 rounded-2xl p-6 flex flex-col gap-5 shadow-md"
      >
        <div className="relative w-full">
          <label className="absolute -top-3.5 left-4 bg-[#1a1a1a] px-1 text-sm text-gray-300">
            Amount
          </label>
          <input
            type="number"
            min={500}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="500"
            className="w-full px-5 py-3 rounded-xl border-2 border-gray-700 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        <motion.div
          onClick={handleClick}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer w-full border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-400 transition"
        >
          {preview ? (
            <div className="mt-2 w-full">
              <Image
                src={preview}
                alt="Screenshot Preview"
                width={400}
                height={400}
                className="rounded-lg border border-gray-700 object-contain"
              />
            </div>
          ) : (
            <>
              <ImagePlus className="w-8 h-8 mb-2" />
              <p className="text-sm">Click to upload Payment Screenshot</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="hidden"
            onChange={handleInputChange}
          />
        </motion.div>

        <motion.button
          onClick={loadBalance}
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className={`w-full ${
            isLoading ? "bg-gray-700" : "bg-blue-600 hover:bg-blue-700"
          } transition-all py-3 rounded-xl flex items-center justify-center gap-2 font-semibold text-white shadow`}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" /> Loading...
            </>
          ) : (
            "Load Wallet"
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Page;
