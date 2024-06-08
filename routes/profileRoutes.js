const express = require('express');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../middleware/authMiddleware');
const { UserData } = require('../mongoose/schemas');
const storageConfig = require('../utils/storage');

const router = express.Router();
const upload = multer({ storage: storageConfig('uploads/profilephotos/') });

router.get('/profile', isAuthenticated, async (req, res) => {
  const username = req.session.username;
  const userData = await UserData.findOne({ username });
  res.sendFile(path.join(__dirname, '../dashboard/profile.html'));
});

router.post('/submit-profile', isAuthenticated, upload.single('profilePicture'), async (req, res) => {
  try {
    const username = req.session.username;
    const { name, email, age, gender, city } = req.body;
    const profilePicture = req.file;
    let existingUser = await UserData.findOne({ username });
    if (existingUser) {
      existingUser.name = name;
      existingUser.email = email;
      existingUser.age = age;
      existingUser.gender = gender;
      existingUser.city = city;
      existingUser.username = username;
      if (profilePicture) {
        if (existingUser.profilePicture && existingUser.profilePicture.path) {
          fs.unlinkSync(existingUser.profilePicture.path);
        }
        existingUser.profilePicture.path = profilePicture.path;
      }
      await existingUser.save();
      return res.status(200).json({ success: true });
    } else {
      const newUser = new UserData({
        username, name, email, age, gender, city,
        profilePicture: { path: profilePicture ? profilePicture.path : null }
      });
      await newUser.save();
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error submitting profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.', error: error.message });
  }
});

router.get('/get-username', isAuthenticated, (req, res) => {
  res.json({ username: req.session.username });
});







router.get('/get-user-data', isAuthenticated, async (req, res) => {
  try {
    // Retrieve the username from the session
    const username = req.session.username;

    // Find the user in the 'userdatas' collection of the first database
    const userDataDB1 = await UserData.findOne({ username });

    if (userDataDB1) {
      // If user data is found in the first database, send it as a JSON response
      res.json(userDataDB1);
    } else {
      // If user data is not found in the first database, send default user data as a JSON response
      const defaultUserData = {
        username: req.session.username,
        name: 'your name',
        email: 'Your email address',
        age: 'your age',
        gender: '',
        city: 'your city',
      };

      res.json(defaultUserData);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});



module.exports = router;
