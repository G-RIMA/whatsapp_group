// createGroup.js

const axios = require('axios');

const createGroup = async (apiUrl, apiToken, phoneId, groupName, participantNumbers) => {
  try {
    const response = await axios.post(
      `${apiUrl}/${phoneId}/createGroup`,
      {
        name: groupName,
        numbers: participantNumbers
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-maytapi-key': apiToken
        }
      }
    );

    const responseData = response.data;
    console.log(responseData);

    return responseData;

  } catch (error) {
    console.error('Error:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = createGroup;
