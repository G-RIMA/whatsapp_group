import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import CreateGroupForm from './components/CreateGroupForm';
import MaytapiCredentialsForm from './components/apiForm';
import Home from './components/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/home" element={<Home/>} />
          <Route exact path="/" element={<SignupForm />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/createWhatsAppGroup" element={<CreateGroupForm />} />
          <Route exact path="/api" element={ <MaytapiCredentialsForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

