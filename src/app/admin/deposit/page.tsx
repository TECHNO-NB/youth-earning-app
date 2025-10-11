"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import ParticlesBackground from "@/components/Background";

type DepositRequest = {
  _id: string;
  paymentScreenshot: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "cancel";
  message: string;
  user: {
    _id: string;
    phone: string;
    totalAmount: number;
  };
  createdAt: string;
};

const AdminDepositPanel: React.FC = () => {
  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "cancel">(
    "pending"
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DepositRequest | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<
    "pending" | "approved" | "rejected" | "cancel"
  >("pending");
  const [updating, setUpdating] = useState(false);
  const user = useSelector((state: any) => state.user);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-allbalanceload`,
        { withCredentials: true }
      );
      setRequests(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleViewDetails = (req: DepositRequest) => {
    setSelectedRequest(req);
    setNewStatus(req.status);
    setModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedRequest) return;
    try {
      setUpdating(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-amount/${selectedRequest._id}`,
        { status: newStatus, userId: user.id },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Status updated");
        fetchRequests();
        setModalOpen(false);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const filteredRequests = requests.filter((r) =>
    activeTab === "pending"
      ? r.status === "pending"
      : activeTab === "approved"
      ? r.status === "approved"
      : r.status === "cancel"
  );

  return (
    <>
     <ParticlesBackground/>
    <div className="p-6 min-h-screen z-2 bg-gray-950 text-gray-100 mt-12 md:mt-0 ">
      <h1 className="text-2xl font-bold mb-6 text-white z-4">
        Deposit Requests Admin Panel
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 z-10">
        {["pending", "approved", "cancel"].map((tab) => (
          <button
          key={tab}
          onClick={() => setActiveTab(tab as any)}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === tab
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-10 z-4">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto relative z-2">
          <table className="w-full table-auto border-collapse border border-gray-700 shadow-md rounded-xl bg-gray-900 text-gray-100">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 border-b border-gray-700">User Phone</th>
                <th className="p-3 border-b border-gray-700">Requested Amount</th>
                <th className="p-3 border-b border-gray-700">Status</th>
                <th className="p-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-5 text-gray-400">
                    No requests
                  </td>
                </tr>
              )}
              {filteredRequests.map((req) => (
                <tr
                key={req._id}
                className="hover:bg-gray-800 transition-colors duration-150"
                >
                  <td className="p-3 border-b border-gray-700">{req.user.phone}</td>
                  <td className="p-3 border-b border-gray-700">{req.amount}</td>
                  <td className="p-3 border-b border-gray-700 capitalize">{req.status}</td>
                  <td className="p-3 border-b border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => handleViewDetails(req)}
                      className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
                      >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-gray-900 text-gray-100 border border-gray-700 rounded-xl">
          <DialogHeader>
            <DialogTitle>Deposit Details</DialogTitle>
            <DialogDescription>
              Review the deposit request and update status if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <p>
              <strong>User Phone:</strong> {selectedRequest?.user.phone}
            </p>
            <p>
              <strong>Requested Amount:</strong> {selectedRequest?.amount}
            </p>
            {selectedRequest?.paymentScreenshot && (
              <div>
                <strong>Payment Screenshot:</strong>
                <a
                  href={selectedRequest.paymentScreenshot}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={selectedRequest.paymentScreenshot}
                    alt="Screenshot"
                    width={300}
                    height={300}
                    className="rounded-md mt-2 border border-gray-700 object-contain"
                  />
                </a>
              </div>
            )}
            <div>
              <strong>Status:</strong>
              <Select
                value={newStatus}
                onValueChange={(val: any) => setNewStatus(val)}
              >
                <SelectTrigger className="w-full mt-2 bg-gray-800 text-gray-100 border border-gray-700">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-gray-100">
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancel">Cancel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="text-gray-200 border-gray-600 hover:bg-gray-700 hover:text-white"
              >
              Close
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              >
              {updating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
                </>
  );
};

export default AdminDepositPanel;
