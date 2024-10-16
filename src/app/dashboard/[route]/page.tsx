"use client";
import Chapters from "@/components/dashboard/chapters/chapters";
import DashboardLayout from "@/components/dashboard/layout";
import Profile from "@/components/dashboard/profile/profile";
import { useParams } from "next/navigation";

const DynamicPage = () => {
  const params = useParams();

  return (
    <DashboardLayout>
      Params Here : {params.route}
      {params.route === "profile" && <Profile />}
      {params.route === "chapters" && <Chapters />}
    </DashboardLayout>
  );
};

export default DynamicPage;