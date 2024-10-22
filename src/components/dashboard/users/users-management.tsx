import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const [users, setUsers] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>("Loading...");

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/admin");
      console.log(response.data, "response");
      setUsers(response.data?.users);
      setErrorMsg(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMsg(error.response.data?.message || 'Something went wrong!');
      } else {
        setErrorMsg('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="overflow-auto rounded-2xl text-gray-600">
      <table className="bg-white table-auto w-full ">
        <thead className="bg-light-blue text-white">
          <tr>
            <th className="p-4 text-left text-nowrap">BROKERS NAME</th>
            <th className="p-4 text-left text-nowrap">EMAIL</th>
            <th className="p-4 text-left text-nowrap">PHONE NUMBER</th>
            <th className="p-4 text-left text-nowrap">EXPERIENCE</th>
            <th className="p-4 text-left text-nowrap">SPECIALITY</th>
            <th className="p-4 text-left text-nowrap">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {errorMsg && (
            <tr>
              <td colSpan={6} className="text-center p-6 text-light-gray text-xl">
                {errorMsg}
              </td>
            </tr>
          )}
          {users?.map((user: any, index: number) => (
            <tr key={index} className="hover:bg-gray-100 border-t">
              <td className="p-4 text-nowrap">
                {user.firstName + " " + user.lastName}
              </td>
              <td className="p-4 text-nowrap">{user.email}</td>
              <td className="p-4 text-nowrap">{user.phoneNumber}</td>
              <td className="p-4 text-nowrap">{user.experience}</td>
              <td className="p-4 text-nowrap">{user.specialty}</td>
              <td className="p-4 text-nowrap relative">
                <button
                  type="button"
                  className="font-extrabold text-xl px-2 rounded-lg group"
                >
                  &#x22EE; {/* Dotted actions menu */}
                  <div
                    className="absolute z-10 text-left text-sm font-normal right-4 mt-1 w-full min-w-fit
                     bg-white border rounded-xl overflow-hidden shadow-md hidden group-focus:block"
                  >
                    <div className="flex flex-col">
                      <div
                        className="text-left py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => console.log(user)}
                      >
                        Upgrade to Expert
                      </div>
                      <div
                        className="text-left py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => console.log(user)}
                      >
                        Edit Info
                      </div>
                      <div
                        className="text-left py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        onClick={() => user.isActive ? toast.error("User is already activated!") : console.log(user)}
                      >
                        Active User
                      </div>
                      <div
                        onClick={() => !user.isActive ? toast.error("User is already deactivated!") : console.log(user)}
                        className="text-left py-1 px-4 hover:bg-red-100 cursor-pointer text-red-600"
                      >
                        Deactivate User
                      </div>
                    </div>
                  </div>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
