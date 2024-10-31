import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RouteData from './Routes/RouteData';
import ErrorPage from './Routes/ErrorPage';
import Console from './Console.jsx'; // Capitalize Console
import PrintPage from './PrintPage.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/modify/:id",
    element: <RouteData />
  },
  {
    path: "/console", // Corrected route to lowercase
    element: <Console /> // Capitalize Console
  },
  {
    path: "/printpage", // Corrected route to lowercase
    element: <PrintPage /> // Capitalize Console
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
