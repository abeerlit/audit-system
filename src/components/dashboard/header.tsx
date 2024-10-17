import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HeaderProps {
  route?: string;
}

const Header: React.FC<HeaderProps> = ({ route }) => {
  return (
    <div className="flex gap-4 justify-between max-md:justify-start flex-wrap">
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

      <div className="flex items-center bg-white p-2 rounded-full space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            id="search"
            type="search"
            className="w-64 pe-2 ps-8 py-2 bg-[#F4F7FE] rounded-full focus:outline-none"
            placeholder="Search"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            width="11"
            height="12"
            viewBox="0 0 11 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="5" cy="5" r="4.3" stroke="#2B3674" strokeWidth="1.4" />
            <line
              x1="10.0101"
              y1="11"
              x2="8"
              y2="8.98995"
              stroke="#2B3674"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Notification Icon */}
          <div className="cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_105_3081)">
                <path
                  d="M19.2901 17.29L18.0001 16V11C18.0001 7.93 16.3601 5.36 13.5001 4.68V4C13.5001 3.17 12.8301 2.5 12.0001 2.5C11.1701 2.5 10.5001 3.17 10.5001 4V4.68C7.63005 5.36 6.00005 7.92 6.00005 11V16L4.71005 17.29C4.08005 17.92 4.52005 19 5.41005 19H18.5801C19.4801 19 19.9201 17.92 19.2901 17.29ZM16.0001 17H8.00005V11C8.00005 8.52 9.51005 6.5 12.0001 6.5C14.4901 6.5 16.0001 8.52 16.0001 11V17ZM12.0001 22C13.1001 22 14.0001 21.1 14.0001 20H10.0001C10.0001 21.1 10.8901 22 12.0001 22Z"
                  fill="#A3AED0"
                />
              </g>
              <defs>
                <clipPath id="clip0_105_3081">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Info Icon */}
          <div className="cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_105_3076)">
                <path
                  d="M11 7H13V9H11V7ZM12 17C12.55 17 13 16.55 13 16V12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12V16C11 16.55 11.45 17 12 17ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                  fill="#A3AED0"
                />
              </g>
              <defs>
                <clipPath id="clip0_105_3076">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {/* Profile Picture */}
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
