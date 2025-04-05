const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const characterRoutes = require('./routes/characters');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB - Using in-memory MongoDB for simplicity
// In production, you'll want to use a real MongoDB instance
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dnd-currency', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
mongoose.connect(process.env.MONGODB_URI || 'mongodb://host.docker.internal:27017/dnd-currency', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/characters', characterRoutes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
