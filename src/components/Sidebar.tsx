import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import CryptoJS from 'crypto-js';

export default function Sidebar() {
  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');

  const currentPath = useLocation().pathname;

  const secretKey = 'your_secret_key';

  const decrypt = () => {
    const user_id = localStorage.getItem('profiling_token') as string;
    const bytes = CryptoJS.AES.decrypt(user_id.toString(), secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);

    fetchBarangayDetails(plaintext);
  };

  const fetchBarangayDetails = async (user_id: string) => {
    console.log(user_id);

    await axios
      .get(`${import.meta.env.VITE_PROFILING}/barangaydetails.php`, {
        params: {
          user_id: user_id,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.length > 0) {
          setBarangayName(res.data[0].barangay_name);
          setBarangayAddress(res.data[0].barangay_address);
        } else {
          console.log('No data found');
        }
      });
  };

  useEffect(() => {
    decrypt();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('profiling_token');
    localStorage.removeItem('profiling_reauth');
    window.location.href = '/login';
  };

  return (
    <div className="relative font-bold w-[25rem] h-screen flex flex-col items-center border-r-2 bg-pink-500 py-[2rem]  px-4">
      <div className="text-center w-full text-white rounded-md bg-pink-300 p-2 my-5">
        <h2 className="text-3xl">
          {barangayName.length > 0 ? barangayName : 'No Barangay Name'}
        </h2>
        <p className="font-normal">
          {barangayAddress.length > 0 ? barangayAddress : 'No Barangay Address'}
        </p>
      </div>

      <div className="mt-[15rem] w-full ">
        <Link
          className={`p-2 mb-2 flex items-center gap-2 text-white ${
            currentPath === '/' ? 'bg-pink-300 text-black rounded-md ' : ''
          }`}
          to="/"
        >
          Dashboard
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2 text-white  ${
            currentPath === '/manage-resident'
              ? 'bg-pink-300 text-black rounded-md '
              : ''
          }`}
          to="/manage-resident"
        >
          Manage Resident
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2  text-white ${
            currentPath === '/manage-household'
              ? 'bg-pink-300 text-black rounded-md '
              : ''
          }`}
          to="/manage-household"
        >
          Manage Household
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2 text-white ${
            currentPath === '/settings'
              ? 'bg-pink-300 text-black rounded-md '
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
