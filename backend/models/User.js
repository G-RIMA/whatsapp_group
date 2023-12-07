const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  maytapiProductId: String,
  maytapiPhoneId: String,
  maytapiApiToken: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
