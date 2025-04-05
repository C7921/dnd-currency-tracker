document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, initializing application...');
  
  // DOM elements
  const characterForm = document.getElementById('character-form');
  const characterList = document.getElementById('character-list');
  const characterTemplate = document.getElementById('character-template');
  
  // Fetch all characters
  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching characters:', error);
      return [];
    }
  };
  
  // Add a new character
  const addCharacter = async (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const platinumInput = document.getElementById('platinum');
    const goldInput = document.getElementById('gold');
    const electrumInput = document.getElementById('electrum');
    const silverInput = document.getElementById('silver');
    const copperInput = document.getElementById('copper');
    
    const character = {
      name: nameInput.value,
      currency: {
        platinum: parseInt(platinumInput.value) || 0,
        gold: parseInt(goldInput.value) || 0,
        electrum: parseInt(electrumInput.value) || 0,
        silver: parseInt(silverInput.value) || 0,
        copper: parseInt(copperInput.value) || 0
      }
    };
    
    try {
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(character)
      });
      
      if (response.ok) {
        // Reset form
        characterForm.reset();
        
        // Refresh character list
        displayCharacters();
      }
    } catch (error) {
      console.error('Error adding character:', error);
    }
  };
  
  // Delete a character
  const deleteCharacter = async (id) => {
    try {
      const response = await fetch(`/api/characters/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        displayCharacters();
      }
    } catch (error) {
      console.error('Error deleting character:', error);
    }
  };
  
  // Update character currency
  const updateCurrency = async (id, currencyType, value) => {
    try {
      console.log(`Updating character ${id}, ${currencyType} to ${value}`);
      const response = await fetch(`/api/characters/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currency: {
            [currencyType]: value
          }
        })
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        console.error('Server returned error:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error updating character:', error);
      return null;
    }
  };
  
  // Display characters
  const displayCharacters = async () => {
    const characters = await fetchCharacters();
    
    // Clear character list
    characterList.innerHTML = '';
    
    if (characters.length === 0) {
      characterList.innerHTML = '<p>No characters found. Add a character to get started!</p>';
      return;
    }
    
    characters.forEach(character => {
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
          if (!valueElement) {
            console.error(`Could not find element with class ${currencyType}-value`);
            // Try an alternative selector
            const alternativeElement = characterCard.querySelector(`.${currencyType}-value`);
            if (!alternativeElement) {
              console.error('Alternative selector also failed');
              return;
            }
            valueElement = alternativeElement;
          }
          
          const currentValue = parseInt(valueElement.textContent) || 0;
          const newValue = currentValue + 1;
          
          console.log(`Increment ${currencyType} from ${currentValue} to ${newValue}`);
          
          const updatedCharacter = await updateCurrency(character._id, currencyType, newValue);
          if (updatedCharacter) {
            valueElement.textContent = updatedCharacter.currency[currencyType];
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
          if (!valueElement) {
            console.error(`Could not find element with class ${currencyType}-value`);
            // Try an alternative selector
            const alternativeElement = characterCard.querySelector(`.${currencyType}-value`);
            if (!alternativeElement) {
              console.error('Alternative selector also failed');
              return;
            }
            valueElement = alternativeElement;
          }
          
          const currentValue = parseInt(valueElement.textContent) || 0;
          const newValue = Math.max(0, currentValue - 1); // Prevent negative values
          
          console.log(`Decrement ${currencyType} from ${currentValue} to ${newValue}`);
          
          const updatedCharacter = await updateCurrency(character._id, currencyType, newValue);
          if (updatedCharacter) {
            valueElement.textContent = updatedCharacter.currency[currencyType];
          }
        });
      });
      
      characterList.appendChild(characterCard);
    });
  };
  
  // Event listeners
  characterForm.addEventListener('submit', addCharacter);
  
  // Initial display
  displayCharacters();
});