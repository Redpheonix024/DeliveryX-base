const express = require('express');
const multer = require('multer');
const storageConfig = require('../utils/storage');

const router = express.Router();

const uploadAudio = multer({ storage: storageConfig('chats/upload/voicenotes') });
const uploadImage = multer({ storage: storageConfig('chats/upload/images') });

router.post('/upload/audio', uploadAudio.single('audio'), (req, res) => {
  res.json({ filename: req.file.filename });
});

router.post('/upload/image', uploadImage.single('image'), (req, res) => {
  res.json({ filename: req.file.filename });
});

module.exports = router;
