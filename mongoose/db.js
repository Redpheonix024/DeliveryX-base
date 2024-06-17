const mongoose = require('mongoose');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {connectDB};

// const OPEN_CAGE_API_KEY = '5de792025e9c498184efcbd0510d4414';
