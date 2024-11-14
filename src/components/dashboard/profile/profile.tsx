'use client';
import CameraIcon from '@/components/icons/dashboard/camera-icon';
import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { addUser } from '@/store/slices/userSlice';
import SearchIcon from '@/components/icons/auth/search-icon-big';

const HS_CODE_OPTIONS = [
  { value: "Animal & Animal Products", label: "Animal & Animal Products" },
  { value: "Vegetable Products", label: "Vegetable Products" },
  { value: "Foodstuffs", label: "Foodstuffs" },
  { value: "Mineral Products", label: "Mineral Products" },
  { value: "Chemicals & Allied Industries", label: "Chemicals & Allied Industries" },
  // Add more options as needed
];
// Validation schemas
const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Oops! Invalid email address.' }),
  phoneNumber: z.string().optional(),
  experience: z.string().optional(),
  specialty: z.array(z.string()).optional(),
});

const passwordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Must contain 8 characters.' }),
  newPassword: z
    .string()
    .trim()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Must contain 8 characters.' }),
  confirmPassword: z
    .string()
    .trim()
    .min(1, { message: 'Password is required.' })
    .min(8, { message: 'Must contain 8 characters.' }),
});

const Profile = () => {
  const dispatch = useDispatch();
  const [showPasswords, setShowPasswords] = useState({
    showPassword: true,
    newPassword: true,
    confirmPassword: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    id: 1,
    firstName: ' Rayme',
    lastName: 'Rich',
    email: 'murphyr,ich288@gmail.com',
    phone: '+880 1924699957',
    experience: '3+ years',
    specialty: 'Textiles AndTextile Articles',
    profileImage:
      'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp',
    file: null,
    joinedAt: '02/06/2023',
  });
  // const [profileImage, setProfileImage] = useState(profile.img);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });



  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log(user.specialty, "user specialty");

    if (user.id) {
      setProfile({
        ...user,
        specialty: Array.isArray(user.specialty) 
          ? user.specialty 
          : user.specialty?.split(",").map((spec: string) => spec.trim()),
        experience: user.experience + "",
        profileImage: user.profileImage
          ?.toString()
          .includes('cloudinary')
          ? user.profileImage
          : profile.profileImage,
        file: null,
      });
      reset(user);
    }
    if (user?.specialty) {
      const selectedSpecialties = Array.isArray(user.specialty) 
        ? user.specialty 
        : user.specialty.split(",").map((spec: string) => spec.trim());
      setValue('specialty', selectedSpecialties);
    }
  }, [reset, profile.profileImage]);

  const filteredOptions = HS_CODE_OPTIONS.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Image upload and updating profile with uploaded image URL
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        setProfile((prev: any) => ({ ...prev, file: selectedFile }));
      }
    },
    []
  );
  useEffect(() => {
    if (profile.file) {
      toast.loading('Uploading image...');

      const formData = new FormData();
      formData.append('file', profile.file);
      formData.append(
        'upload_preset',
        // @ts-expect-error expect import error
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
      );

      const uploadImage = async () => {
        try {
          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
          );
          const data = res.data;
          console.log(data.secure_url, 'secure url');

          setProfile((prev) => ({
            ...prev,
            profileImage: data.secure_url, // Set uploaded image URL to profile
          }));
          toast.dismiss();
        } catch (err) {
          console.log(err);
          toast.dismiss();
          toast.error('Error occurred while uploading the image');
        }
      };
      uploadImage();
    }
  }, [profile.file]); // Watch for file changes

  // Form submission for profile update
  const formSubmit = useCallback(
    async (formData: any) => {
      console.log(formData.specialty?.join(", "), "specialty");

      try {
        toast.loading('Loading...');
        const response = await axios.post('/api/user/auth', {
          ...formData,
          id: profile.id,
          specialty: formData.specialty?.join(", "),
          experience: +formData.experience || 0,
          profileImage: profile.profileImage, // Ensure the correct image URL is being sent
          action: 'update',
        });

        const updatedUser = response.data.updatedUser;

        dispatch(addUser(updatedUser));
        toast.dismiss();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfile({
          ...updatedUser,
          // img: updatedUser.profileImage, // Update the image in profile
          file: null,
        });

        toast.success('Profile Updated');
      } catch (error) {
        toast.dismiss();
        toast.error(
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'An error occurred'
        );
      }
    },
    [profile.id, profile.profileImage]
  );

  // Form submission for password update
  const submitPassword = useCallback(
    async (formData: any) => {
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      const loginUser = JSON.parse(localStorage.getItem('user') || '{}');

      try {
        toast.loading('Loading...');
        await axios.post('/api/user/auth/updatePassword', {
          email: loginUser.email,
          oldPassword: formData.password,
          newPassword: formData.newPassword,
        });
        toast.dismiss();
        resetPassword();
        toast.success('Password Updated');
      } catch (error) {
        toast.dismiss();
        toast.error(
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : 'An error occurred'
        );
      }
    },
    [resetPassword]
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
      {/* Profile section */}
      <ProfileView profile={profile} handleFileChange={handleFileChange} />

      {/* Edit profile section */}
      <div className="flex flex-col gap-2 p-4 md:p-7 bg-white md:rounded-[30px] rounded-[20px] w-full">
        <h2 className="text-2xl text-auth-purple font-bold">Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit(formSubmit)} noValidate>
          <ProfileInput
            label="First Name"
            id="firstName"
            register={register('firstName')}
            error={errors.firstName?.message}
          />
          <ProfileInput
            label="Last Name"
            id="lastName"
            register={register('lastName')}
            error={errors.lastName?.message}
          />
          <ProfileInput
            label="Email"
            id="email"
            register={register('email')}
            error={errors.email?.message}
          />
          <ProfileInput
            label="Phone Number"
            id="phoneNumber"
            register={register('phoneNumber')}
            error={errors.phoneNumber?.message}
          />
          <ProfileInput
            label="Years of Experience"
            id="experience"
            register={register('experience')}
            error={errors.experience?.message}
          />
          {/* <ProfileInput
            label="HS Code Specialty"
            id="specialty"
            register={register('specialty')}
            error={errors.specialty?.message}
          /> */}

          <div className="relative">
            <label
              htmlFor="specialty"
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
                  <SearchIcon />
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
            {errors.specialty?.message && (
              <p className="text-red-500 text-sm">
                {errors.specialty?.message?.toString()}
              </p>
            )}

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
                        {...register("specialty")}
                        className="h-4 w-4 accent-gray-100"
                      />
                      <span className="ml-2">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="max-w-[250px] w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
          >
            Save Now
          </button>
        </form>

        {/* Password update form */}
        <PasswordUpdateForm
          handleSubmit={handlePasswordSubmit}
          passwordRegister={passwordRegister}
          handleSubmitFun={submitPassword}
          passwordErrors={passwordErrors}
          showPasswords={showPasswords}
          setShowPasswords={setShowPasswords}
        />
      </div>
    </div>
  );
};

// Component for rendering profile view
const ProfileView = ({ profile, handleFileChange }: any) => (
  <div className="flex flex-col min-w-[300px] gap-3 p-4 md:p-7 bg-white md:rounded-[30px] rounded-[20px]">
    <span className="text-light-gray" onClick={() => console.log(profile)}>
      Joined {moment(profile.createdAt).format('DD/MM/YYYY')}
    </span>
    <label
      htmlFor="file-input"
      className="relative border rounded-full w-fit overflow-hidden cursor-pointer"
    >
      <Image
        src={profile.profileImage}
        alt={profile.firstName}
        width={100}
        height={100}
        className="rounded-full object-cover w-[100px] h-[100px]"
      />
      <div className="absolute bottom-0 w-full bg-black/50 text-center text-white">
        <CameraIcon className="mx-auto h-6 w-5" />
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>
    <h2 className="text-xl text-auth-purple font-semibold">
      {profile.firstName + ' ' + profile.lastName}
    </h2>
    <ProfileInfo label="Phone Number" value={profile.phoneNumber} />
    <ProfileInfo label="Email" value={profile.email} />
    <ProfileInfo label="Experience" value={profile.experience} />
    <ProfileInfo label="Specialization" value={profile.specialty} />
  </div>
);

// Profile info display component
const ProfileInfo = ({ label, value }: any) => (
  <p className="text-sm text-nowrap truncate text-light-gray">
    <span className="text-auth-purple text-[16px] font-semibold">
      {label}:{' '}
    </span>
    {value}
  </p>
);

// Profile input component
const ProfileInput = ({ label, id, register, error }: any) => (
  <div>
    <label htmlFor={id} className="font-semibold text-auth-purple text-[14px]">
      {label}
    </label>
    <input
      type="text"
      id={id}
      {...register}
      className={`mt-1 w-full border rounded-[16px] p-3 ${error ? 'border-red-500 outline-red-500' : ''
        }`}
      placeholder={label}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);


// Password update form
const PasswordUpdateForm = ({
  handleSubmit,
  handleSubmitFun,
  passwordRegister,
  passwordErrors,
  showPasswords,
}: // setShowPasswords,
  any) => (
  <form className="space-y-4 mt-4" onSubmit={handleSubmit(handleSubmitFun)} >
    {/* Password input fields */}
    <PasswordInput
      label="Current Password"
      id="password"
      showPassword={showPasswords.showPassword}
      register={passwordRegister('password')}
      error={passwordErrors.password?.message}
    />
    <PasswordInput
      label="New Password"
      id="newPassword"
      showPassword={showPasswords.newPassword}
      register={passwordRegister('newPassword')}
      error={passwordErrors.newPassword?.message}
    />
    <PasswordInput
      label="Confirm Password"
      id="confirmPassword"
      showPassword={showPasswords.confirmPassword}
      register={passwordRegister('confirmPassword')}
      error={passwordErrors.confirmPassword?.message}
    />

    <button
      type="submit"
      className="max-w-[250px] w-full font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
    >
      Update Password
    </button>
  </form>
);

// Password input component
const PasswordInput = ({ label, id, showPassword, register, error }: any) => (
  <div>
    <label htmlFor={id} className="font-semibold text-auth-purple text-[14px]">
      {label}
    </label>
    <input
      type={showPassword ? 'text' : 'password'}
      id={id}
      {...register}
      className={`mt-1 w-full border rounded-[16px] p-3 ${error ? 'border-red-500 outline-red-500' : ''
        }`}
      placeholder={label}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

export default Profile;
