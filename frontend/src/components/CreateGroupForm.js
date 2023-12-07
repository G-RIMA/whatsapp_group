import React, { useState } from 'react';
import "./create.css";


const CreateGroupForm = () => {
  const [groupName, setGroupName] = useState('');
  const [participantNumbers, setParticipantNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [groupCreated, setGroupCreated] = useState(false);

  const handleCreateGroup = async () => {
    try {
      // Set loading to true while the request is in progress
      setLoading(true);

      // Replace with your actual values
      const apiUrl = 'https://api.maytapi.com/api';
      const apiToken = '03c552bf-b164-4c76-afa1-7ab76fbed86a';
      const productId = '017c4f52-6a3d-472b-a846-06a7993f4ba4';
      const phoneId = '37605';

      // Prepare the request payload
      const groupData = {
        name: groupName,
        numbers: participantNumbers.split(',').map(number => number.trim()),
      };

      // Make the API request
      const response = await fetch(`${apiUrl}/${productId}/${phoneId}/createGroup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-maytapi-key': apiToken,
        },
        body: JSON.stringify(groupData),
      })
      
      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        // Group created successfully
        setGroupCreated(true);

        // Clear form fields
        setGroupName('');
        setParticipantNumbers('');

        // Reload the page after a delay
        setTimeout(() => {
          window.location.reload();

        }, 2000);
        // Display success message
        console.log('WhatsApp group created successfully!');

      } else {
        // Handle errors or show appropriate error messages
        console.error('Error creating WhatsApp group:', await response.text());
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      // Reset loading state after the request completes
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md"> 
      <h2 className="text-2xl font-bold mb-6">Create WhatsApp Group</h2>
      {groupCreated ? (
        <p className="text-green-500">Group created successfully!</p>
      ) : (
      <form>
        <label className="block mb-4">
          Group Name:
          <input  type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Enter group name"
            className="mt-1 p-2 border border-gray-800 rounded-md w-full"/>
        </label>
        <br />
        <label className="block mb-4">
          Participant Numbers:
          <input type="text" value={participantNumbers} onChange={(e) => setParticipantNumbers(e.target.value)} placeholder="Enter participant numbers (separated by commas)"
            className="mt-1 p-2 border border-gray-800 rounded-md w-full"/>
        </label>
        <br />
        <button type="button" onClick={handleCreateGroup} disabled={loading} className="bg-green-500 text-white p-2 rounded-md w-full">
          {loading ? 'Creating Group...' : 'Create Group'}
        </button>
      </form>
      )}
    </div>
  );
};

export default CreateGroupForm;
