const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const characterRoutes = require('./routes/characters');

// Environment configuration
const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8080;

// Database connection config - Docker-aware configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb:27017/dnd-currency-dev';

// Initialize Express app
const app = express();

// Body parser middleware - ENSURE THESE COME BEFORE ROUTES
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Logging middleware - more verbose in development
app.use((req, res, next) => {
  console.log(`[${ENV}] ${req.method} ${req.url}`);
  
  if (ENV === 'development' && req.method === 'POST') {
    console.log('Request headers:', {
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length']
    });
    console.log('Request body:', req.body);
  }
  next();
});

// Health check endpoint (useful for container health checks and DigitalOcean)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Database connection test endpoint (development only)
if (ENV === 'development') {
  app.get('/api/db-test', async (req, res) => {
    try {
      const dbState = mongoose.connection.readyState;
      const stateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      
      res.json({
        connected: dbState === 1,
        state: stateMap[dbState],
        database: mongoose.connection.db?.databaseName || 'not connected',
        host: mongoose.connection.host
      });
    } catch (error) {
      res.status(500).json({
        connected: false,
        error: error.message
      });
    }
  });
  
  // Test endpoint to verify body parsing works
  app.post('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    console.log('Received body:', req.body);
    res.json({
      message: 'Test successful',
      receivedBody: req.body,
      bodyEmpty: !req.body || Object.keys(req.body).length === 0
    });
  });
}

// Connect to MongoDB with improved settings
console.log(`Running in ${ENV} mode`);
console.log(`Connecting to database: ${MONGODB_URI}`);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000, // 1 minute timeout
  socketTimeoutMS: 60000, // 1 minute timeout
  connectTimeoutMS: 60000, // 1 minute timeout
  heartbeatFrequencyMS: 1000, // Check connection more often
  retryWrites: true,
  retryReads: true,
})
.then(() => {
  console.log('✅ Successfully connected to MongoDB');
  console.log(`Database: ${mongoose.connection.db.databaseName}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('Please check your MongoDB URI and network settings.');
  
  // Extra debugging info for development
  if (ENV === 'development') {
    console.error('\nDebugging tips:');
    console.error('1. Check if MongoDB container is running:');
    console.error('   docker ps | grep mongodb');
    console.error('2. Check MongoDB logs:');
    console.error('   docker logs mongodb');
    console.error('3. Try connecting to MongoDB manually:');
    console.error('   docker exec -it dnd-currency-app mongo mongodb://mongodb:27017/dnd-currency-dev');
  }
});

// API Routes
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
    timestamp: new Date().toISOString(),
    environment: ENV
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: ENV === 'production' ? {} : err
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENV} mode`);
  console.log(`http://localhost:${PORT}`);
});