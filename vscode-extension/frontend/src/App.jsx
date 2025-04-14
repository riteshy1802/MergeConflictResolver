import Home from "./components/Home"
import React from "react";
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Login } from "./components/Login/Login";
import LoginSuccess from "./components/LoginSuccess/LoginSuccess";

function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/oauth-success/" element={<LoginSuccess />} />
      </Routes>
    </HashRouter>
  )
}

export default App
