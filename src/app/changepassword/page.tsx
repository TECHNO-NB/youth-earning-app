"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import logo from "../../../public/logoyeapng.png";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ParticlesBackground from "@/components/Background";
import toast from "react-hot-toast";

const ChangePasswordPage = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id && user.role === "user") {
      router.push("/home");
    } else if (user.id && user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user]);

  // 🔹 Form states
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Handle form submit
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!phone || !oldPassword || !newPassword) {
      toast.error("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/change-password`,
        {
          phone,
          oldPassword,
          newPassword,
        },
        { withCredentials: true }
      );

      toast.success("Password changed successfully!");
      setPhone("");
      setOldPassword("");
      setNewPassword("");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Password change failed!");
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-[100svh] overflow-hidden flex items-center justify-center bg-gradient-to-tr from-purple-900 via-gray-900 to-black">
      <ParticlesBackground />
      <div className="w-full max-w-md z-10 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
        {/* Logo */}
        <div className="text-center mb-2 flex items-center justify-center">
          <Image src={logo} height={50} width={70} alt="logo" />
        </div>

        {/* Form */}
        <form onSubmit={handleChangePassword} className="space-y-6">
          <h2 className="text-2xl font-semibold text-white text-left mb-4">
            Change Password
          </h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Phone Field */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 text-gray-300 font-medium">
              Phone
            </label>
            <Input
              id="phone"
              type="number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-transparent text-white placeholder-white focus:ring-2 focus:ring-purple-500 rounded-lg p-3 transition"
            />
          </div>

          {/* Old Password */}
          <div className="flex flex-col">
            <label
              htmlFor="oldPassword"
              className="mb-2 text-gray-300 font-medium"
            >
              Old Password
            </label>
            <Input
              id="oldPassword"
              type="password"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="bg-transparent text-white placeholder-white focus:ring-2 focus:ring-purple-500 rounded-lg p-3 transition"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col">
            <label
              htmlFor="newPassword"
              className="mb-2 text-gray-300 font-medium"
            >
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="bg-transparent text-white placeholder-white focus:ring-2 focus:ring-purple-500 rounded-lg p-3 transition"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg transition-all cursor-pointer"
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>

          <p
            onClick={() => router.push("/")}
            className="text-center text-gray-400 hover:text-white cursor-pointer mt-4"
          >
            Back to Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
