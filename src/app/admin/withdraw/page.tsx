"use client";
/* eslint-disable */

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import ParticlesBackground from "@/components/Background";

type Withdraw = {
  _id: string;
  amount: number;
  status: string;
  qrScreenshot: string;
  message: string;
  createdAt: string;
  user: {
    _id: string;
    phone: number;
    role: string;
  };
};

const WithdrawAdminPage = () => {
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Withdraw | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchWithdraws = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-withdraw`,
        { withCredentials: true }
      );
      setWithdraws(res.data.withdraws || []);
    } catch (error) {
      toast.error("Failed to fetch withdraw requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const handleStatusUpdate = async () => {
    if (!selected || !statusToUpdate) return toast.error("Select status first!");
    try {
      setIsUpdating(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-withdraw-status`,
        {
          withdrawId: selected._id,
          status: statusToUpdate,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setSelected(null);
      setStatusToUpdate("");
      fetchWithdraws();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDownload = (url: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "qr_screenshot.jpg";
    link.target = "_blank";
    link.click();
  };

  const filteredWithdraws = (status: string) =>
    withdraws.filter((w) => w.status === status);

  return (
    <div className="min-h-screen bg-black text-white p-6 mt-12">
    <ParticlesBackground/>
      <h1 className="text-3xl  z-4 font-bold text-blue-500 mb-6">
        Withdraw Management
      </h1>

      {loading ? (
        <div className="flex z-4 justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <Tabs defaultValue="pending" className="w-full z-4">
          <TabsList className="bg-zinc-900 border border-zinc-800 mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status}>
              {filteredWithdraws(status).length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No {status} withdraw requests
                </p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredWithdraws(status).map((w) => (
                    <Card
                      key={w._id}
                      className="bg-zinc-900 border border-zinc-800 text-white"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center z-2">
                          <span>Rs {w.amount}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              w.status === "approved"
                                ? "bg-green-700/40 text-green-400"
                                : w.status === "rejected"
                                ? "bg-red-700/40 text-red-400"
                                : "bg-yellow-700/40 text-yellow-300"
                            }`}
                          >
                            {w.status}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <p>
                          <strong>Phone:</strong> {w.user?.phone || "N/A"}
                        </p>
                        <p>
                          <strong>Role:</strong> {w.user?.role || "N/A"}
                        </p>
                        <p>
                          <strong>Date:</strong>{" "}
                          {new Date(w.createdAt).toLocaleString()}
                        </p>

                        {/* QR Image */}
                        <div className="mt-3 border border-zinc-800 rounded-lg overflow-hidden">
                          <Image
                            src={w.qrScreenshot}
                            alt="QR Screenshot"
                            width={400}
                            height={200}
                            className="w-full h-48 object-contain"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-blue-700 hover:bg-blue-800"
                            onClick={() => setSelected(w)}
                          >
                            <Eye size={16} className="mr-1" /> Change Status
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-zinc-800 hover:bg-zinc-700"
                            onClick={() => handleDownload(w.qrScreenshot)}
                          >
                            <Download size={16} className="mr-1" /> Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Modal for Status Change */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="bg-zinc-900 border border-zinc-800 text-white max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Change Withdraw Status</DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-sm mt-4">
                <p>
                  <strong>Phone:</strong> {selected.user?.phone}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{selected.amount}
                </p>
                <p>
                  <strong>Current Status:</strong>{" "}
                  <span className="capitalize">{selected.status}</span>
                </p>

                {/* Status Selection */}
                <div>
                  <label className="block mb-1 text-gray-300 text-sm">
                    Select New Status:
                  </label>
                  <select
                    className="w-full bg-zinc-800 border border-zinc-700 text-white p-2 rounded"
                    value={statusToUpdate}
                    onChange={(e) => setStatusToUpdate(e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <DialogFooter className="flex justify-between mt-6">
                <Button
                  variant="secondary"
                  className="bg-zinc-800 hover:bg-zinc-700"
                  onClick={() => setSelected(null)}
                >
                  <XCircle size={16} className="mr-1" /> Cancel
                </Button>
                <Button
                  className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                  onClick={handleStatusUpdate}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} /> Confirm
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WithdrawAdminPage;
