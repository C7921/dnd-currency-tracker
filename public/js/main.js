document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing application...');
  
  // DOM elements
  const characterForm = document.getElementById('character-form');
  const characterList = document.getElementById('character-list');
  const characterTemplate = document.getElementById('character-template');
  
  // Fetch all characters
  const fetchCharacters = async () => {
    try {
      console.log('Fetching characters...');
      const response = await fetch('/api/characters');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch characters: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Characters fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      return [];
    }
  };
  
  // Add a new character - SIMPLIFIED FOR TESTING
  const addCharacter = async (e) => {
    e.preventDefault();
    console.log('Form submitted, preparing to add character');
    
    // Get form values directly - no FormData, simpler approach
    const nameInput = document.getElementById('name');
    const platinumInput = document.getElementById('platinum');
    const goldInput = document.getElementById('gold');
    const electrumInput = document.getElementById('electrum');
    const silverInput = document.getElementById('silver');
    const copperInput = document.getElementById('copper');
    
    // Validate name
    const characterName = nameInput.value.trim();
    if (!characterName) {
      alert('Please enter a character name');
      return;
    }
    
    // Simplified - create a plain object
    const characterData = {
      name: characterName,
      currency: {
        platinum: parseInt(platinumInput.value) || 0,
        gold: parseInt(goldInput.value) || 0,
        electrum: parseInt(electrumInput.value) || 0,
        silver: parseInt(silverInput.value) || 0,
        copper: parseInt(copperInput.value) || 0
      }
    };
    
    console.log('Character data to send:', characterData);
    
    // First, try the test endpoint to see if body parsing works at all
    try {
      console.log('Testing API connectivity with /api/test');
      const testResponse = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: 'data' })
      });
      
      const testResult = await testResponse.json();
      console.log('Test endpoint response:', testResult);
    } catch (testError) {
      console.error('Test endpoint failed:', testError);
    }
    
    // Now try the actual character creation
    try {
      console.log('Sending character data to /api/characters');
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(characterData)
      });
      
      console.log('Response received, status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Character added successfully:', result);
        
        // Reset form
        characterForm.reset();
        
        // Refresh character list
        displayCharacters();
      } else {
        let errorMsg = `Failed with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          console.error('Could not parse error response', e);
        }
        
        alert(`Failed to add character: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error adding character:', error);
      alert(`Network error: ${error.message}`);
    }
  };
  
  // Delete a character
  const deleteCharacter = async (id) => {
    try {
      console.log('Deleting character:', id);
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log('Character deleted successfully');
        displayCharacters();
      } else {
        alert('Failed to delete character');
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };
  
  // Update character currency
  const updateCurrency = async (id, currencyType, value) => {
    try {
      console.log(`Updating character ${id}, ${currencyType} to ${value}`);
      
      const updateData = {
        currency: {
          [currencyType]: value
        }
      };
      
      console.log('Update data:', updateData);
      
      const response = await fetch(`/api/characters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        const updatedCharacter = await response.json();
        console.log('Currency updated successfully:', updatedCharacter);
        return updatedCharacter;
      } else {
        console.error('Server returned error status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error updating character:', error);
      return null;
    }
  };
  
  // Display characters
  const displayCharacters = async () => {
    console.log('Displaying characters...');
    const characters = await fetchCharacters();
    
    // Clear character list
    characterList.innerHTML = '';
    
    if (characters.length === 0) {
      characterList.innerHTML = '<p>No characters found. Add a character to get started!</p>';
      return;
    }
    
    characters.forEach(character => {
      console.log('Creating card for character:', character.name);
      const characterCard = characterTemplate.content.cloneNode(true);
      
      // Set character name
      characterCard.querySelector('.character-name').textContent = character.name;
      
      // Set currency values
      characterCard.querySelector('.platinum-value').textContent = character.currency.platinum;
      characterCard.querySelector('.gold-value').textContent = character.currency.gold;
      characterCard.querySelector('.electrum-value').textContent = character.currency.electrum;
      characterCard.querySelector('.silver-value').textContent = character.currency.silver;
      characterCard.querySelector('.copper-value').textContent = character.currency.copper;
      
      // Add event listener to delete button
      characterCard.querySelector('.delete-btn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${character.name}?`)) {
          deleteCharacter(character._id);
        }
      });
      
      // Add event listeners to currency buttons
      const incrementButtons = characterCard.querySelectorAll('.increment-btn');
      incrementButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const currencyType = btn.dataset.type;
          const valueElement = btn.parentElement.querySelector(`.${currencyType}-value`);
          
          // Find value element if not directly accessible
          let valueEl = valueElement;
          if (!valueEl) {
            valueEl = characterCard.querySelector(`.${currencyType}-value`);
            if (!valueEl) {
              console.error(`Could not find element for ${currencyType}`);
              return;
            }
          }
          
          const currentValue = parseInt(valueEl.textContent) || 0;
          const newValue = currentValue + 1;
          
          console.log(`Increment ${currencyType} from ${currentValue} to ${newValue}`);
          
          const updatedCharacter = await updateCurrency(character._id, currencyType, newValue);
          if (updatedCharacter) {
            valueEl.textContent = updatedCharacter.currency[currencyType];
          }
        });
      });
      
      const decrementButtons = characterCard.querySelectorAll('.decrement-btn');
      decrementButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const currencyType = btn.dataset.type;
          const valueElement = btn.parentElement.querySelector(`.${currencyType}-value`);
          
          // Find value element if not directly accessible
          let valueEl = valueElement;
          if (!valueEl) {
            valueEl = characterCard.querySelector(`.${currencyType}-value`);
            if (!valueEl) {
              console.error(`Could not find element for ${currencyType}`);
              return;
            }
          }
          
          const currentValue = parseInt(valueEl.textContent) || 0;
          const newValue = Math.max(0, currentValue - 1); // Prevent negative values
          
          console.log(`Decrement ${currencyType} from ${currentValue} to ${newValue}`);
          
          const updatedCharacter = await updateCurrency(character._id, currencyType, newValue);
          if (updatedCharacter) {
            valueEl.textContent = updatedCharacter.currency[currencyType];
          }
        });
      });
      
      characterList.appendChild(characterCard);
    });
  };
  
  // Event listeners
  if (characterForm) {
    console.log('Adding submit event listener to character form');
    characterForm.addEventListener('submit', addCharacter);
  } else {
    console.error('Character form not found in the DOM');
  }
  
  // Test API connectivity when page loads
  fetch('/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init: 'test' })
  })
  .then(res => res.json())
  .then(data => console.log('API test on load:', data))
  .catch(err => console.error('API test failed:', err));
  
  // Initial display
  displayCharacters();
});