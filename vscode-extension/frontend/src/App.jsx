import React, { useEffect } from "react";
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from "./components/Home";
import { Login } from "./components/Login/Login";
import LoginSuccess from "./components/LoginSuccess/LoginSuccess";

function NavigationHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleMessage = (event) => {
      const message = event.data;
      if (message && message.type === 'EXTENSION_NAVIGATE') {
        console.log('Received navigation command:', message.path);
        navigate(message.path);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate]);
  
  return null;
}

function App() {
  return (
    <HashRouter>
      <NavigationHandler />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/oauth-success" element={<LoginSuccess />} />
      </Routes>
    </HashRouter>
  );
}

export default App;