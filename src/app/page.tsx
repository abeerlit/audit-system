"use client";
import AuthLayout from "@/components/auth/layout";
import SignIn from "@/components/auth/signin";

export default function Home() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}