"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSelector } from "react-redux";

type VideoTask = {
  _id: string;
  title: string;
  url: string;
  thumbnail: string;
  reward: number;
};

export default function WatchVideoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  const userId = user.id;

  const data = searchParams.get("data"); // ✅ must match what was sent
  const [video, setVideo] = useState<VideoTask | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(data));
        setVideo(decoded);
        console.log("Decoded video data:", decoded);
      } catch (error) {
        console.error("Error decoding video data:", error);
      }
    }
  }, [data]);

  const handleVideoEnd = async () => {
    if (!video) return;
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/update-daily-task-completed`,
        {
          videoId: video._id,
          reward: video.reward,
          userId,
        }
      );
      console.log("Successfully completed task")
    } catch (err) {
      console.error("Failed to update balance", err);
    }

    // ✅ Redirect back to tasks page
    router.push("/task");
  };

  if (!video) {
    return (
      <p className="text-center mt-10 text-white">
        Video not found or invalid data
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <video
        src={video.url}
        autoPlay
        poster={video.thumbnail}
        className="w-full max-w-3xl rounded-lg border h-68 shadow-lg"
        onEnded={handleVideoEnd}
      />

      <p className="mt-3 text-green-400 font-semibold">
        🎁 Reward: {video.reward} ₹
      </p>
      <p className="mt-2 text-gray-400">Watch full video to complete task</p>

      <Button
        onClick={() => router.push("/task")}
        className="mt-4 bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800"
      >
        Back to Tasks
      </Button>
    </div>
  );
}
