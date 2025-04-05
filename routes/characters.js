const express = require('express');
const router = express.Router();
const Character = require('../models/character');
// Update the character creation route in routes/characters.js
router.post('/', async (req, res) => {
  try {
    // Debug the incoming request
    console.log('Received character creation request');
    console.log('Request body:', req.body);
    
    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing' });
    }
    
    // Check if name is provided
    if (!req.body.name) {
      return res.status(400).json({ message: 'Character name is required' });
    }
    
    // Create the character with validation
    const character = new Character({
      name: req.body.name,
      currency: {
        platinum: req.body.currency?.platinum || 0,
        gold: req.body.currency?.gold || 0,
        electrum: req.body.currency?.electrum || 0,
        silver: req.body.currency?.silver || 0,
        copper: req.body.currency?.copper || 0
      }
    });

    const newCharacter = await character.save();
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error('Error creating character:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a character's currency
router.patch('/:id', async (req, res) => {
  try {
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
    res.json(updatedCharacter);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a character
router.delete('/:id', async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    // In newer Mongoose versions, .remove() is deprecated, use deleteOne instead
    await Character.deleteOne({ _id: req.params.id });
    res.json({ message: 'Character deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;