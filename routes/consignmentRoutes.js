const express = require('express');
const multer = require('multer');
const path = require('path');
const isAuthenticated = require('../middleware/authMiddleware');
const { Consignment } = require('../mongoose/schemas');
const storageConfig = require('../utils/storage');

const router = express.Router();
const upload = multer({ storage: storageConfig('uploads/consignment/') });

router.post('/submit-consignment', upload.single('consignmentPhoto'), async (req, res) => {
  try {
    const requiredFields = [
      'fromcity', 'weight', 'weightUnit', 'length', 'breadth', 'height',
      'cityInput', 'Transport', 'StartDate', 'StartTime', 'ArrivalDate', 'ArrivalTime'
    ];
    if (!requiredFields.every(field => req.body[field])) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    const { fromcity, weight, weightUnit, length, breadth, height, cityInput, Transport, StartDate, StartTime, ArrivalDate, ArrivalTime } = req.body;
    const consignmentPhoto = req.file;
    const username = req.session.username;
    const consignment = new Consignment({
      username, fromcity, weight, weightUnit, length, breadth, height, cityInput, Transport,
      StartDate, StartTime, ArrivalDate, ArrivalTime, consignmentPhotoPath: consignmentPhoto ? consignmentPhoto.path : null
    });
    await consignment.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting consignment:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.', error: error.message });
  }
});

router.get('/get-entries',isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;

    // Fetch the entries for the current user
    const entries = await Consignment.find({ username }).sort({ submitTime: -1 });

    res.status(200).json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.', error: error.message });
  }
});

router.get('/get-entry-count',isAuthenticated, async (req, res) => {
  try {
    const username = req.session.username;

    // Fetch the count of entries for the current user
    const entryCount = await Consignment.countDocuments({ username });

    res.status(200).json({ success: true, entryCount });
  } catch (error) {
    console.error('Error fetching entry count:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.', error: error.message });
  }
});

router.post('/update-entry/:entrysubmittime', upload.single('consignmentPhoto'), async (req, res) => {
  const entrysubmittime = req.params.entrysubmittime;
  const updatedEntryData = req.body;
  // console.log('Received entrysubmittime:', entrysubmittime);

  try {
    // Find the entry to update
    const entryToUpdate = await Consignment.findOne({ submitTime: entrysubmittime });

    if (!entryToUpdate) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    

    // Update the entry data
    entryToUpdate.location = updatedEntryData.location;
    entryToUpdate.address = updatedEntryData.address;
    entryToUpdate.weight = updatedEntryData.weight;
    entryToUpdate.weightUnit = updatedEntryData.weightUnit;
    entryToUpdate.length = updatedEntryData.length;
    entryToUpdate.breadth = updatedEntryData.breadth;
    entryToUpdate.height = updatedEntryData.height;
    entryToUpdate.cityInput = updatedEntryData.cityInput;
    entryToUpdate.Transport = updatedEntryData.Transport;
    entryToUpdate.city = updatedEntryData.city;

    // Handle consignment photo update
    if (req.file) {
      const consignmentPhotoPath = req.file.path;
      entryToUpdate.consignmentPhotoPath = consignmentPhotoPath;
    }

    // Save the updated entry data
    await entryToUpdate.save();

    res.json({ success: true, message: 'Entry updated successfully' });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/get-entry/:entrysubmittime', async (req, res) => {
  const { entrysubmittime } = req.params;
  const decodedSubmitTime = decodeURIComponent(entrysubmittime);
  // console.log('Received entrysubmittime:', decodedSubmitTime);

  try {
    const entry = await Consignment.findOne({ submitTime: new Date(decodedSubmitTime) });

    if (!entry) {
      console.log('Entry not found for query:', { submitTime: new Date(decodedSubmitTime) });
      return res.status(404).json({ success: false, message: 'Entry not found.' });
    }

    // console.log('Found entry:', entry);
    res.json({ success: true, entry });
  } catch (error) {
    console.error('Error fetching entry details:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
});

router.delete('/delete-entry/:submitTime', async (req, res) => {
  const { submitTime } = req.params;

  try {
    // Find the entry by submission time
    const entry = await Consignment.findOne({ submitTime });

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found.' });
    }

    // Delete the consignment photo if it exists
    if (entry.consignmentPhotoPath) {
      // Add code here to delete the consignment photo from your storage system
      // For example, if the photos are stored on the server, you might use fs.unlink
      const fs = require('fs');
      fs.unlink(entry.consignmentPhotoPath, (err) => {
        if (err) {
          console.error('Error deleting consignment photo:', err);
        }
      });
    }

    // Delete the entry from the database
    const deletedEntry = await Consignment.findOneAndDelete({ submitTime });

    res.json({ success: true, deletedEntry });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
});



module.exports = router;
