const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

describe('Auth API Consumer Contract Tests', () => {
  let provider;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'wallflower-frontend',
      provider: 'wallflower-api',
      port: 1236,
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

  describe('POST /api/auth/login', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user with email john@example.com exists',
        uponReceiving: 'a valid login request',
        withRequest: {
          method: 'POST',
          path: '/api/auth/login',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            email: 'john@example.com',
            password: 'password123'
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            message: 'Login successful',
            token: 'mock-jwt-token-1-1691748000000',
            user: {
              id: 1,
              email: 'john@example.com',
              name: 'John Doe'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should successfully login with valid credentials', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await axios.post('http://localhost:1236/api/auth/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Login successful');
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user).toHaveProperty('email', 'john@example.com');
      expect(response.data.user).toHaveProperty('name');
    });
  });

  describe('POST /api/auth/login - Invalid credentials', () => {
    beforeEach(() => {
      const interaction = {
        state: 'any state',
        uponReceiving: 'an invalid login request',
        withRequest: {
          method: 'POST',
          path: '/api/auth/login',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            email: 'invalid@example.com',
            password: 'wrongpassword'
          }
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            error: 'Authentication failed',
            message: 'Invalid email or password'
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      };

      try {
        await axios.post('http://localhost:1236/api/auth/login', loginData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('error', 'Authentication failed');
        expect(error.response.data).toHaveProperty('message', 'Invalid email or password');
      }
    });
  });

  describe('POST /api/auth/register', () => {
    beforeEach(() => {
      const interaction = {
        state: 'no user with email newuser@example.com exists',
        uponReceiving: 'a valid registration request',
        withRequest: {
          method: 'POST',
          path: '/api/auth/register',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            email: 'newuser@example.com',
            password: 'newpassword123',
            name: 'New User'
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            message: 'Registration successful',
            user: {
              id: 3,
              email: 'newuser@example.com',
              name: 'New User'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should successfully register a new user', async () => {
      const registrationData = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        name: 'New User'
      };

      const response = await axios.post('http://localhost:1236/api/auth/register', registrationData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'Registration successful');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id');
      expect(response.data.user).toHaveProperty('email', 'newuser@example.com');
      expect(response.data.user).toHaveProperty('name', 'New User');
    });
  });

  describe('GET /api/auth/profile', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user is authenticated with valid token',
        uponReceiving: 'a request for user profile with valid token',
        withRequest: {
          method: 'GET',
          path: '/api/auth/profile',
          headers: {
            'Authorization': 'Bearer mock-jwt-token-1-1691748000000',
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
              email: 'john@example.com',
              name: 'John Doe'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return user profile with valid token', async () => {
      const response = await axios.get('http://localhost:1236/api/auth/profile', {
        headers: {
          'Authorization': 'Bearer mock-jwt-token-1-1691748000000',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('user');
      expect(response.data.user).toHaveProperty('id', 1);
      expect(response.data.user).toHaveProperty('email', 'john@example.com');
      expect(response.data.user).toHaveProperty('name', 'John Doe');
    });
  });

  describe('GET /api/auth/profile - Unauthorized', () => {
    beforeEach(() => {
      const interaction = {
        state: 'any state',
        uponReceiving: 'a request for user profile without token',
        withRequest: {
          method: 'GET',
          path: '/api/auth/profile',
          headers: {
            'Accept': 'application/json'
          }
        },
        willRespondWith: {
          status: 401,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            error: 'Unauthorized',
            message: 'Authentication token required'
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return 401 when no token provided', async () => {
      try {
        await axios.get('http://localhost:1236/api/auth/profile', {
          headers: {
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        expect(error.response.status).toBe(401);
        expect(error.response.data).toHaveProperty('error', 'Unauthorized');
        expect(error.response.data).toHaveProperty('message', 'Authentication token required');
      }
    });
  });
});
