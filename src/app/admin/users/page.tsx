"use client";

import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import axios from "axios";

import ParticlesBackground from "@/components/Background";

type UserType = {
  _id: string;
  phone: string;
  referralCode: string;
  referralUsedCount: number;
  totalAmount: number;
  depositeAmount: number;
  role: "user" | "admin";
  package: string;
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [roleChangeUser, setRoleChangeUser] = useState<UserType | null>(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/get-allusers`
      );
      setUsers(data.data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Confirm role change
  const confirmRoleChange = async () => {
    if (!roleChangeUser) return;

    try {
      const updatedRole = roleChangeUser.role === "user" ? "admin" : "user";
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/change-role/${roleChangeUser._id}`,
        { role: updatedRole }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user._id === roleChangeUser._id ? { ...user, role: updatedRole } : user
        )
      );
      setRoleChangeUser(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Confirm delete
  const confirmDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/delete-user/${deleteUserId}`
      );
      setUsers((prev) => prev.filter((user) => user._id !== deleteUserId));
      setDeleteUserId(null);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-gray-100 mt-12">
      <ParticlesBackground/>
      <h1 className="text-3xl z-2 font-bold mb-6 text-white">All Users</h1>

      {/* Table */}
      <div className="overflow-x-auto  relative z-2 bg-gray-950">
        <table className="min-w-full border border-gray-700 rounded">
          <thead className="bg-gray-800 text-gray-200 z-2">
            <tr className=" relative z-2">
              <th className="p-3 z-2 border border-gray-700">Phone</th>
              <th className="p-3 z-2 border border-gray-700">Referral Code</th>
              <th className="p-3 z-2 border border-gray-700">Used</th>
              <th className="p-3 z-2 border border-gray-700">Total</th>
              <th className="p-3 z-2 border border-gray-700">Deposit</th>
              <th className="p-3 z-2 border border-gray-700">Role</th>
              <th className="p-3 z-2 border border-gray-700">Package</th>
              <th className="p-3 z-2 border border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-6 z-2 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="text-center hover:bg-gray-800">
                  <td className="p-2 border border-gray-700">{user.phone}</td>
                  <td className="p-2 border border-gray-700">{user.referralCode}</td>
                  <td className="p-2 border border-gray-700">{user.referralUsedCount}</td>
                  <td className="p-2 border border-gray-700">{user.totalAmount}</td>
                  <td className="p-2 border border-gray-700">{user.depositeAmount}</td>
                  <td className="p-2 border border-gray-700">
                    <button
                      className={`px-2 py-1 rounded text-white ${
                        user.role === "admin"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                      onClick={() => setRoleChangeUser(user)}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="p-2 border border-gray-700">{user.package}</td>
                  <td className="p-2 border border-gray-700">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setDeleteUserId(user._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white w-80 border border-gray-700">
            <h2 className="text-lg font-bold mb-4">Delete User?</h2>
            <p className="mb-4 text-gray-300">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setDeleteUserId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                onClick={confirmDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {roleChangeUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg text-white w-80 border border-gray-700">
            <h2 className="text-lg font-bold mb-4">Change Role?</h2>
            <p className="mb-4 text-gray-300">
              Are you sure you want to change <span className="font-bold">{roleChangeUser.phone}</span>’s role from{" "}
              <span className="font-bold">{roleChangeUser.role}</span> to{" "}
              <span className="font-bold">{roleChangeUser.role === "user" ? "admin" : "user"}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                onClick={() => setRoleChangeUser(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                onClick={confirmRoleChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
