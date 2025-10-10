"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, PackageX } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type PackageType = {
  _id: string;
  level: string;
  deposit: number;
  perTask: number;
  dailyTask: number;
  vip: boolean;
};

const AdminPackagesPage = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null);
  const [deletePackageId, setDeletePackageId] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch packages from server
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-packages`
      );
      setPackages(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Delete package
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/delete-packages/${deletePackageId}`
      );
      setPackages((prev) => prev.filter((pkg) => pkg._id !== deletePackageId));
      setDeletePackageId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit/Add package
  const confirmEdit = async (pkg: PackageType) => {
    try {
      if (pkg._id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/update-packages/${pkg._id}`,
          pkg
        );
        setPackages((prev) => prev.map((p) => (p._id === pkg._id ? pkg : p)));
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/add-packages`,
          pkg
        );
        setPackages((prev) => [...prev, data]);
      }
      setSelectedPackage(null);
      setAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-gray-100 mt-10 md:mt-0">
      {/* Header - always visible */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="md:text-3xl font-bold text-white">Packages Management</h1>
        <Button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setAddModalOpen(true)}
        >
          <Plus size={18} /> Add Package
        </Button>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">
          Loading packages...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20 text-red-500">
          {error || "Failed to load packages."}
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-gray-400 py-20">
          <PackageX size={50} className="mb-4 text-gray-500" />
          <p className="text-lg mb-4">No packages found</p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus size={16} /> Create First Package
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="p-5 rounded-xl bg-gray-900 hover:bg-gray-800 transition relative shadow-lg border border-gray-800"
            >
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => setSelectedPackage(pkg)}
                  className="text-blue-300 hover:text-white transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setDeletePackageId(pkg._id)}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h2 className="text-xl font-semibold mb-3 text-white">
                {pkg.level}
              </h2>
              <div className="text-gray-300 space-y-1">
                <p>💰 Deposit: {pkg.deposit}</p>
                <p>🧾 Per Task: {pkg.perTask}</p>
                <p>📅 Daily Task: {pkg.dailyTask}</p>
                <p>⭐ VIP: {pkg.vip ? "Yes" : "No"}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePackageId} onOpenChange={() => setDeletePackageId(null)}>
        <DialogContent className="sm:max-w-[400px] bg-gray-900 text-white border border-gray-700">
          <DialogHeader>
            <DialogTitle>Delete Package?</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this package? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="bg-gray-700 hover:bg-gray-600 text-gray-200"
              onClick={() => setDeletePackageId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Modal */}
      {(selectedPackage || addModalOpen) && (
        <EditPackageModal
          pkg={
            selectedPackage || {
              _id: "",
              level: "",
              deposit: 0,
              perTask: 0,
              dailyTask: 0,
              vip: false,
            }
          }
          onClose={() => {
            setSelectedPackage(null);
            setAddModalOpen(false);
          }}
          onConfirm={confirmEdit}
        />
      )}
    </div>
  );
};

export default AdminPackagesPage;

// --------------------
// Edit/Add Modal Component
// --------------------
type ModalProps = {
  pkg: PackageType;
  onClose: () => void;
  onConfirm: (pkg: PackageType) => void;
};

const EditPackageModal: React.FC<ModalProps> = ({ pkg, onClose, onConfirm }) => {
  const [formData, setFormData] = useState<PackageType>({ ...pkg });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg text-white w-96 border border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-white">
          {pkg._id ? "Edit Package" : "Add Package"}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            placeholder="Level"
            value={formData.level || ""}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            placeholder="Deposit"
            type="number"
            value={formData.deposit || ""}
            onChange={(e) => setFormData({ ...formData, deposit: Number(e.target.value) })}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            placeholder="Per Task"
            type="number"
            value={formData.perTask || ""}
            onChange={(e) => setFormData({ ...formData, perTask: Number(e.target.value) })}
          />
          <input
            className="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring focus:ring-blue-500"
            placeholder="Daily Task"
            type="number"
            value={formData.dailyTask || ""}
            onChange={(e) => setFormData({ ...formData, dailyTask: Number(e.target.value) })}
          />

          <label className="flex items-center gap-2 mt-2 text-gray-300">
            <input
              type="checkbox"
              checked={formData.vip}
              onChange={(e) => setFormData({ ...formData, vip: e.target.checked })}
            />
            VIP
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button
            variant="secondary"
            className="bg-gray-700 hover:bg-gray-600 text-gray-200"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => onConfirm(formData)}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
