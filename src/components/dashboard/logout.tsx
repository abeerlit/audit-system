import Cookies from 'js-cookie';
const Logout = ({ onClose }: { onClose: () => void }) => {
  const handleLogout = () => {
    localStorage.removeItem('user');
    Cookies.remove('auditToken');
    localStorage.removeItem('sessionId');

    window.location.href = '/';
  };

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <h1 className="text-2xl font-bold">Logout</h1>
      <p className="mb-2">Are you sure you want to logout?</p>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 flex-1 bg-gray-200 rounded-md"
        >
          No
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 flex-1 bg-light-blue text-white rounded-md"
        >
          Yes
        </button>
      </div>
    </div>
  );
};

export default Logout;
