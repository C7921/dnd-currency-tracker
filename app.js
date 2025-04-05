const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const characterRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 8080; // Default to 8080 if PORT is not set
console.log(`App configured to listen on port: ${PORT}`);
console.log(`Environment PORT variable is: ${process.env.PORT}`);



// Routes
app.use('/api/characters', characterRoutes);

// Add this function after your mongoose connection setup
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Add this route before other routes
app.get('/health', (req, res) => {
  console.log('Health check endpoint called');
  
  if (isMongoConnected()) {
    console.log('Health check: MongoDB is connected');
    return res.status(200).send({
      status: 'ok',
      message: 'Application is healthy',
      mongodb: 'connected',
      timestamp: new Date().toISOString()
    });
  }
  
  console.log('Health check: MongoDB is NOT connected');
  return res.status(200).send({
    status: 'warning',
    message: 'Application is running but MongoDB is not connected',
    mongodb: 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line for form submissions
app.use(express.static(path.join(__dirname, 'public')));

// Basic security headers without helmet
app.use((req, res, next) => {
  // Set security headers manually
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// MongoDB connection string - prioritizing environment variable
const MONGODB_URI = process.env.MONGODB_URI // || 'mongodb://localhost:27017/dnd-currency';


if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set. Using local fallback.');
  // Only use localhost as a fallback in development
  if (process.env.NODE_ENV !== 'production') {
    mongoose.connect('mongodb://localhost:27017/dnd-currency', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log('Connected to local MongoDB'))
    .catch(err => console.error('Failed to connect to local MongoDB:', err));
  } else {
    console.error('No MongoDB connection string provided in production! Application will not function correctly.');
  }
} else {
  console.log('Connecting to MongoDB using provided URI...');
  // Connect using the environment variable
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log('Successfully connected to MongoDB');
    // Mask the password in logs for security
    const maskedUri = MONGODB_URI.replace(
      /(mongodb(\+srv)?:\/\/[^:]+:)([^@]+)(@.+)/,
      '$1*****$4'
    );
    console.log(`Connection string: ${maskedUri}`);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Please check your MongoDB URI and network settings.');
  });
}

app.use('*', (req, res) => {
  console.log(`Received request at unexpected route: ${req.originalUrl}`);
  res.status(200).send({
    message: `Received request at ${req.originalUrl}`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});