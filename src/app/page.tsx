"use client";
import AuthLayout from "@/components/auth/layout";
import Login from "../components/auth/login";

export default function Home() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
