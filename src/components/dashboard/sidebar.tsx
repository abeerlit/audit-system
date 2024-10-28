import Link from "next/link";
import Logo from "../icons/logo";
import { getRoutes } from "@/constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "../modal";
import LogoutIcon from "../icons/dashboard/sidebar/logout-icon";
import Logout from "./logout";
import { useDispatch, useSelector } from "react-redux";
import { closeSidebar } from "@/store/slices/toggleSidebarSlice";
import { RootState } from "@/store/store";
import { User } from "@/store/slices/userSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [state, setState] = useState({
    routes: [
      {
        name: "",
        href: "",
        icon: <></>,
      },
    ],
    logout: {
      open: false,
      content: (
        <Logout
          onClose={() =>
            setState({ ...state, logout: { ...state["logout"], open: false } })
          }
        />
      ),
    },
  });

  const handleClose = () => {
    dispatch(closeSidebar(false));
  };

  const userData: User = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (!userData.role) return;
    const array = getRoutes(userData.role);
    setState({ ...state, routes: array });
  }, [userData.role]);

  return (
    <div className="relative max-h-screen min-h-screen overflow-auto">
      <div className="h-10" />
      <Link href="/dashboard" onClick={handleClose}>
        <Logo className="text-light-blue ms-6 mb-10 w-[90px] h-[43px]" />
      </Link>
      <div className="border-b border-gray-100" />
      <div className="flex flex-col gap-2 mt-4">
        {state?.routes?.map(
          (link) =>
            link?.name && (
              <Link
                onClick={handleClose}
                key={link.href}
                href={link.href}
                className={
                  "flex items-center text-nowrap gap-3 px-4 py-2 font-semibold relative " +
                  (pathname === link.href
                    ? "text-light-blue"
                    : "text-light-gray hover:text-light-blue")
                }
              >
                <span className="w-5">{link.icon}</span>
                {link.name}
                {pathname === link.href && (
                  <span className="flex-1 bg-light-blue w-1 h-full rounded-full absolute right-1" />
                )}
              </Link>
            )
        )}
        <button
          className="flex items-center gap-3 px-4 py-2 font-semibold text-light-gray hover:text-light-blue"
          onClick={() =>
            setState({ ...state, logout: { ...state["logout"], open: true } })
          }
        >
          <LogoutIcon className="" />
          Logout
        </button>
        <Modal
          isOpen={state["logout"]?.open}
          onClose={() =>
            setState({ ...state, logout: { ...state["logout"], open: false } })
          }
        >
          {state["logout"]?.content}
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
