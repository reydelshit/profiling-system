import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './components/Root/Root.tsx';
import ManageResident from './components/ManageResident.tsx';
import ManageHousehold from './components/ManageHousehold.tsx';

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
        path: '/manage-household',
        element: <ManageHousehold />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
