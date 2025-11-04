"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import defaultAvatar from "../../../public/profile pic.webp";
import ParticlesBackground from "@/components/Background";
import { addUser, userState } from "@/redux/userSlice";

const ProfileSettings: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userdata = useSelector((state: any) => state.user);

  const [formData, setFormData] = useState({
    id:userdata?.id || "",
    fullName: userdata?.fullName || "",
    avatar: userdata?.avatar || "",
    bankAccount: userdata?.bankAccount || "",
    esewaNumber: userdata?.esewaNumber || "",

  });

  const [preview, setPreview] = useState<string>(
    formData.avatar || (defaultAvatar as unknown as string)
  );

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile
  const handleSave = async () => {
    try {
      axios.defaults.withCredentials = true;
      const token = localStorage.getItem("token");

      // Only include changed fields in the payload
      const payload: any = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key as keyof typeof formData] !== userdata[key]) {
          payload[key] = formData[key as keyof typeof formData];
        }
      });

      if (Object.keys(payload).length === 0) {
        toast("No changes to save");
        return;
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-profile`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const userDataNew: userState = {
          ...userdata,
          ...res.data.data, // merge only changed fields
        };
        dispatch(addUser(userDataNew));
        router.push("/me")
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.data.message || "Update failed!");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-2 bg-gray-800 rounded-3xl shadow-xl p-6 sm:p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Profile Settings
        </h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-500">
            <Image
              src={preview}
              alt="Avatar"
              width={112}
              height={112}
              className="object-cover w-full h-full"
            />
          </div>

          <label
            htmlFor="avatarUpload"
            className="mt-3 text-sm text-yellow-400 cursor-pointer hover:underline"
          >
            Change Avatar
          </label>
          <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400">Phone (Read-only)</label>
            <Input
              type="text"
              value={userdata?.phone || "XXXXXXXXX"}
              readOnly
              className="bg-gray-900 border-gray-700 text-white cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Full Name</label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Bank Account Number</label>
            <Input
              type="text"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleChange}
              placeholder="Enter your bank account number"
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              eSewa | Khalti Number
            </label>
            <Input
              type="text"
              name="esewaNumber"
              value={formData.esewaNumber}
              onChange={handleChange}
              placeholder="Enter your eSewa number"
              className="bg-gray-900 border-gray-700 text-gray-200"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            onClick={() => router.back()}
            className="bg-gray-700 hover:bg-gray-600 rounded-xl px-6 cursor-pointer"
          >
            Back
          </Button>
          <Button
            onClick={handleSave}
            className="bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer font-semibold rounded-xl px-6"
          >
            Save
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSettings;
