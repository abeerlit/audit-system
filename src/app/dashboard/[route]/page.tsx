"use client";
import Auditing from "@/components/dashboard/auditing/auditing";
import Chapters from "@/components/dashboard/chapters/chapters";
import Header from "@/components/dashboard/header";
import DashboardLayout from "@/components/dashboard/layout";
import Profile from "@/components/dashboard/profile/profile";
import UsersManagement from "@/components/dashboard/users/users-management";
import { useParams } from "next/navigation";

const DynamicPage = () => {
  const params = useParams();

  return (
    <DashboardLayout>
      <Header route={params.route as string} />
      {params.route === "profile" && <Profile />}
      {params.route === "chapters" && <Chapters />}
      {params.route === "users" && <UsersManagement />}
      {params.route === "auditing" && <Auditing />}
      {params.route === "discussions" && <div>discussions</div>}
    </DashboardLayout>
  );
};

export default DynamicPage;
