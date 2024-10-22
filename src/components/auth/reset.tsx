import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import ResetCheckCircle from '../icons/auth/check-circle';
import ShowPasswordIcon from '../icons/auth/show-password';
import axios from 'axios';

const ResetPassword = () => {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [timer, setTimer] = React.useState<number>(60);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [reset, setReset] = React.useState({
    email: '',
    code: ['', '', '', ''],
    newPassword: '',
    confirmPassword: '',
    showNew: true,
    showConfirm: true,
  });

  // Handle input change
  const handleChange = (index: number, value: string) => {
    const newCode = [...reset.code];
    if (value) {
      newCode[index] = value.replace(/\D/g, ''); // Allow only digits
    } else {
      newCode[index] = ''; // Clear the value if backspace is pressed
    }
    setReset({ ...reset, code: newCode });

    // Focus next input if value is entered
    if (newCode[index] && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Focus previous input if backspace is pressed
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle email submit
  const handleEmailSubmit = async () => {
    if (reset.email.trim() === '') {
      toast.error('Please enter your email.');
      return;
    }
    if (!validateEmail(reset.email)) {
      toast.error('Please enter a valid email.');
      return;
    }
    try {
      toast.loading('Loading...');
      const response = await axios.post('/api/user/auth', {
        email: reset.email,

        action: 'forgetPassword',
      });
      console.log(response.data, 'response');
      toast.dismiss();
      toast.success('Success');
      setStep(step + 1);
      console.log('1 ' + reset.email);
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Handle verify code
  const handleVerifyCode = async () => {
    if (reset.code.join('').length < 4) {
      toast.error('Fill your code');
      return;
    }
    if (!timer) {
      toast.error('Code has been expired');
      return;
    }

    try {
      toast.loading('Loading...');
      const response = await axios.post('/api/user/auth/verifyOTP', {
        email: reset.email,
        otp: +reset.code.join(''),
        action: 'forgetPassword',
      });
      console.log(response.data, 'response');
      toast.dismiss();
      toast.success('Otp verify');
      setStep(step + 1);
      console.log('1 ' + reset.email);
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Handle new password
  const handleNewPassword = async () => {
    if (reset.newPassword.trim() === '') {
      toast.error('Please enter your new password.');
      return;
    } else if (reset.confirmPassword.trim() === '') {
      toast.error('Please enter your confirm password.');
      return;
    } else if (
      reset.newPassword.length < 8 ||
      reset.confirmPassword.length < 8
    ) {
      toast.error('Passwords must be 8 characters.');
      return;
    } else if (reset.newPassword !== reset.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      toast.loading('Loading...');
      const response = await axios.post('/api/user/auth/updatePassword', {
        email: reset.email,
        newPassword: reset.newPassword,
      });
      console.log(response.data, 'response');
      toast.dismiss();
      toast.success('Password Updated');
      setStep(step + 1);
      console.log('1 ' + reset.email);
    } catch (error) {
      toast.dismiss();
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'An error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount
    };
  }, [step, timer]);

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0'
    )}`;
  };

  //  handle resend code
  const handleResendCode = async () => {
    if (timer === 0) {
      try {
        await handleEmailSubmit();
        setTimer(60);
        // toast.success('Done! check your email');
      } catch (error) {
        toast.dismiss();
        if (axios.isAxiosError(error) && error.response) {
          toast.error(error.response.data?.message || 'An error occurred');
        } else {
          toast.error('An unexpected error occurred');
        }
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-4xl font-bold mb-4 text-auth-purple">
        {step === 1
          ? 'Forgot password'
          : step === 2
          ? 'Verification'
          : step === 3
          ? 'New Password'
          : ''}
      </h2>
      <p className="text-light-gray mb-10">
        {step === 1
          ? 'Enter your email for the verification process, we will send 4 digits code to your email.'
          : step === 2
          ? 'Enter your 4 digits code that you received on your email.'
          : step === 3
          ? 'Set the new password for your account so you can login and access all features.'
          : ''}
      </p>
      {step === 1 ? (
        <React.Fragment>
          <label
            htmlFor="email"
            className="font-semibold text-auth-purple text-[14px]"
          >
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            required
            name="email"
            value={reset.email}
            placeholder="mail@example.com"
            onChange={(e) => setReset({ ...reset, email: e.target.value })}
            className={`mt-1 w-full border rounded-[16px] p-3 ${
              false && ' border-red-500 outline-red-500'
            }`}
          />
        </React.Fragment>
      ) : step === 2 ? (
        <React.Fragment>
          <div className="flex gap-4">
            {reset?.code?.map((value, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e.target.value.trim())}
                // @ts-expect-error because of the ref
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-1/4 h-20 text-center border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
              />
            ))}
          </div>
          <div className="mt-6 text-lg text-red-500 text-center">
            {formatTime(timer)}
          </div>
        </React.Fragment>
      ) : step === 3 ? (
        // update password
        <React.Fragment>
          <label
            htmlFor="new-password"
            className="font-semibold text-auth-purple"
          >
            Enter new password
          </label>
          <div className="relative mb-4">
            <input
              type={reset.showNew ? 'text' : 'password'}
              id="new-password"
              onChange={(e) =>
                setReset({ ...reset, newPassword: e.target.value.trim() })
              }
              className={`mt-1 w-full border rounded-[16px] p-3 pe-8 ${
                false && 'border-red-500 outline-red-500'
              }`}
              placeholder="Password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setReset({ ...reset, showNew: !reset.showNew })}
            >
              <ShowPasswordIcon
                className={`${false ? 'text-red-500' : 'text-[#A3AED0]'}`}
              />
            </button>
          </div>
          {/* confirm password */}
          <label
            htmlFor="confirm-password"
            className="font-semibold text-auth-purple"
          >
            Confirm password
          </label>
          <div className="relative mb-4">
            <input
              type={reset.showConfirm ? 'text' : 'password'}
              id="confirm-password"
              onChange={(e) =>
                setReset({ ...reset, confirmPassword: e.target.value.trim() })
              }
              className={`mt-1 w-full border rounded-[16px] p-3 pe-8 ${
                false && 'border-red-500 outline-red-500'
              }`}
              placeholder="Confirm password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() =>
                setReset({ ...reset, showConfirm: !reset.showConfirm })
              }
            >
              <ShowPasswordIcon
                className={`${false ? 'text-red-500' : 'text-[#A3AED0]'}`}
              />
            </button>
          </div>
        </React.Fragment>
      ) : (
        <div className="text-center">
          <ResetCheckCircle className="mx-auto mb-7 text-[#23A26D]" />
          <h3 className="font-bold text-2xl leading-7">
            Your password has been reset successfully
          </h3>
        </div>
      )}
      {/* Verify button */}
      <button
        type="submit"
        onClick={() => {
          if (step === 1) {
            handleEmailSubmit();
          } else if (step === 2) {
            handleVerifyCode();
          } else if (step === 3) {
            handleNewPassword();
          } else {
            router.push('/');
          }
        }}
        className="w-full mt-[30px] font-semibold bg-light-blue text-white py-3 px-4 rounded-[16px] hover:bg-sky-500 transition duration-500"
      >
        {step === 3 ? 'Update Password' : 'Continue'}
      </button>
      {step === 2 && (
        <div className="text-light-gray my-4 text-sm">
          If you didn’t receive a code!{' '}
          <button
            disabled={timer !== 0}
            onClick={() => handleResendCode()}
            className="text-light-blue hover:underline"
          >
            Resend
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
