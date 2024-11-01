import ActivateUserIcon from "@/components/icons/dashboard/users/activate-user-icon";
import DeactivateUserIcon from "@/components/icons/dashboard/users/deactivate-user-icon";
import EditIcon from "@/components/icons/dashboard/users/edit-icon";
import UpgradeIcon from "@/components/icons/dashboard/users/upgrade-icon";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addUsers, Users } from "@/store/slices/usersSlice";
import { RootState } from "@/store/store";

const UsersManagement = () => {
  const dispatch = useDispatch();
  const usersData: Users[] = useSelector((state: RootState) => state.users);

  const upgradeToExpert = async (user: any) => {
    try {
      const response = await axios.post(`/api/admin`, {
        id: user.id,
        email: user.email,
        action: "upgrade",
      });
      console.log(response.data, "response");
      dispatch(
        addUsers(
          usersData.map((item: any) => {
            return item.id === user.id ? { ...item, role: "expert" } : item;
          })
        )
      );
      toast.success("User upgraded to expert successfully!");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const activateOrDeactivate = async (user: any, activate: boolean) => {
    try {
      const response = await axios.post(`/api/admin`, {
        id: user.id,
        email: user.email,
        action: "activateOrDeactivate",
        activate: activate,
      });
      console.log(response.data, "response");
      dispatch(
        addUsers(
          usersData.map((item: any) => {
            return item.id === user.id ? { ...item, isActive: activate } : item;
          })
        )
      );
      toast.success(
        `User ${activate ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || "Something went wrong!");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

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
            <th className="p-4 text-left text-nowrap">ROLE</th>
            <th className="p-4 text-left text-nowrap">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {!usersData.length || !usersData?.[0]?.otpVerified ? (
            <tr>
              <td
                className="text-center p-6 text-light-gray text-xl"
                colSpan={7}
              >
                Nothing to show
                {/* <div className="flex justify-center items-center ">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-light-blue border-solid"></div>
                </div> */}
              </td>
            </tr>
          ):null}
          {usersData?.[0]?.otpVerified && usersData?.map((user: any, index: number) => (
            <tr key={index} className="border-t">
              <td className="p-4 text-nowrap">
                {user.firstName + " " + user.lastName}
              </td>
              <td className="p-4 text-nowrap">{user.email}</td>
              <td className="p-4 text-nowrap">{user.phoneNumber}</td>
              <td className="p-4 text-nowrap">{user.experience}</td>
              <td className="p-4 text-nowrap">{user.specialty}</td>
              <td className="p-4 text-nowrap capitalize">{user.role}</td>
              <td className="p-4 text-nowrap relative">
                <button
                  type="button"
                  className="font-extrabold text-xl px-2 rounded-lg group focus:bg-light-blue focus:text-white"
                >
                  &#x22EE; {/* Dotted actions menu */}
                  <div
                    className="absolute z-10 text-left text-sm font-normal right-4 mt-1 w-full min-w-fit
                     bg-white text-auth-purple border rounded-xl overflow-hidden shadow-md hidden group-focus:block"
                  >
                    <div className="flex flex-col">
                      <div
                        className={"text-lef py-1 px-4 hover:bg-gray-100"}
                        onClick={() =>
                          user.role == "expert"
                            ? toast.error("User is already upgraded!")
                            : upgradeToExpert(user)
                        }
                      >
                        <UpgradeIcon className="inline-block mr-2" />
                        Upgrade to Expert
                      </div>
                      <div
                        className={"text-lef py-1 px-4 hover:bg-gray-100"}
                        onClick={() =>
                          toast("This feature is not available yet!")
                        }
                      >
                        <EditIcon className="inline-block mr-2" />
                        Edit Info
                      </div>
                      <div
                        className={
                          "text-lef py-1 px-4 " +
                          (user.isActive
                            ? " cursor-default"
                            : " hover:bg-gray-100")
                        }
                        onClick={() =>
                          user.isActive
                            ? console.log("User is already active!")
                            : activateOrDeactivate(user, true)
                        }
                      >
                        <ActivateUserIcon className="inline-block mr-2" />
                        Activate User
                      </div>
                      <div
                        className={
                          "text-lef py-1 px-4 text-red-600 " +
                          (!user.isActive
                            ? " cursor-default"
                            : " hover:bg-red-100")
                        }
                        onClick={() =>
                          !user.isActive
                            ? console.log("user is already deactivated")
                            : activateOrDeactivate(user, false)
                        }
                      >
                        <DeactivateUserIcon className="inline-block mr-2" />
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
