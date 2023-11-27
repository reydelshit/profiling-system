import { Outlet, useLocation } from 'react-router-dom';

import App from '@/App';
import Sidebar from '../Sidebar';

export default function Root() {
  const location = useLocation();

  return (
    <div className="w-full border-2">
      {/* <Header /> */}
      <div className="flex border-2">
        <Sidebar />
        <div className="w-full px-2">
          {location.pathname === '/' ? <App /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}
