"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Home, Users, Package, Menu, X,Video,BanknoteArrowUp   } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5 mr-2" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="w-5 h-5 mr-2" /> },
    { href: "/admin/packages", label: "Packages", icon: <Package className="w-5 h-5 mr-2" /> },
    { href: "/admin/videos", label: "Videos", icon: <Video  className="w-5 h-5 mr-2" /> },
    {href: "/admin/deposit", label: "Deposit", icon: <BanknoteArrowUp   className="w-5 h-5 mr-2" /> },
    {href: "/admin/withdraw", label: "Withdraw", icon: <BanknoteArrowUp   className="w-5 h-5 mr-2" /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 fixed top-0 left-0 right-0 z-50 border-l-2 border-b">
        <span className="font-bold text-lg">Admin Panel</span>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-900 text-white z-50
          w-full max-w-xs md:w-64 border-r-2
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-full
        `}
      >
        {/* Desktop Header */}
        <div className="p-4 text-xl font-bold border-b border-gray-800 hidden md:block">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center p-2 rounded hover:bg-gray-700"
              onClick={() => setIsOpen(false)} // close menu on mobile
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
