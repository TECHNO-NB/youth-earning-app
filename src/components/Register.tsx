'use client'

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import logo from "../../public/yea-removebg-preview.png";
import Image from 'next/image';
import axios from 'axios';
import ParticlesBackground from './Background';
import toast from 'react-hot-toast';

const Register = () => {
  const router = useRouter();

  // Form state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Submit handler
  const handleRegister = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/register`, {
        phone,
        password,
        confirmPassword,
        referralCode: referralCode || undefined,
      });

      if (res.data) {
        router.push('/');
        toast.success("Register success")
      }
    } catch (err:any) {
      console.error(err);
      toast.error("Register error")
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-screen min-h-[100svh] flex items-center justify-center 
                    bg-gradient-to-tr from-purple-900 via-gray-900 to-black">
                      <ParticlesBackground/>
      <div className="w-full z-2 max-w-md bg-gradient-to-br from-gray-800/80 to-gray-900/80 
                      backdrop-blur-md rounded-3xl shadow-2xl p-10 sm:p-12">
        {/* Logo */}
        <div className="text-center mb-0 flex items-center justify-center">
          <Image src={logo} height={100} width={150} alt='logo' />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">
          <h2 className="text-2xl font-semibold text-white text-left">Register</h2>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 text-gray-300 font-medium">Phone</label>
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
            <label htmlFor="password" className="mb-2 text-gray-300 font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg p-3 transition"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="con-password" className="mb-2 text-gray-300 font-medium">Confirm Password</label>
            <Input
              id="con-password"
              type="password"
              placeholder="Enter your password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg p-3 transition"
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="code" className="mb-2 text-gray-300 font-medium">Referral Code - Optional</label>
            <Input
              id="code"
              type="text"
              placeholder="Please enter the invitation code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="bg-transparent text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded-lg p-3 transition"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 cursor-pointer 
                       hover:from-pink-500 hover:to-purple-500 text-white 
                       py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>

          <p
            onClick={() => router.push("/")}
            className="text-center text-gray-400 hover:text-white cursor-pointer mt-2 mb-4"
          >
            Login
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
