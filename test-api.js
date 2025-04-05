const http = require('http');

// Configuration
const HOST = 'localhost';
const PORT = 8080;
const TEST_CHARACTER = {
  name: 'API Test Character',
  currency: {
    platinum: 1,
    gold: 10,
    electrum: 0,
    silver: 5,
    copper: 2
  }
};

// Helper function to make HTTP requests
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (err) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Run the tests
async function runTests() {
  console.log('Starting API Tests');
  
  try {
    // Test 1: Test endpoint
    console.log('\n=== Test 1: Test Endpoint ===');
    const testResponse = await makeRequest('POST', '/api/test', { test: true });
    console.log(`Status: ${testResponse.statusCode}`);
    console.log('Response:', testResponse.data);
    
    // Test 2: Create Character
    console.log('\n=== Test 2: Create Character ===');
    console.log('Sending:', TEST_CHARACTER);
    const createResponse = await makeRequest('POST', '/api/characters', TEST_CHARACTER);
    console.log(`Status: ${createResponse.statusCode}`);
    console.log('Response:', createResponse.data);
    
    // If character creation succeeded, store the ID
    let characterId = null;
    if (createResponse.statusCode === 201 && createResponse.data._id) {
      characterId = createResponse.data._id;
      
      // Test 3: Fetch All Characters
      console.log('\n=== Test 3: Fetch All Characters ===');
      const fetchResponse = await makeRequest('GET', '/api/characters');
      console.log(`Status: ${fetchResponse.statusCode}`);
      console.log('Count:', fetchResponse.data.length);
      console.log('First character:', fetchResponse.data[0]);
      
      // Test 4: Update Character
      console.log('\n=== Test 4: Update Character Currency ===');
      const updateData = {
        currency: {
          gold: 20 // Double the gold
        }
      };
      console.log('Updating with:', updateData);
      const updateResponse = await makeRequest('PATCH', `/api/characters/${characterId}`, updateData);
      console.log(`Status: ${updateResponse.statusCode}`);
      console.log('Updated character:', updateResponse.data);
      
      // Test 5: Delete Character
      console.log('\n=== Test 5: Delete Character ===');
      const deleteResponse = await makeRequest('DELETE', `/api/characters/${characterId}`);
      console.log(`Status: ${deleteResponse.statusCode}`);
      console.log('Response:', deleteResponse.data);
    }
    
    console.log('\n=== Tests Complete ===');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the tests
runTests();