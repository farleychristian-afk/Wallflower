/**
 * PACT Consumer Test Template
 * 
 * This template provides a starting point for creating new PACT consumer tests
 * for Wallflower APIs. Copy this file and modify it for your specific API.
 * 
 * Instructions:
 * 1. Replace 'YourAPI' with the actual API name (e.g., 'Comments', 'Categories')
 * 2. Replace 'your-api' with the actual API path (e.g., 'comments', 'categories')
 * 3. Update the port number to avoid conflicts (use unique ports for each API)
 * 4. Modify the test cases to match your API's endpoints and data structures
 * 5. Update the provider states to match your API's requirements
 */

const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

describe('YourAPI API Consumer Contract Tests', () => {
  let provider;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'wallflower-frontend',
      provider: 'wallflower-api',
      port: 1240, // Use a unique port for each API test
      log: path.resolve(process.cwd(), 'logs', 'pact.log'),
      dir: path.resolve(process.cwd(), 'pacts'),
      logLevel: 'INFO',
      spec: 2
    });

    return provider.setup();
  });

  afterAll(() => {
    return provider.finalize();
  });

  afterEach(() => {
    return provider.verify();
  });

  describe('GET /api/your-api', () => {
    beforeEach(() => {
      const interaction = {
        state: 'your-api items exist',
        uponReceiving: 'a request for all your-api items',
        withRequest: {
          method: 'GET',
          path: '/api/your-api',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            items: [
              {
                id: 1,
                name: 'Sample Item',
                // Add other properties specific to your API
                createdAt: '2023-01-01T00:00:00Z'
              }
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return a list of your-api items', async () => {
      const response = await axios.get('http://localhost:1240/api/your-api', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('items');
      expect(response.data).toHaveProperty('pagination');
      expect(Array.isArray(response.data.items)).toBe(true);
      expect(response.data.items[0]).toHaveProperty('id');
      expect(response.data.items[0]).toHaveProperty('name');
      // Add assertions for other properties specific to your API
    });
  });

  describe('GET /api/your-api/:id', () => {
    beforeEach(() => {
      const interaction = {
        state: 'your-api item with ID 1 exists',
        uponReceiving: 'a request for your-api item with ID 1',
        withRequest: {
          method: 'GET',
          path: '/api/your-api/1',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            item: {
              id: 1,
              name: 'Sample Item',
              // Add other properties specific to your API
              createdAt: '2023-01-01T00:00:00Z'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return a specific your-api item', async () => {
      const response = await axios.get('http://localhost:1240/api/your-api/1', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('item');
      expect(response.data.item).toHaveProperty('id', 1);
      expect(response.data.item).toHaveProperty('name');
      // Add assertions for other properties specific to your API
    });
  });

  describe('POST /api/your-api', () => {
    beforeEach(() => {
      const interaction = {
        state: 'valid data for creating your-api item',
        uponReceiving: 'a request to create a new your-api item',
        withRequest: {
          method: 'POST',
          path: '/api/your-api',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            name: 'New Item',
            // Add other required properties for your API
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            message: 'Item created successfully',
            item: {
              id: 2,
              name: 'New Item',
              // Add other properties that would be returned
              createdAt: '2023-08-11T10:00:00Z'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should create a new your-api item', async () => {
      const newItem = {
        name: 'New Item',
        // Add other required properties for your API
      };

      const response = await axios.post('http://localhost:1240/api/your-api', newItem, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message');
      expect(response.data).toHaveProperty('item');
      expect(response.data.item).toHaveProperty('id');
      expect(response.data.item).toHaveProperty('name', 'New Item');
      // Add assertions for other properties specific to your API
    });
  });

  describe('Error Handling - 404 Not Found', () => {
    beforeEach(() => {
      const interaction = {
        state: 'your-api item with ID 999 does not exist',
        uponReceiving: 'a request for non-existent your-api item',
        withRequest: {
          method: 'GET',
          path: '/api/your-api/999',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 404,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            error: 'Not Found',
            message: 'Item with ID 999 does not exist'
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return 404 for non-existent item', async () => {
      try {
        await axios.get('http://localhost:1240/api/your-api/999', {
          headers: { 'Accept': 'application/json' }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('error');
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });

  // Add more test cases as needed:
  // - PUT /api/your-api/:id (update)
  // - DELETE /api/your-api/:id (delete)
  // - Validation errors (400)
  // - Authentication/Authorization errors (401/403)
  // - Server errors (500)
});
