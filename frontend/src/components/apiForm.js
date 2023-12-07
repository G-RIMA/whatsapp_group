import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./create.css";

const MaytapiCredentialsForm = () => {
  const [maytapiProductId, setMaytapiProductId] = useState('');
  const [maytapiPhoneId, setMaytapiPhoneId] = useState('');
  const [maytapiApiToken, setMaytapiApiToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token: ', token);

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      console.log('Headers:', headers);

      const response = await axios.post(
        'http://localhost:3001/updateMaytapiCredentials',
        {
          maytapiProductId,
          maytapiPhoneId,
          maytapiApiToken,
        },
        {
          headers,
        }
      );

      console.log('Maytapi credentials updated successfully:', response.data.message);
      navigate('/createWhatsAppGroup');
    } catch (error) {
      console.error('Error updating Maytapi credentials:', error.message);
      setErrorMessage('Error updating Maytapi credentials. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maytapiProductId">
              Maytapi Product ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="maytapiProductId"
              type="text"
              placeholder="Maytapi Product ID"
              value={maytapiProductId}
              onChange={(e) => setMaytapiProductId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maytapiPhoneId">
              Maytapi Phone ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="maytapiPhoneId"
              type="text"
              placeholder="Maytapi Phone ID"
              value={maytapiPhoneId}
              onChange={(e) => setMaytapiPhoneId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maytapiApiToken">
              Maytapi API Token
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="maytapiApiToken"
              type="text"
              placeholder="Maytapi API Token"
              value={maytapiApiToken}
              onChange={(e) => setMaytapiApiToken(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaytapiCredentialsForm;
