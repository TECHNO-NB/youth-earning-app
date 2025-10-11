"use client";
/* eslint-disable */
import { addUser, userState } from "@/redux/userSlice";
import axios from "axios";
import { Loader } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function VerifyUser() {
  const dispatch = useDispatch();
  const userData = useSelector((state: any) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      if (!userData || !userData.id) {
        try {
          axios.defaults.withCredentials = true;

          const token = localStorage.getItem("token");

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/verify-user`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data.success) {
            setIsLoading(false);

            const userData: userState = {
              id: res.data.data._id,
              phone: res.data.data.phone,
              package: res.data.data.package,
              depositeAmount: res.data.data.depositeAmount,
              referralUsedCount: res.data.data.referralUsedCount,
              totalAmount: res.data.data.totalAmount,
              referralCode: res.data.data.referralCode,
              referralEarned: res.data.data.referralEarned,
              dailyIncome: res.data.data.dailyIncome,
              compoundDays: res.data.data.compoundDays,
              role: res.data.data.role,
              fullName: res.data.data.fullName || "",
              avatar: res.data.data.avatar || "",
              bankAccount: res.data.data.bankAccount || 0,
              esewaNumber: res.data.data.esewaNumber || 0,
            };
            dispatch(addUser(userData));
            toast.success(`Welcome back`);
          }
        } catch (error) {
          console.log(error);

          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50  flex items-center justify-center">
        <Loader color="yellow" size={50} className=" animate-spin" />
      </div>
    );
  }
}
