const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// User Data Schema
const userDataSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  gender: String,
  city: String,
  username: String,
  profilePicture: {
    path: String, // Store the file path
  },
});

const UserData = mongoose.model('UserData', userDataSchema);

// Consignment Schema
const consignmentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  fromcity: { type: String, required: true },
  weight: { type: Number, required: true },
  weightUnit: { type: String, required: true },
  length: { type: Number, required: true },
  breadth: { type: Number, required: true },
  height: { type: Number, required: true },
  cityInput: { type: String, required: true },
  Transport: { type: String, required: true },
  StartDate: { type: String, required: true },
  StartTime: { type: String, required: true },
  ArrivalDate: { type: String, required: true },
  ArrivalTime: { type: String, required: true },
  consignmentPhotoPath: { type: String },  // Store the path to the consignment photo
  submitTime: { type: Date, default: Date.now }  // Added field for submission time
});

const Consignment = mongoose.model('Consignment', consignmentSchema);

// Delivery Schema
const deliverySchema = new mongoose.Schema({
  username: String, 
  currentLocation: String,
  travelingLocation: String,
  meansOfTravel: String,
  startDate: String,
  startTime: String,
  arrivalDate: String,
  arrivalTime: String,
  submissionDateTime: { type: Date, default: Date.now }
});

// const UserData1 = userDataDB.model('UserData', userDataSchema);

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = {
  User,
  UserData,
  Consignment,
  Delivery
};
