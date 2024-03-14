import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Clearance from './components/Clearance.tsx';
import Login from './components/Login.tsx';
import ManageHousehold from './components/ManageHousehold.tsx';
import ManageResident from './components/ManageResident.tsx';
import ManageResidentView from './components/ManageResidentView.tsx';
import Register from './components/Register.tsx';
import Root from './components/Root/Root.tsx';
import Settings from './components/Settings.tsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/manage-resident',
        element: <ManageResident />,
      },

      {
        path: '/manage-resident/:id',
        element: <ManageResidentView />,
      },

      {
        path: '/manage-resident/clearance',
        element: <Clearance />,
      },

      {
        path: '/manage-household',
        element: <ManageHousehold />,
      },

      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },

  {
    path: '/register',
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
