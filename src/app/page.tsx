"use client";
import AuthLayout from "@/components/auth/layout";
import SignIn from "@/components/auth/SignIn";

export default function Home() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}