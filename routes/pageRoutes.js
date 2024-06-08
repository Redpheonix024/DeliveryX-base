const express = require('express');
const path = require('path');
const isAuthenticated = require('../middleware/authMiddleware');
const router = express.Router();
const { UserData } = require('../mongoose/schemas');
const { Consignment } = require('../mongoose/schemas');
const { Delivery } = require('../mongoose/schemas');
const { User } = require('../mongoose/schemas');

router.get('/login', (req, res) => {
  if (req.session && req.session.username) {
    res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/logout.html'));
});


router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/dashboard.html'));
});

router.get('/settings', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;

  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname, '../dashboard/setting.html'));
});

router.get('/sender-page', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;


  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname, '../dashboard/sender.html'));
});

router.get('/delivery-person-page', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;

  
  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname,'../dashboard/deliver.html'));
});

router.get('/delivery-option-page', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;

  
  // Send the dashboard page with the username
 res.sendFile(path.join(__dirname,'../dashboard/deliveropt.html'));
});

router.get('/chat-page', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;

  
  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname, '../chatbox/chat.html'));
});

router.get('/entries', isAuthenticated, (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;


  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname,'../dashboard/entries.html'));
});

router.get('/deleventeries', isAuthenticated,  (req, res) => {
  // Retrieve the username from the session
  const username = req.session.username;


  // Send the dashboard page with the username
  res.sendFile(path.join(__dirname,'../dashboard/deleverent.html'));
});

router.get('/update-entry-page', isAuthenticated, (req, res) => {
  // Here you can send the HTML file for the update-entry page
  res.sendFile(path.join(__dirname,'../dashboard/updateenteries.html'));
});

router.get('/update-delentry-page',  (req, res) => {
  // Here you can send the HTML file for the update-entry page
  res.sendFile(path.join(__dirname,'../dashboard/update_delevery.html'));
});

// Add other page routes similarly...

module.exports = router;
