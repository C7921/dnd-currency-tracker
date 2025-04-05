const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const characterRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:"]
    }
  }
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', apiLimiter);

// Body parser middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// Routes
app.use('/api/characters', characterRoutes);

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