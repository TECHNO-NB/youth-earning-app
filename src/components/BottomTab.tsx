"use client";

import { Home, Coins, BookMarked, User, ClipboardCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BottomTab() {
  const router = useRouter();
  const pathName = usePathname();

  const tabs = [
    { name: "Home", icon: Home, key: "/home" },
    { name: "Task", icon: ClipboardCheck, key: "/task" },
    { name: "Level", icon: BookMarked, key: "/level" },
    { name: "Income", icon: Coins, key: "/income" },
    { name: "Me", icon: User, key: "/me" },
  ];

  const handleTabClick = (tab: any) => {
    router.push(tab.key);
  };

  // Parent staggered animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { staggerChildren: 0.1, ease: "easeOut" } 
    },
  };

  const tabVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-black border-t shadow-md z-50 md:w-[40%] md:left-[30%] md:rounded-4xl"
      initial="hidden"
      animate="visible"
      // @ts-ignore
      variants={containerVariants}
    >
      <div className="flex justify-between relative">
        {tabs.map((tab, index) => {
          const isActive = pathName === tab.key;
          const IconComponent = tab.icon;

          return (
            <motion.button
              key={tab.key}
              // @ts-ignore
              variants={tabVariants} // child will animate via container
              onClick={() => handleTabClick(tab)}
              className="flex flex-col items-center justify-center flex-1 py-2 relative"
            >
              <motion.div
                animate={{ rotate: isActive ? [0, 15, -15, 0] : 0 }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent
                  size={24}
                  stroke={isActive ? "#FACC15" : "#fff"} // color works correctly
                />
              </motion.div>

              <motion.span
                className="text-sm mt-1"
                style={{ color: isActive ? "#FACC15" : "#fff" }}
              >
                {tab.name}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
