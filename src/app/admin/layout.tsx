
import React from "react";
import Sidebar from "@/components/Sidebar";



export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 
  return (
    
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-0 overflow-auto">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
}
