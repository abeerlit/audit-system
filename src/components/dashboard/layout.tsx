"use client";
import Sidebar from "./sidebar";
import axios from "axios";
import { useEffect } from "react";
import { addUsers } from "@/store/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
import { User } from "@/store/slices/userSlice";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // load users if user is admin
  const dispatch = useDispatch();
  const userData: User = useSelector(
    (state: RootState) => state.user
  );
  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/admin");
      dispatch(addUsers(response.data?.users))
      console.log("getAllUsers response", response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  useEffect(() => {
    // userData.role == "admin"
    if (userData) {
      getAllUsers();
    }
  }, [userData.role]);

  return (
    <div className="flex min-h-screen max-h-screen overflow-auto">
      {/* sidebar */}
      <div className="min-w-[230px] max-sm:min-w-[100px]">
        <Sidebar />
      </div>
      {/* pathname content */}
      <div className="w-full lg:space-y-6 space-y-4 lg:p-6 p-4 bg-[#F4F7FE] overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
