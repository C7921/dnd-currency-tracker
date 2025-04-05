const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// Get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.json(characters);
  } catch (err) {
    console.error('Error fetching characters:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a single character
router.get('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    res.json(character);
  } catch (err) {
    console.error('Error fetching character:', err);
    res.status(500).json({ message: err.message });
  }
});

// Create a new character
router.post('/', async (req, res) => {
  console.log('Received character creation request');
  console.log('Raw body type:', typeof req.body);
  console.log('Request body:', req.body);
  
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  
  // Try manual parsing as fallback if body is a string
  let characterData = req.body;
  if (typeof req.body === 'string') {
    try {
      console.log('Body is a string, attempting to parse JSON');
      characterData = JSON.parse(req.body);
    } catch (parseError) {
      console.error('Failed to parse body string as JSON', parseError);
      return res.status(400).json({ message: 'Invalid JSON in request body' });
    }
  }
  
  try {
    // Check for name
    if (!characterData.name) {
      return res.status(400).json({ message: 'Character name is required' });
    }
    
    // Create the character
    const character = new Character({
      name: characterData.name,
      currency: {
        platinum: characterData.currency?.platinum || 0,
        gold: characterData.currency?.gold || 0,
        electrum: characterData.currency?.electrum || 0,
        silver: characterData.currency?.silver || 0,
        copper: characterData.currency?.copper || 0
      }
    });
    
    console.log('Saving character:', character);
    const newCharacter = await character.save();
    console.log('Character saved successfully:', newCharacter);
    
    return res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error creating character:', err);
    return res.status(400).json({ message: err.message });
  }
});

// Update a character's currency
router.patch('/:id', async (req, res) => {
  try {
    console.log('Updating character:', req.params.id);
    console.log('Update data:', req.body);
    
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }

    if (req.body.name) {
      character.name = req.body.name;
    }
    
    if (req.body.currency) {
      // Update only the provided currency fields
      for (const [key, value] of Object.entries(req.body.currency)) {
        if (character.currency.hasOwnProperty(key)) {
          character.currency[key] = value;
        }
      }
    }

    const updatedCharacter = await character.save();
    console.log('Character updated successfully:', updatedCharacter);
    res.json(updatedCharacter);
  } catch (err) {
    console.error('Error updating character:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a character
router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting character:', req.params.id);
    
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // In newer Mongoose versions, .remove() is deprecated, use deleteOne instead
    await Character.deleteOne({ _id: req.params.id });
    console.log('Character deleted successfully');
    res.json({ message: 'Character deleted' });
  } catch (err) {
    console.error('Error deleting character:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;