import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import moment from 'moment';

export default function Sidebar() {
  const [barangayName, setBarangayName] = useState<string>('');
  const [barangayAddress, setBarangayAddress] = useState<string>('');
  const { toast } = useToast();
  const currentPath = useLocation().pathname;
  const user_id = localStorage.getItem('profiling_token') as string;
  const fetchBarangayDetails = () => {
    console.log(user_id);

    axios
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
    fetchBarangayDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('profiling_token');
    localStorage.removeItem('profiling_reauth');
    window.location.href = '/login';

    toast({
      style: { background: '#1A4D2E', color: 'white' },
      title: 'Logout Successfully 🎉',
      description: moment().format('LLLL'),
    });
  };

  return (
    <div className="fixed font-bold w-[17rem] h-screen flex flex-col items-center border-r-2 bg-[#1A4D2E]  py-[2rem]  px-4">
      <div className="text-center w-full text-white rounded-md bg-[#23663e]  p-2 my-5">
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
            currentPath === '/' ? 'bg-[#23663e]  text-black rounded-md ' : ''
          }`}
          to="/"
        >
          Dashboard
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2  text-white ${
            currentPath === '/manage-household'
              ? 'bg-[#23663e]  text-black rounded-md '
              : ''
          }`}
          to="/manage-household"
        >
          Manage Household
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2 text-white  ${
            currentPath === '/manage-resident'
              ? 'bg-[#23663e]  text-black rounded-md '
              : ''
          }`}
          to="/manage-resident"
        >
          Manage Resident
        </Link>

        <Link
          className={`p-2 mb-2 flex items-center gap-2 text-white ${
            currentPath === '/settings'
              ? 'bg-[#23663e]  text-black rounded-md '
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
