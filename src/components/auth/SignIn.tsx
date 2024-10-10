import React, { useState } from "react";

const SignIn = () => {
  // State to manage email, password, checkbox, and password visibility
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepLoggedIn: false,
    showPassword: false,
  });

  // Handle changes for email, password, and checkbox
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form submission logic here
    console.log('Form Data:', formData);
    // use local storage to store the data
    localStorage.setItem('user', JSON.stringify(formData));
    
    // Example: You can send this data to an API endpoint
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email: formData.email,
    //     password: formData.password,
    //     keepLoggedIn: formData.keepLoggedIn,
    //   }),
    // }).then((response) => {
    //     //   Handle response
    // });
  };

  return (
    <div className="p-8 rounded-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Sign In</h2>
      <p className="text-gray-600 mb-6">
        Enter your email and password to sign in!
      </p>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md py-2 px-3"
            placeholder="mail@example.com"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={formData.showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full border rounded-md py-2 px-3"
              placeholder="Min. 8 characters"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
            >
              {formData.showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="keepLoggedIn"
              id="keepLoggedIn"
              checked={formData.keepLoggedIn}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-500"
            />
            <label htmlFor="keepLoggedIn" className="ml-2 text-nowrap text-sm">
              Keep me logged in
            </label>
          </div>

          <a href="#" className="text-sm font-semibold text-nowrap text-blue-400">
            Forget password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full font-semibold bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-500 transition duration-500"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-gray-600">
          Not registered yet?{" "}
          <a href="#" className="text-blue-400 text-nowrap font-semibold">
            Create an Account
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
