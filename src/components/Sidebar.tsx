import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function Sidebar() {
  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');

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
    localStorage.removeItem('isLogin');
    window.location.href = '/login';
  };

  return (
    <div className="relative font-bold w-[20rem] h-screen flex flex-col items-center border-r-2">
      <div className="text-center bg-violet-600 w-full p-2 text-white rounded-md">
        <h2 className="text-3xl">{barangayName}</h2>
        <p className="font-normal">{barangayAddress}</p>
      </div>

      <div className="mt-[15rem]">
        <Link className="p-2 mb-2 flex items-center gap-2" to="/">
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Dashboard
        </Link>

        <Link
          className="p-2 mb-2 flex items-center gap-2"
          to="/manage-resident"
        >
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Manage Resident
        </Link>

        <Link
          className="p-2 mb-2 flex items-center gap-2"
          to="/manage-household"
        >
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
          Manage Household
        </Link>

        <Link className="p-2 mb-2 flex items-center gap-2" to="/settings">
          {/* <RxDashboard className="text-md h-[1.5rem] w-[1.5rem]" /> Dashboard */}
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
