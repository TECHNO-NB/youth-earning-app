"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Upload, Video, PlusCircle, Loader2 } from "lucide-react";
import axios from "axios";
import ParticlesBackground from "@/components/Background";

type VideoType = {
  _id: string;
  title: string;
  thumbnail: string;
  reward: number;
  url: string;
  description?: string;
};

const Page = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    reward: "",
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
  });

  // Fetch all videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/get-video`);
      setVideos(res.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Add new video
  const handleAddVideo = async () => {
    if (!form.title || !form.videoFile || !form.thumbnailFile) return alert("All fields required!");

    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("reward", form.reward);
    data.append("video", form.videoFile);
    data.append("thumbnail", form.thumbnailFile);

    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/videos/add-video`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchVideos();
      setForm({ title: "", description: "", reward: "", videoFile: null, thumbnailFile: null });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video");
    } finally {
      setLoading(false);
    }
  };

  // Delete video
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/videos/delete-video/${id}`);
      setVideos(videos.filter((v) => v._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen text-white mt-14 md:mt-0 mb-14">
      {/* Header */}
      <ParticlesBackground/>
      <div className="flex justify-between items-center mb-6 z-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 z-4">
          <Video className="text-blue-400" /> Video Management
        </h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-500 z-4 hover:bg-blue-600 text-white flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Video
        </Button>
      </div>

      {/* Video Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 z-4">
        {videos.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full z-4">No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <Card
              key={video._id}
              className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <CardHeader className="p-0">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-1">{video.title}</CardTitle>
                <p className="text-sm text-gray-400 mb-2">
                  Earning: <span className="text-green-400">Rs. {video.reward}</span>
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  className="text-blue-400 hover:underline text-sm"
                >
                  Watch Video
                </a>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(video._id)}
                    className="flex gap-1 items-center"
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Video Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex gap-2 items-center">
              <Upload className="text-blue-400" /> Upload New Video
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter video title"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter description"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Earning (Rs.)</label>
              <Input
                type="number"
                value={form.reward}
                onChange={(e) => setForm({ ...form, reward: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
                placeholder="Enter earning"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Thumbnail</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, thumbnailFile: e.target.files?.[0] || null })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Video File</label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setForm({ ...form, videoFile: e.target.files?.[0] || null })}
                className="bg-gray-800 border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <DialogFooter className="mt-5 flex justify-end">
            <Button
              onClick={handleAddVideo}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />}
              {loading ? "Uploading..." : "Add Video"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
