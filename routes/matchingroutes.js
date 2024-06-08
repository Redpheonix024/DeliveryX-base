const { Consignment } = require('../mongoose/schemas');
const express = require('express');
const isAuthenticated = require('../middleware/authMiddleware');
const { Delivery } = require('../mongoose/schemas');

const router = express.Router();


router.get('/get-matched-packages', isAuthenticated ,async (req, res) => {
    try {
      // Fetch all consignments and deliveries
      const consignments = await Consignment.find().lean();
      const deliveries = await Delivery.find().lean();
  
      // Perform matching logic
      const matchedPackages = [];
  
      consignments.forEach(consignment => {
        deliveries.forEach(delivery => {
          if (consignment.fromcity === delivery.currentLocation && consignment.cityInput === delivery.travelingLocation) {
            matchedPackages.push({ consignment, delivery });
          }
        });
      });
  
      res.json({ matchedPackages });
    } catch (error) {
      console.error('Error fetching and matching packages:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  module.exports = router;