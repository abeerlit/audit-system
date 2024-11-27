"use client";
import Sidebar from "./sidebar";
import axios from "axios";
import { useEffect } from "react";
import { addUsers, Users } from "@/store/slices/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { RootState } from "@/store/store";
import { addUser, User } from "@/store/slices/userSlice";
import { closeSidebar } from "@/store/slices/toggleSidebarSlice";
import CloseIcon from "../icons/close";
import { addAuditingItems, AuditingItems } from "@/store/slices/auditingItemsSlice";
import { startSessionTracking } from "@/utils/sessionTracking";
import Cookies from "js-cookie";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // load users if user is admin
  const dispatch = useDispatch();
  const userData: User = useSelector(
    (state: RootState) => state.user
  );
  const usersData: Users[] = useSelector(
    (state: RootState) => state.users
  );
  const auditingItemsData: AuditingItems[] = useSelector(
    (state: RootState) => state.auditingItems
  );
  const isSidebarOpen: boolean = useSelector(
    (state: RootState) => state.toggleSidebar.isSidebarOpen
  );

  const getAllUsers = async (userId:number) => {
    try {
      const response = await axios.get(`/api/admin?userId=${userId}`);
      dispatch(addUsers(response.data?.users));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Something went wrong!');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    if (usersData[0]?.otpVerified) return;
    if (userData && userData.role == 'admin' && userData.id) {
      getAllUsers(userData.id);
    }
  }, [userData, usersData]);

  const getAllChapterItems = async (userId: number) => {
    try {
      const response = await axios.get(`/api/user/chapterItems?brokerId=${userId}`);
      dispatch(addAuditingItems(response.data.chapterItems));
      console.log("getAllChapterItems response", response.data.chapterItems);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  useEffect(() => {
    if (auditingItemsData[0]?.id !== -1) return;
    if (userData.id && userData.role !== "admin") {
      getAllChapterItems(userData.id);
    }
  }, [userData.id, userData.role]);

  useEffect(() => {
    if (userData.otpVerified) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.id&& user?.email) {
      dispatch(addUser(user))
    }
  }, [userData.otpVerified]);

  useEffect(()=>{
    if(userData.role !== "admin"){
      startSessionTracking(Cookies.get('auditToken') || "");}
    console.log(userData,"userData in layout");
  },[userData]);
  return (
    <div className="flex min-h-screen max-h-screen overflow-auto">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 max-md:block hidden">
          <div className="bg-white relative">
            <Sidebar />
            <button
              onClick={() => dispatch(closeSidebar(false))}
              className="absolute top-0 right-0 m-4 text-light-gray hover:text-light-blue transition-all duration-300"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* sidebar */}
      <div className={`min-w-[220px] max-md:hidden block`}>
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
