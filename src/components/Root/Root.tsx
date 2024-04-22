import { Navigate, Outlet, useLocation } from 'react-router-dom';

import App from '@/App';
import Sidebar from '../Sidebar';

export default function Root() {
  const location = useLocation();

  const profiling_token = localStorage.getItem('profiling_token');

  // if (location.pathname === '/login') return <App />;

  if (!profiling_token) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className="w-full">
      {/* <Header /> */}
      <div className="flex ">
        <Sidebar />
        <div className="w-full">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
