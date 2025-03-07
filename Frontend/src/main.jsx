import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import RouteData from './Routes/RouteData';
import ErrorPage from './Routes/ErrorPage';
import Console from './Console.jsx';
import PrintPage from './PrintPage.jsx';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/modify/:id" element={<RouteData />} />
        <Route path="/console" element={<Console />} />
        <Route path="/printpage" element={<PrintPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
