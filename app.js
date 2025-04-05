const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const characterRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 8080;

// Body parser middleware - ENSURE THESE COME BEFORE ROUTES
// The order of middleware is important!
app.use(express.json()); // Use Express's built-in JSON parser
app.use(express.urlencoded({ extended: true })); // For parsing form data
// Keep bodyParser for backward compatibility
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Basic security headers 
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Debug middleware to log request bodies
app.use((req, res, next) => {
  if (req.method === 'POST') {
    console.log('DEBUG - Request URL:', req.url);
    console.log('DEBUG - Request Headers:', req.headers);
    console.log('DEBUG - Content-Type:', req.headers['content-type']);
    console.log('DEBUG - Request Body:', req.body);
  }
  next();
});

// Health check endpoint for DigitalOcean
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// MongoDB connection string - prioritizing environment variable
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  if (process.env.NODE_ENV !== 'production') {
    // Only use localhost as a fallback in development
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

// Routes
app.use('/api/characters', characterRoutes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all route to help debug unexpected requests
app.use('*', (req, res) => {
  console.log(`Received request at unexpected route: ${req.originalUrl}`);
  res.status(200).send({
    message: `Received request at ${req.originalUrl}`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`PORT environment variable: ${process.env.PORT}`);
  console.log(`App configured to listen on port: ${PORT}`);
  console.log(`Environment PORT variable is: ${process.env.PORT}`);
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});