const brokers = [
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 2,
    specialty: "Audits",
  },
  {
    name: "Halle Shaw",
    email: "halleshaw4288@gmail.com",
    phone: "+91235864441",
    experience: 3,
    specialty: "Audits",
  },
];

const UsersManagement = () => {
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
          {brokers.map((broker, index) => (
            <tr key={index} className="hover:bg-gray-100 border-t">
              <td className="p-4 text-nowrap">{broker.name}</td>
              <td className="p-4 text-nowrap">{broker.email}</td>
              <td className="p-4 text-nowrap">{broker.phone}</td>
              <td className="p-4 text-nowrap">{broker.experience}</td>
              <td className="p-4 text-nowrap">{broker.specialty}</td>
              <td className="p-4 text-nowrap relative">
                {/* <div className=""> */}
                  <button type="button" className="font-extrabold text-xl px-2 rounded-lg group">
                    &#x22EE; {/* Dotted actions menu */}
                    <div className="absolute z-10 text-left text-sm font-normal right-4 mt-1 w-full min-w-fit
                     bg-white border rounded-xl overflow-hidden shadow-md hidden group-focus:block">
                      <ul>
                        <li
                          onClick={() => console.log(broker)}
                          className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                          Upgrade to Expert
                        </li>
                        <li
                          onClick={() => console.log(broker)}
                          className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                          Edit Info
                        </li>
                        <li
                          onClick={() => console.log(broker)}
                          className="py-1 px-4 hover:bg-gray-100 cursor-pointer"
                        >
                          Active User
                        </li>
                        <li
                          onClick={() => console.log(broker)}
                          className="py-1 px-4 hover:bg-red-100 cursor-pointer text-red-600"
                        >
                          Deactivate User
                        </li>
                      </ul>
                    </div>
                  </button>
                {/* </div> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersManagement;
