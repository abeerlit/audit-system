import Image from "next/image";
import Link from "next/link";
import React from "react";
import InfoIcon from "../icons/dashboard/header/info-icon";
import NotificationIcon from "../icons/dashboard/header/notification-icon";
import SearchIcon from "../icons/dashboard/header/search-icon";

interface HeaderProps {
  route?: string;
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {/* Breadcrumb */}
      <div>
        <div className="text-light-gray capitalize text-sm">
          {route && (
            <Link href="/dashboard" className="hover:underline">
              Home
            </Link>
          )}
          <span>{route ? " / " + route : "dashboard"}</span>
        </div>
        <div className="text-2xl font-bold text-auth-purple capitalize">
          {route ? route : "Main Dashboard"}
        </div>
      </div>

      <div className="flex items-center bg-white p-2 rounded-full space-x-2 w-full max-w-md ms-auto">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="search"
            className="w-full pe-2 ps-8 py-2 bg-[#F4F7FE] rounded-full focus:outline-none"
            placeholder="Search"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-2">
          <NotificationIcon className="w-6 h-6 cursor-pointer" />
          <InfoIcon className="w-6 h-6 cursor-pointer" />
          <Link href="/dashboard/profile" className="w-[50px]">
            <Image
              priority
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
              width={50}
              height={50}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
