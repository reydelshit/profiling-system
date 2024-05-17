import { Navigate, Outlet, useLocation } from 'react-router-dom';

import App from '@/App';
import Sidebar from '../Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Toaster } from '../ui/toaster';

type ProfileType = {
  user_id: string;
  username: string;
  password: string;
  created_at: string;
  fullname: string;
};

export default function Root() {
  const location = useLocation();
  const [profile, setProfile] = useState<ProfileType>({} as ProfileType);
  const profiling_token = localStorage.getItem('profiling_token');

  const user_id = localStorage.getItem('profiling_token') as string;

  const fetchProfile = () => {
    axios
      .get(`${import.meta.env.VITE_PROFILING}/profile.php`, {
        params: { user_id: user_id },
      })
      .then((res) => {
        console.log(res.data, 'profile');
        setProfile(res.data[0]);
      });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // if (location.pathname === '/login') return <App />;

  if (!profiling_token) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="w-full">
      {/* <Header /> */}
      <h1 className="text-2xl font-bold text-center absolute right-14 top-14">
        Welcome, {profile.fullname}👋
      </h1>
      <div className="flex ">
        <Sidebar />
        <div className="w-full ml-[14rem]">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>

        <Toaster />
      </div>
    </div>
  );
}
