import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import App from '@/App';
import Sidebar from '../Sidebar';

export default function Root() {
  const location = useLocation();

  const isLogin = localStorage.getItem('isLogin');

  // if (location.pathname === '/login') return <App />;

  if (!isLogin) {
    return (window.location.href = '/login');
  }

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
