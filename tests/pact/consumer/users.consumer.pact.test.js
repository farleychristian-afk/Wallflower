const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

describe('Users API Consumer Contract Tests', () => {
  let provider;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'wallflower-frontend',
      provider: 'wallflower-api',
      port: 1234,
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

  describe('GET /api/users', () => {
    beforeEach(() => {
      const interaction = {
        state: 'users exist',
        uponReceiving: 'a request for all users',
        withRequest: {
          method: 'GET',
          path: '/api/users',
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
            users: [
              {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                role: 'user'
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

    it('should return a list of users', async () => {
      const response = await axios.get('http://localhost:1234/api/users', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      expect(response.data).toHaveProperty('pagination');
      expect(Array.isArray(response.data.users)).toBe(true);
      expect(response.data.users[0]).toHaveProperty('id');
      expect(response.data.users[0]).toHaveProperty('name');
      expect(response.data.users[0]).toHaveProperty('email');
      expect(response.data.users[0]).toHaveProperty('role');
    });
  });

  describe('GET /api/users/:id', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user with ID 1 exists',
        uponReceiving: 'a request for user with ID 1',
        withRequest: {
          method: 'GET',
          path: '/api/users/1',
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
            user: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              role: 'user'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return a specific user', async () => {
      const response = await axios.get('http://localhost:1234/api/users/1', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id', 1);
      expect(response.data.user).toHaveProperty('name');
      expect(response.data.user).toHaveProperty('email');
      expect(response.data.user).toHaveProperty('role');
    });
  });

  describe('GET /api/users/:id - User not found', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user with ID 999 does not exist',
        uponReceiving: 'a request for user with ID 999',
        withRequest: {
          method: 'GET',
          path: '/api/users/999',
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
            error: 'User not found',
            message: 'User with ID 999 does not exist'
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return 404 for non-existent user', async () => {
      try {
        await axios.get('http://localhost:1234/api/users/999', {
          headers: { 'Accept': 'application/json' }
        });
      } catch (error) {
        expect(error.response.status).toBe(404);
        expect(error.response.data).toHaveProperty('error', 'User not found');
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });

  describe('POST /api/users', () => {
    beforeEach(() => {
      const interaction = {
        state: 'no user with email test@example.com exists',
        uponReceiving: 'a request to create a new user',
        withRequest: {
          method: 'POST',
          path: '/api/users',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            message: 'User created successfully',
            user: {
              id: 4,
              name: 'Test User',
              email: 'test@example.com',
              role: 'user'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should create a new user', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      const response = await axios.post('http://localhost:1234/api/users', newUser, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'User created successfully');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user).toHaveProperty('name', 'Test User');
      expect(response.data.user).toHaveProperty('email', 'test@example.com');
      expect(response.data.user).toHaveProperty('role', 'user');
    });
  });
});
