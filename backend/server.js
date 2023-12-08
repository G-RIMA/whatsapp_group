// server.js
const express = require('express');
const ngrok = require('ngrok');
const rp = require('request-promise-native');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;
const User = require('./models/User');

require('dotenv').config();

let url = process.env.DATABASE_URL
app.use(express.json());

// Enable CORS for all routes
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));


mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl:true
});


const INSTANCE_URL = 'https://api.maytapi.com/api';
const PRODUCT_ID = '017c4f52-6a3d-472b-a846-06a7993f4ba4';
const PHONE_ID = '37605';
const API_TOKEN = '03c552bf-b164-4c76-afa1-7ab76fbed86a';


// Function to set up the ngrok tunnel and register the webhook
async function setup_network() {
    let public_url = await ngrok.connect(3000);
    console.log(`Public Url: ${public_url}`);
    let webhook_url = `${public_url}/webhook`;
    let url = `${INSTANCE_URL}/${PRODUCT_ID}/setWebhook`;
    let response = await rp(url, {
      method: 'POST',
      body: { webhook: webhook_url },
      headers: {
        'x-maytapi-key': API_TOKEN,
        'Content-Type': 'application/json',
      },
      json: true,
    });
    console.log(`Response: ${JSON.stringify(response)}`);
  }

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: error });
  }
};

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // User with the provided email already exists
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Successfully logged in' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/updateMaytapiCredentials', async (req, res) => {
  try {
    // Log received token
    //console.log('Received Token', req.header('Authorization'));

    // Extract token from Authorization header
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = tokenHeader.replace('Bearer ', '');
    //console.log('Token:', token);

    // Decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      //console.log('Decoded:', decoded);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Retrieve user from the database
    const user = await User.findById(decoded.userId);
    //console.log('User:', user);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: Invalid user' });
    }

    // Extract information from the request body
    const { maytapiProductId, maytapiPhoneId, maytapiApiToken } = req.body;

    // Update Maytapi credentials for the user
    await User.findByIdAndUpdate(decoded.userId, {
      maytapiProductId,
      maytapiPhoneId,
      maytapiApiToken,
    });

    res.json({ message: 'Maytapi credentials updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/createWhatsAppGroup', verifyToken, async (req, res) => {
  try {
    const { groupName, participantNumbers } = req.body;
    const userId = req.user._id;

    // Assuming you have a User model with maytapiProductId, maytapiApiToken, and maytapiPhoneId fields
    const user = await User.findById(userId);
    
    if (!user || !user.maytapiProductId || !user.maytapiApiToken || !user.maytapiPhoneId) {
      return res.status(400).json({ message: 'Maytapi credentials are missing for the user' });
    }

    const groupCreationResult = await createGroup(
      user.maytapiProductId,
      user.maytapiApiToken,
      user.maytapiPhoneId,
      groupName,
      participantNumbers
    );

    res.json(groupCreationResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Handler for the root path
app.get('/', (req, res) => {
  res.send('Hello, this is your server!');
});

app.listen(PORT, async () => {
  console.log(`Server listening at http://localhost:${PORT}`);
  await setup_network();
});

