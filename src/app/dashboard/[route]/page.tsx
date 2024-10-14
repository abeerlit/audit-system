"use client";
import DashboardLayout from "@/components/dashboard/layout";
import Profile from "@/components/dashboard/profile/profile";
import { useParams } from "next/navigation";

const DynamicPage = () => {
  const params = useParams();

  return (
    <DashboardLayout>
      Params Here : {params.route}
      {params.route === "profile" && <Profile />}
    </DashboardLayout>
  );
};

export default DynamicPage;