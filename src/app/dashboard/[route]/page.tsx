"use client";
import DashboardLayout from "@/components/dashboard/layout";
import { useParams } from "next/navigation";

const DynamicPage = () => {
  const params = useParams();
  return (
    <DashboardLayout>
      Params Here : {params.route}
    </DashboardLayout>
  );
};

export default DynamicPage;
