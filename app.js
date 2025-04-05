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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dnd-currency';

// Connect to MongoDB with improved error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  retryWrites: true
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Connection string:', MONGODB_URI.includes('@') ? 
    MONGODB_URI.replace(/(mongodb(\+srv)?:\/\/[^:]+:)[^@]+(@.+)/, '$1*****$3') : 
    MONGODB_URI);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  if (process.env.NODE_ENV === 'production') {
    console.error('Warning: Could not connect to MongoDB.');
  }
});

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