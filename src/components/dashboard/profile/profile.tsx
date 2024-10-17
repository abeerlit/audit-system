import CameraIcon from '@/components/icons/dashboard/camera-icon';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import ShowPasswordIcon from '@/components/icons/auth/show-password';

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Oops! Invalid email address.' }),
  phoneNumber: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  hsCodeSpecialty: z.string().optional(),
  // same here
  password: z.string().optional(),
  newPassword: z.string().optional(),
  // .min(1, { message: "Password is required." })
  // .min(8, { message: "Must contain 8 characters." }),
  confirmPassword: z.string().optional(),
  // .min(1, { message: "Password is required." })
  // .min(8, { message: "Must contain 8 characters." }),
});

const Profile = () => {
  const [showPasswords, setShowPasswords] = useState({
    showPassword: false,
    newPassword: true,
    confirmPassword: false,
  });
  const [profile, setProfile] = useState({
    name: 'Murphy Rich',
    email: 'murphyrich288@gmail.com',
    phone: '+880 1924699957',
    experience: '3+ years',
    specialization: 'Textiles AndTextile Articles',
    img: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    file: null,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // @ts-expect-error for file selection
      setProfile({ ...profile, file: selectedFile });
    }
  };

  useEffect(() => {
    if (profile.file) {
      const imageUrl = URL.createObjectURL(profile.file);
      setProfile({ ...profile, img: imageUrl });
      // Cleanup function to revoke the object URL
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    }
  }, [profile.file]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // Handle form submission
  const formSubmit = (formData: z.infer<typeof schema>) => {
    // use local storage to store the data
    localStorage.setItem('user', JSON.stringify(formData));
    toast.success('Updated successfully!');
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && false) {
      const user: any = localStorage.getItem('user');
      if (user) reset(JSON.parse(user));
    }
  }, []);

  return (
    <div className="flex max-md:flex-col max-lg:gap-4 gap-6">
      {/* profile here */}
      <div className="flex flex-col gap-3 p-4 md:p-7 bg-white md:rounded-[30px] rounded-[20px]">
        <span className="text-light-gray text-nowrap">Joined 02/06/2023</span>
        {/* choose image here */}
        <label
          htmlFor="file-input"
          className="flex relative border rounded-full w-fit overflow-hidden cursor-pointer"
        >
          <Image
            src={profile.img}
            alt={profile.name}
            width={100}
            height={100}
            className="rounded-full object-cover h-[100px] w-[100px]"
          />
          <div className="w-full bg-black/50 text-center text-white absolute bottom-0">
            <CameraIcon className="mx-auto h-6 w-5" />
          </div>
          <input
            id="file-input"
            accept="image/*"
            type="file"
            className="!hidden"
            onChange={handleFileChange}
          />
        </label>
        <h2 className="text-xl text-auth-purple font-semibold">
          {profile.name}
        </h2>
        <p className="text-sm text-light-gray text-nowrap">
          <span className="text-auth-purple text-[16px] font-semibold">
            Phone Number:{' '}
          </span>
          {profile.phone}
        </p>
        <p className="text-sm text-light-gray text-nowrap">
          <span className="text-auth-purple text-[16px] font-semibold">
            Email:{' '}
          </span>
          {profile.email}
        </p>
        <p className="text-sm text-light-gray text-nowrap">
          <span className="text-auth-purple text-[16px] font-semibold">
            Experience:{' '}
          </span>
          {profile.experience}
        </p>
        <p className="text-sm text-light-gray text-nowrap">
          <span className="text-auth-purple text-[16px] font-semibold">
            Specialization:{' '}
          </span>
          {profile.specialization}
        </p>
      </div>
      {/* edit profile here */}
      <div className="flex flex-col gap-2 p-4 md:p-7 bg-white md:rounded-[30px] rounded-[20px] w-full">
        <h2 className="text-2xl text-auth-purple font-bold">Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit(formSubmit)}>
          {/* First Name */}
          <div>
            <label
              htmlFor="firstName"
              className="font-semibold text-auth-purple text-[14px]"
            >
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
            <label
              htmlFor="lastName"
              className="font-semibold text-auth-purple text-[14px]"
            >
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
            <label
              htmlFor="email"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className={`mt-1 w-full border rounded-[16px] p-3 ${
                errors.email?.message && 'border-red-500 outline-red-500'
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
              {...register('phoneNumber')}
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
              {...register('yearsOfExperience')}
              className="mt-1 w-full border rounded-[16px] p-3"
              placeholder="Years of Experience"
            />
          </div>

          {/* HS Code Specialty */}
          <div>
            <label
              htmlFor="hsCodeSpecialty"
              className="font-semibold text-auth-purple text-[14px]"
            >
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

          <button
            type="submit"
            className="max-w-[250px] text-nowrap w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
          >
            Save Now
          </button>
        </form>

        {/* change password here */}
        <div className="mt-4 space-y-4">
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.showPassword ? 'text' : 'password'}
                id="password"
                {...register('password')}
                className={`mt-1 w-full border rounded-[16px] p-3 pe-8`}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    showPassword: !showPasswords.showPassword,
                  })
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {/* Show/Hide Password Icon */}
                <ShowPasswordIcon
                  className={`${
                    // errors.password ? "text-red-500" :
                    'text-[#A3AED0]'
                  }`}
                />
              </button>
            </div>
          </div>
          {/* new password */}
          <div>
            <label
              htmlFor="newPassword"
              className="font-semibold text-auth-purple text-[14px]"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? 'text' : 'password'}
                id="newPassword"
                {...register('newPassword')}
                className={`mt-1 w-full border rounded-[16px] p-3 pe-8`}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    newPassword: !showPasswords.newPassword,
                  })
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {/* Show/Hide Password Icon */}
                <ShowPasswordIcon
                  className={`${
                    // errors.password ? "text-red-500" :
                    'text-[#A3AED0]'
                  }`}
                />
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="font-semibold text-auth-purple text-[14px]"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                {...register('confirmPassword')}
                className={`mt-1 w-full border rounded-[16px] p-3 pe-8`}
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords({
                    ...showPasswords,
                    confirmPassword: !showPasswords.confirmPassword,
                  })
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {/* Show/Hide Password Icon */}
                <ShowPasswordIcon
                  className={`${
                    // errors.password ? "text-red-500" :
                    'text-[#A3AED0]'
                  }`}
                />
              </button>
            </div>
          </div>
          {/* save passwords */}
          <button
            type="submit"
            onClick={handleSubmit(formSubmit)}
            className="max-w-[250px] text-nowrap w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
          >
            Update password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
