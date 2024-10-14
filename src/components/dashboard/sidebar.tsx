import Link from "next/link";
import Logo from "../icons/logo";
import { sidebarLinks } from "@/constants/sidebarLinks";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Modal from "../modal";
import LogoutIcon from "../icons/dashboard/logout-icon";
import Logout from "./logout";

const Sidebar = () => {
  const pathname = usePathname();
  const [state, setState] = useState({
    logout: {
      open: false,
      content: <Logout onClose={() => setState({ ...state, logout: { ...state["logout"], open: false } })} />
    }
  });
  
  return (
    <div className="relative max-h-screen overflow-auto">
      <div className="h-10" />
      <Link href="/dashboard">
        <Logo className="text-light-blue mx-10 mb-10 w-[90px] h-[43px]" />
      </Link>
      <div className="border-b border-gray-100" />
      <div className="flex flex-col gap-2 mt-4">
        {sidebarLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              "flex items-center gap-3 px-4 py-2 font-semibold relative " +
              (pathname === link.href ? "text-light-blue" : "text-light-gray hover:text-light-blue")
            }
          >
            {link.icon}
            {link.name}
            {pathname === link.href && (
              <span className="flex-1 bg-light-blue w-1 h-full rounded-full absolute right-1" />
            )}
          </Link>
        ))}
        <button 
          className="flex items-center gap-3 px-4 py-2 font-semibold text-light-gray hover:text-light-blue" 
          onClick={() => setState({ ...state, logout: { ...state["logout"], open: true } })}
        >
          <LogoutIcon className="" />
          Logout
        </button>
        <Modal isOpen={state["logout"]?.open} onClose={() => setState({ ...state, logout: { ...state["logout"], open: false } })}>
          {state["logout"]?.content}
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
