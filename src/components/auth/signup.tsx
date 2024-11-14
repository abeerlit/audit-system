import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShowPasswordIcon from "../icons/auth/show-password";
import axios from "axios";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { addUser } from "@/store/slices/userSlice";
// import { Check, Search } from "lucide-react";
import SearchIcon from "@/components/icons/auth/search-icon-big";


const HS_CODE_OPTIONS = [
  { value: "Animal & Animal Products", label: "Animal & Animal Products" },
  { value: "Vegetable Products", label: "Vegetable Products" },
  { value: "Foodstuffs", label: "Foodstuffs" },
  { value: "Mineral Products", label: "Mineral Products" },
  { value: "Chemicals & Allied Industries", label: "Chemicals & Allied Industries" },
  // Add more options as needed
];

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: "First name is required." })
    .min(3, { message: "Must contain 3 characters." }),
  lastName: z.string().optional(),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Oops! Invalid email address." }),
  phoneNumber: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  hsCodeSpecialty: z.array(z.string()).optional(),
  // same here
  password: z
    .string()
    .trim()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Must contain 8 characters." }),
    agreeToPrivacy: z.boolean().refine((val) => val === true, {
      message: " required*"
    }),
});

const SignUpScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const filteredOptions = HS_CODE_OPTIONS.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form submission
  const formSubmit = async (formData: z.infer<typeof schema>) => {
    console.log("Form Data:", formData.hsCodeSpecialty?.join(", "));
    try {
      toast.loading("Signing Up...");
      const response = await axios.post("/api/user/auth", {
        email: formData.email.toLowerCase(),
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        experience: formData?.yearsOfExperience
          ? +formData.yearsOfExperience
          : 0,
        specialty: formData?.hsCodeSpecialty?.join(", "),
        action: "register",
      });
      console.log(response.data, "response");
      localStorage.setItem('user', JSON.stringify(response?.data?.user));
      dispatch(addUser(response.data.user));
      Cookies.set("auditToken", response.data.token);
      toast.dismiss();
      toast.success("Sign Up successful!");
      router.replace("/dashboard");
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
      console.log(error, "error in catch");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-4xl text-auth-purple font-bold mb-4">Sign Up</h2>
      <p className="text-light-gray mb-6">Enter your details to sign up!</p>
      <form className="space-y-6" onSubmit={handleSubmit(formSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="font-semibold text-auth-purple text-[14px]"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              {...register("firstName")}
              className={`mt-1 w-full border rounded-[16px] p-3 ${
                errors.firstName?.message && "border-red-500 outline-red-500"
              }`}
              placeholder="First Name"
            />
            {errors.firstName?.message && (
              <p className="text-red-500 text-sm">
                {errors.firstName?.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor="lastName"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              {...register("lastName")}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Last Name"
            />
          </div>

          {/* Email */}
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
              {...register("email")}
              className={`mt-1 w-full border rounded-[16px] p-3 ${
                errors.email?.message && "border-red-500 outline-red-500"
              }`}
              placeholder="mail@example.com"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-sm">{errors.email?.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              {...register("phoneNumber")}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Phone Number"
            />
          </div>

          {/* Years of Experience */}
          <div>
            <label
              htmlFor="yearsOfExperience"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Years of Experience
            </label>
            <input
              type="text"
              id="yearsOfExperience"
              {...register("yearsOfExperience")}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Years of Experience"
            />
          </div>

          {/* HS Code Specialty */}
          <div className="relative">
            <label
              htmlFor="hsCodeSpecialty"
              className="font-semibold text-auth-purple text-[14px]"
            >
              HS Code Specialty
            </label>
            <div 
              className="mt-1 w-full border rounded-[16px] p-3 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <SearchIcon/>
                  <input
                    type="text"
                    placeholder="Select specialties..."
                    className="w-full outline-none ml-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(true);
                    }}
                  />
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-[16px] shadow-lg">
                <div className="max-h-40 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        value={option.value}
                        {...register("hsCodeSpecialty")}
                        className="h-4 w-4 accent-gray-100"
                      />
                      <span className="ml-2">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Password */}
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
              {...register("password")}
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
              {/* Show/Hide Password Icon */}
              <ShowPasswordIcon
                className={`${
                  errors.password ? "text-red-500" : "text-[#A3AED0]"
                }`}
              />
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          )}
        </div>

        {/* Privacy Policy Agreement */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="agreeToPrivacy"
            {...register("agreeToPrivacy")}
            className="h-4 w-4 accent-sky-500"
          />
          <label htmlFor="agreeToPrivacy" className="ml-2 text-sm">
            I agree with Privacy and Policy 
          </label>
          <div className="ml-1">

          {errors.agreeToPrivacy?.message && (
            <p className="text-red-500 text-sm">
                {errors.agreeToPrivacy?.message}
              </p>
            )}
            </div>
        </div>
       

        <button
          type="submit"
          className="w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
        >
          Sign Up
        </button>

        <p className="text-sm text-light-gray">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-light-blue text-nowrap font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpScreen;
