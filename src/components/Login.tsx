"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import logo from "../../public/yea-removebg-preview.png";
import Image from "next/image";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ParticlesBackground from "./Background";
import { addUser, userState } from "@/redux/userSlice";
import toast from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id && user.role === "user") {
      router.push("/home");
    } else if (user.id && user.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [user, user.id]);

  // Form state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submit handler
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/login`,
        {
          phone,
          password,
        },
        { withCredentials: true }
      ); // include cookies

      if (res.data.success) {
        const userData: userState = {
          id: res.data.data.user._id,
          phone: res.data.data.user.phone,
          package: res.data.data.user.package,
          depositeAmount: res.data.data.user.depositeAmount,
          referralUsedCount: res.data.data.user.referralUsedCount,
          totalAmount: res.data.data.user.totalAmount,
          referralCode: res.data.data.user.referralCode,
          referralEarned: res.data.data.user.referralEarned,
          dailyIncome: res.data.data.user.dailyIncome,
          compoundDays: res.data.data.user.compoundDays,
          role: res.data.data.user.role,
        };
        localStorage.setItem("token",res.data.data.token)
        dispatch(addUser(userData));
         
        router.push("/home");
        toast.success("Login success")
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Login Error")
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-w-screen min-h-[100svh] overflow-hidden overflow-y-hidden flex items-center justify-center 
                    bg-gradient-to-tr from-purple-900 via-gray-900 to-black"
    >
      <ParticlesBackground />
      <div
        className="w-full max-w-md z-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                      backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12"
      >
        {/* Logo */}
        <div className="text-center mb-0 flex items-center justify-center">
          <Image src={logo} height={100} width={150} alt="logo" />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <h2 className="text-2xl font-semibold text-white text-left">Login</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

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
              className="bg-transparent text-white placeholder-white focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg p-3 transition"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-2 text-gray-300 font-medium"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg p-3 transition"
            />
          </div>

          <div className="flex items-center space-x-2 text-gray-300">
            <input type="checkbox" className="accent-purple-500 w-4 h-4" />
            <span className="text-gray-300">Remember Username/Password</span>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer 
                       hover:from-pink-500 hover:to-purple-500 text-white 
                       py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p
            onClick={() => router.push("/register")}
            className="text-center text-gray-400 hover:text-white cursor-pointer mt-4"
          >
            Register
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
