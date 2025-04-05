const mongoose = require('mongoose');

// Database URL
const MONGODB_URI = 'mongodb://mongodb:27017/dnd-currency-dev';

console.log('Testing connection to MongoDB...');
console.log(`Connection URI: ${MONGODB_URI}`);

// Define a test schema
const TestSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});

// Create a model
const Test = mongoose.model('Test', TestSchema);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000
})
.then(async () => {
  console.log('✅ Successfully connected to MongoDB');
  console.log(`Database: ${mongoose.connection.db.databaseName}`);
  
  try {
    // Create a test document
    console.log('Creating test document...');
    const test = new Test({ name: 'Test Document' });
    const savedTest = await test.save();
    console.log('Test document saved successfully:', savedTest);
    
    // Find all documents
    const allTests = await Test.find();
    console.log(`Found ${allTests.length} documents in the Test collection`);
    
    // Success message
    console.log('✅ Database connection and operations successful!');
  } catch (err) {
    console.error('❌ Error during database operations:', err);
  } finally {
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});
