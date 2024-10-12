import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import ShowPasswordIcon from '../icons/auth/show-password';

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().nonempty({ message: "Email is required." }).email({ message: "Oops! Invalid email address." }),
  phoneNumber: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  hsCodeSpecialty: z.string().optional(),
  // same here 
  password: z.string().nonempty({ message: "Password is required." }).min(8, { message: "Password must contain 8 character(s)." }),
  agreeToPrivacy: z.boolean().optional()
});

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const formSubmit = (formData: z.infer<typeof schema>) => {
    console.log("Form Data:", formData);
    // use local storage to store the data
    localStorage.setItem("user", JSON.stringify(formData));
    toast.success("Sign Up successful!");
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-4xl text-auth-purple font-bold mb-4">Sign Up</h2>
      <p className="text-light-gray mb-6">
        Enter your details to sign up!
      </p>
      <form className="space-y-6" onSubmit={handleSubmit(formSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="font-semibold text-auth-purple text-[14px]">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              {...register('firstName')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="First Name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="font-semibold text-auth-purple text-[14px]">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register('lastName')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Last Name"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="font-semibold text-auth-purple text-[14px]">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`mt-1 w-full border rounded-[16px] p-3 ${errors.email?.message && "border-red-500 outline-red-500"}`}
              placeholder="mail@example.com"
            />
            {errors.email?.message && <p className="text-red-500 text-sm">{errors.email?.message}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="font-semibold text-auth-purple text-[14px]">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              {...register('phoneNumber')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Phone Number"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label htmlFor="yearsOfExperience" className="font-semibold text-auth-purple text-[14px]">
              Years of Experience
            </label>
            <input
              type="text"
              id="yearsOfExperience"
              {...register('yearsOfExperience')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Years of Experience"
            />
          </div>

          {/* HS Code Specialty */}
          <div>
            <label htmlFor="hsCodeSpecialty" className="font-semibold text-auth-purple text-[14px]">
              HS Code Specialty
            </label>
            <input
              type="text"
              id="hsCodeSpecialty"
              {...register('hsCodeSpecialty')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="HS Code Specialty"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="font-semibold text-auth-purple text-[14px]">
            Password<span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register('password')}
              className={`mt-1 w-full border rounded-[16px] p-3 pe-8 ${errors.password?.message && "border-red-500 outline-red-500"}`}
              placeholder="Min. 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {/* Show/Hide Password Icon */}
              <ShowPasswordIcon className={`${errors.password ? "text-red-500" : "text-[#A3AED0]"}`} />
            </button>
          </div>
          {errors.password?.message && <p className="text-red-500 text-sm">{errors.password?.message}</p>}
        </div>

        {/* Privacy Policy Agreement */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="agreeToPrivacy"
            {...register('agreeToPrivacy')}
            className="h-4 w-4 accent-sky-500"
          />
          <label htmlFor="agreeToPrivacy" className="ml-2 text-sm">
            I agree with Privacy and Policy
          </label>
        </div>

        <button
          type="submit"
          className="w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
        >
          Sign Up
        </button>

        <p className="text-sm text-light-gray">
        Already have an account?{" "}
        <Link href="/" className="text-light-blue text-nowrap font-semibold hover:underline">
          Sign In
        </Link>
      </p>
      </form>
    </div>
  );
};

export default SignUpScreen;
