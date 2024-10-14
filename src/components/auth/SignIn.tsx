import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ShowPasswordIcon from "../icons/auth/show-password";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Oops! Invalid email address." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Oops! Password must contain 8 character(s)." }),
  keepLoggedIn: z.boolean().default(false),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const formSubmit = (formData: z.infer<typeof schema>) => {
    console.log("Form Data:", formData);
    // use local storage to store the data
    localStorage.setItem("user", JSON.stringify(formData));
    toast.success("Login successfully!");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-4xl text-auth-purple font-bold mb-4">Sign In</h2>
      <p className="text-light-gray mb-6">
        Enter your email and password to sign in!
      </p>

      <form className="space-y-6" onSubmit={handleSubmit(formSubmit)}>
        <div>
          <label
            htmlFor="email"
            className="font-semibold text-auth-purple text-[14px]"
          >
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className={`mt-1 w-full border rounded-[16px] p-3 ${
              errors.email?.message && " border-red-500 outline-red-500"
            }`}
            placeholder="mail@example.com"
          />
          {errors.email?.message && (
            <p className="text-red-500 text-sm">
              {errors?.email?.message as string}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="font-semibold text-auth-purple text-[14px]"
          >
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", { required: true })}
              className={`mt-1 w-full border rounded-[16px] p-3 pe-8 ${
                errors.password?.message && "border-red-500 outline-red-500"
              }`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {/* {showPassword ? "🙈" : <ShowPasswordIcon className="text-[#A3AED0]" />} */}
              <ShowPasswordIcon
                className={`${
                  errors.password ? "text-red-500" : "text-[#A3AED0]"
                }`}
              />
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-red-500 text-sm">
              {errors.password?.message as string}
            </p>
          )}
        </div>

        <div className="flex justify-between flex-wrap items-center gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keepLoggedIn"
              {...register("keepLoggedIn")}
              className="h-4 w-4 accent-sky-500"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-nowrap text-sm">
              Keep me logged in
            </label>
          </div>

          <Link
            href="/auth/reset"
            className="text-sm ms-auto font-semibold text-nowrap text-light-blue hover:underline"
          >
            Forget password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
        >
          Sign In
        </button>

        <p className="text-sm text-light-gray">
          Not registered yet?{" "}
          <Link
            href="/auth/signup"
            className="text-light-blue text-nowrap font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
