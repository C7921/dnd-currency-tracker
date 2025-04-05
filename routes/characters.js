const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// Get all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find().sort({ createdAt: -1 });
    res.json(characters);
  } catch (err) {
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
    res.status(500).json({ message: err.message });
  }
});

// Create a new character
router.post('/', async (req, res) => {
  const character = new Character({
    name: req.body.name,
    currency: req.body.currency || {}
  });

  try {
    const newCharacter = await character.save();
    res.status(201).json(newCharacter);
  } catch (err) {
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