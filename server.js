const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
// const flash = require('connect-flash');
const https = require('https');
const path = require('path');
const { PORT, privateKey, certificate, sessionSecret } = require('./config');
const connectDB = require('./db');
// const flashMiddleware = require('./middleware/flashMiddleware');
const isAuthenticated = require('./middleware/authMiddleware');
const initializeSocket = require('./utils/sockets');
const MongoStore = require('connect-mongo'); // Import connect-mongo

// Initialize express app
const app = express();
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

// Connect to database
connectDB();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, // Change to your MongoDB connection string
    ttl:   60 // Session expiration time in seconds
  })
}));
// app.use(flashMiddleware);

// Routes setup
const authRoutes = require('./routes/authRoutes');
const pageRoutes = require('./routes/pageRoutes');
const profileRoutes = require('./routes/profileRoutes');
const consignmentRoutes = require('./routes/consignmentRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const socketRoutes = require('./routes/socketRoutes');
const matchingRoutes = require('./routes/matchingroutes');

app.use(authRoutes);
app.use(pageRoutes);
app.use(profileRoutes);
app.use(consignmentRoutes);
app.use(deliveryRoutes);
app.use(uploadRoutes);
app.use(socketRoutes);
app.use(matchingRoutes);

app.use('/chats/upload/images', express.static(path.join(__dirname, 'chats/upload/images')));
app.use('/chats/upload/voicenotes', express.static(path.join(__dirname, 'chats/upload/voicenotes')));


// Initialize socket.io
initializeSocket(httpsServer);





// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
