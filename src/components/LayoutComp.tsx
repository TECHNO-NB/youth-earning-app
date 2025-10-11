'use client'
import React from 'react';
import BottomTab from './BottomTab';
import { usePathname } from 'next/navigation';
import VerifyUser from './UserVerify';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';


const LayoutComp = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

    const path=usePathname()
    console.log(path)
  return (
    <div className="min-h-[100svh] flex flex-col">
      <Provider store={store}>

      {/* Main content */}
      <main className="flex-grow">
        <VerifyUser/>
        {children}</main>

      {/* Bottom navigation */}
    {path !== "/" && path !== "/register" && path !=="/changepassword" && !path.startsWith("/admin") && <BottomTab />}

      </Provider>

    </div>
  );
};

export default LayoutComp;
