"use client";
/* eslint-disable */

import React, { useRef, useState } from "react";
import {
  Upload,
  FileImage,
  Loader,
  AlertTriangle,
  TriangleAlert,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const RedeemPage = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [qrScreenshot, setQrScreenshot] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state: any) => state.user);

  const handleInputClick = () => fileRef.current?.click();

  const handleImageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrScreenshot(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleWithdraw = async () => {
    if (!amount || amount < 500 || amount > 33000) {
      toast.error("Amount must be between ₹500 and ₹33,000");
      return;
    }
    if (!qrScreenshot) {
      toast.error("Please upload your payment QR screenshot");
      return;
    }
    if (user.balance < amount) {
      toast.error("You don't have enough coins to withdraw");
      return;
    }

    try {
      setIsLoading(true);

      // prepare form data for backend
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("qrScreenshot", qrScreenshot);
      formData.append("amount", amount.toString());

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/withdraw`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success(
        res.data.message || "Withdraw request submitted successfully"
      );

      // reset UI
      setPreview(null);
      setQrScreenshot(null);
      setAmount(0);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit withdraw request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isInvalid =
    amount < 500 || amount > 33000 || amount > user.balance || !qrScreenshot;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-500">
          Withdraw Your Amount
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Upload your payment QR and enter the amount you wish to withdraw.
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 bg-red-900/20 border border-red-700 px-3 py-2 rounded-lg w-fit mx-auto">
          <TriangleAlert className="text-red-500" size={20} />
          <p className="text-red-400 text-sm font-medium">
            Make sure the amount is not less than ₹500 and not greater than
            ₹33,000
          </p>
        </div>
      </div>

      {/* Card Container */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-lg flex flex-col gap-6">
        {/* Image Preview */}
        <div className="border-2 border-dashed border-zinc-600 rounded-lg overflow-hidden">
          <div className="flex flex-col gap-2 items-center justify-center h-56 text-gray-400">
            {preview ? (
              <Image
                src={preview}
                width={200}
                height={180}
                alt="QR Preview"
                className="rounded-md object-contain"
              />
            ) : (
              <>
                <FileImage size={36} />
                <p>Your uploaded QR will appear here</p>
              </>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleInputClick}
          className="flex gap-2 bg-red-600 hover:bg-red-700 transition-all w-full items-center justify-center rounded-lg py-2 text-white font-semibold"
        >
          <Upload size={18} /> Upload QR
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageInput}
          className="hidden"
        />

        {/* Amount Input */}
        <div className="relative w-full">
          <p className="absolute -top-3 bg-zinc-900 left-4 px-2 rounded-xl text-sm text-gray-400">
            Coin Amount
          </p>
          <input
            onChange={(e) => setAmount(Number(e.target.value))}
            value={amount || ""}
            type="number"
            placeholder="Enter amount (min 500, max 33000)"
            className={`rounded-lg border-2 w-full px-4 py-2 font-semibold bg-zinc-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
              amount > user.balance
                ? "border-red-600 focus:ring-red-600"
                : "border-zinc-700 focus:ring-blue-600"
            }`}
          />
        </div>

        {amount > user.balance && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
            <AlertTriangle size={18} /> You entered more than your available
            balance.
          </div>
        )}

        <button
          onClick={handleWithdraw}
          disabled={isInvalid || isLoading}
          className={`flex gap-2 w-full items-center justify-center rounded-lg py-2 font-semibold text-white transition-all ${
            isInvalid || isLoading
              ? "bg-blue-800/50 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            "Withdraw Amount"
          )}
        </button>
      </div>
    </div>
  );
};

export default RedeemPage;
