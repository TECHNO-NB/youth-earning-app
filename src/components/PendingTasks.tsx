"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

type VideoTask = {
  _id: string;
  title: string;
  url: string;
  thumbnail: string;
  reward: number;
  description?: string;
};

export default function PendingTasks() {
  const [pendingTasks, setPendingTasks] = useState<VideoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const token=localStorage.getItem("token");
    const fetchPending = async () => {
      if (!userId) return;
      try {
        setLoading(true);

        // ✅ Fetch daily tasks
        const dailyRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-daily-task`,
          {},
           {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ auth token
            },
            withCredentials: true, // ✅ include cookies if needed
          }
        );

        const allTasks: VideoTask[] = Array.isArray(dailyRes.data.data)
          ? dailyRes.data.data
          : [];

        // ✅ Fetch completed task IDs (keep POST request)
        const completedRes = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-completed-task/${userId}`,
          {},
            {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ auth token
            },
            withCredentials: true, // ✅ include cookies if needed
          }
        );

        const completedIds = new Set(
          completedRes.data?.data?.taskCompletedToday?.map((v: any) => v._id)
        );

        const filtered = allTasks.filter((t) => !completedIds.has(t._id));
        setPendingTasks(filtered);
      } catch (err) {
        console.error("Error loading pending tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [userId]);

  const handleWatchVideo = (task: VideoTask) => {
    const query = encodeURIComponent(JSON.stringify(task));
    router.push(`/watch-video?data=${query}`);
  };

  return (
    <div className="min-h-screen relative z-10 bg-black text-white p-6 md:p-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="col-span-full text-center text-gray-400">Loading...</p>
        ) : pendingTasks.length === 0 ? (
          <div className="col-span-full flex flex-col items-center gap-3 text-center">
            <p className="text-gray-400">
              {user.package === "Y0"
                ? "Upgrade your package to complete tasks."
                : "No pending videos for today."}
            </p>

            {user.package === "Y0" && (
              <Button
                onClick={() => router.push("/level")}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-lg"
              >
                Upgrade Package
              </Button>
            )}
          </div>
        ) : (
          pendingTasks.map((task) => (
            <Card
              key={task._id}
              className="bg-gray-900 border border-gray-800 hover:border-purple-600 transition-all"
            >
              <div className="relative w-full h-40">
                <img
                  src={task.thumbnail}
                  alt={task.title}
                  className="object-cover w-full h-full rounded-t-xl"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-white">{task.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">
                  Reward: <span className="text-green-400">{task.reward} ₹</span>
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <Button
                    onClick={() => handleWatchVideo(task)}
                    className="w-full rounded-lg bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800"
                  >
                    Watch Full Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
