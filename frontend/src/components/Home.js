// Home.js
import React from 'react';
import MaytapiCredentialsForm from './apiForm';
import './create.css';

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 shadow-md rounded-md mt-8">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome to WhatsApp Group Creator!</h1>
      <p className="text-gray-700">
        To easily create a WhatsApp group using this website, follow these steps:
      </p>

      <div className="mt-4">
        <p className="text-lg leading-tight font-medium text-black hover:underline">
          1. Create an account on{' '}
          <a href="https://maytapi.com/" className="text-green-700 underline">
            Maytapi
          </a>{' '}
          to get your credentials.
        </p>
      </div>

      <div className="mt-4">
        <p className="text-lg leading-tight font-medium text-black hover:underline">
          2. Follow the steps in the video below to create a WhatsApp group using Maytapi:
        </p>
        

        <p className="text-lg leading-tight font-medium text-black hover:underline">
        Follow the steps on this page. Take the steps step by step:
          <a href ="https://docs.rumwork.io/messaging-channels/whatsapp-integration/maytapi" className="text-green-700 underline"  > Maytapi</a>
        </p>
        

      </div>

      <div className="mt-8">
        <p className="text-lg leading-tight font-medium text-black">
          3. Fill out the form below with the required credentials:
        </p>
        <MaytapiCredentialsForm />
      </div>
    </div>
  );
};

export default Home;
