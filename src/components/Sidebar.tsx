import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

export default function Sidebar() {
  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');

  const currentPath = useLocation().pathname;

  const fetchBarangayDetails = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/barangaydetails.php`)
      .then((res) => {
        console.log(res.data);
        setBarangayName(res.data[0].barangay_name);
        setBarangayAddress(res.data[0].barangay_address);
      });
  };

  useEffect(() => {
    fetchBarangayDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('profiling_token');
    window.location.href = '/login';
  };

  return (
    <div className="relative font-bold w-[20rem] h-screen flex flex-col items-center border-r-2 bg-pink-300 py-[2rem]">
      <div className="text-center w-ful text-white rounded-md">
        <h2 className="text-3xl">{barangayName}</h2>
        <p className="font-normal">{barangayAddress}</p>
      </div>

      <div className="mt-[15rem] w-full px-4">
        <Link
          className={`p-2 mb-2 flex items-center gap-2  ${
            currentPath === '/' ? 'bg-red-500 rounded-md text-white' : ''
          }`}
          to="/"
        >
          Dashboard
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2  ${
            currentPath === '/manage-resident'
              ? 'bg-red-500 rounded-md text-white'
              : ''
          }`}
          to="/manage-resident"
        >
          Manage Resident
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2  ${
            currentPath === '/manage-household'
              ? 'bg-red-500 rounded-md text-white'
              : ''
          }`}
          to="/manage-household"
        >
          Manage Household
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2  ${
            currentPath === '/settings'
              ? 'bg-red-500 rounded-md text-white'
              : ''
          }`}
          to="/settings"
        >
          Settings
        </Link>
      </div>
      <div className="absolute bottom-10">
        <Button onClick={handleLogout} className="w-[10rem]">
          Logout
        </Button>
      </div>
    </div>
  );
}
