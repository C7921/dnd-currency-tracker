const mongoose = require('mongoose');
const Character = require('../models/character');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dnd-currency';

// Sample data
const sampleCharacters = [
  {
    name: 'Aragorn',
    currency: {
      platinum: 5,
      gold: 35,
      electrum: 0,
      silver: 12,
      copper: 7
    }
  },
  {
    name: 'Gandalf',
    currency: {
      platinum: 10,
      gold: 120,
      electrum: 15,
      silver: 30,
      copper: 0
    }
  },
  {
    name: 'Gimli',
    currency: {
      platinum: 0,
      gold: 40,
      electrum: 0,
      silver: 50,
      copper: 120
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Character.deleteMany({});
    console.log('Cleared existing characters');
    
    // Add sample data
    const result = await Character.insertMany(sampleCharacters);
    console.log(`Added ${result.length} sample characters`);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
