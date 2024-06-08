const express = require('express');
const { initializeSocket } = require('../utils/sockets');

const router = express.Router();

router.get('/socket.io/socket.io.js', (req, res) => {
  res.setHeader('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, '../node_modules/socket.io/client-dist/socket.io.js'));
});

module.exports = router;
