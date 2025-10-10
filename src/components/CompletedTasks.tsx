"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

type VideoTask = {
  _id: string;
  title: string;
  thumbnail: string;
  reward: number;
};

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState<VideoTask[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: any) => state.user);
  const userId = user?._id || user?.id;

  useEffect(() => {
    const fetchCompleted = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-completed-task/${userId}`,
          { withCredentials: true }
        );

        setCompletedTasks(res.data?.data?.completedTasks || []);
      } catch (err) {
        console.error("Error fetching completed tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompleted();
  }, [userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <p className="col-span-full text-center text-gray-400">Loading...</p>
      ) : completedTasks.length === 0 ? (
        <p className="col-span-full text-center text-gray-400">
          No completed videos yet.
        </p>
      ) : (
        completedTasks.map((task) => (
          <Card
            key={task._id}
            className="bg-gray-900 border border-gray-800 opacity-70"
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
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
