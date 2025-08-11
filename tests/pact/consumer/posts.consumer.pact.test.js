const { Pact } = require('@pact-foundation/pact');
const axios = require('axios');
const path = require('path');

describe('Posts API Consumer Contract Tests', () => {
  let provider;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'wallflower-frontend',
      provider: 'wallflower-api',
      port: 1235,
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

  describe('GET /api/posts', () => {
    beforeEach(() => {
      const interaction = {
        state: 'posts exist',
        uponReceiving: 'a request for all posts',
        withRequest: {
          method: 'GET',
          path: '/api/posts',
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
            posts: [
              {
                id: 1,
                title: 'Welcome to Wallflower',
                content: 'This is the first post on our platform.',
                authorId: 1,
                createdAt: '2023-01-01T00:00:00Z',
                updatedAt: '2023-01-01T00:00:00Z'
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

    it('should return a list of posts', async () => {
      const response = await axios.get('http://localhost:1235/api/posts', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('posts');
      expect(response.data).toHaveProperty('pagination');
      expect(Array.isArray(response.data.posts)).toBe(true);
      expect(response.data.posts[0]).toHaveProperty('id');
      expect(response.data.posts[0]).toHaveProperty('title');
      expect(response.data.posts[0]).toHaveProperty('content');
      expect(response.data.posts[0]).toHaveProperty('authorId');
      expect(response.data.posts[0]).toHaveProperty('createdAt');
      expect(response.data.posts[0]).toHaveProperty('updatedAt');
    });
  });

  describe('GET /api/posts/:id', () => {
    beforeEach(() => {
      const interaction = {
        state: 'post with ID 1 exists',
        uponReceiving: 'a request for post with ID 1',
        withRequest: {
          method: 'GET',
          path: '/api/posts/1',
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
            post: {
              id: 1,
              title: 'Welcome to Wallflower',
              content: 'This is the first post on our platform.',
              authorId: 1,
              createdAt: '2023-01-01T00:00:00Z',
              updatedAt: '2023-01-01T00:00:00Z'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return a specific post', async () => {
      const response = await axios.get('http://localhost:1235/api/posts/1', {
        headers: { 'Accept': 'application/json' }
      });

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('post');
      expect(response.data.post).toHaveProperty('id', 1);
      expect(response.data.post).toHaveProperty('title');
      expect(response.data.post).toHaveProperty('content');
      expect(response.data.post).toHaveProperty('authorId');
    });
  });

  describe('POST /api/posts', () => {
    beforeEach(() => {
      const interaction = {
        state: 'user with ID 1 exists',
        uponReceiving: 'a request to create a new post',
        withRequest: {
          method: 'POST',
          path: '/api/posts',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            title: 'Test Post',
            content: 'This is a test post content.',
            authorId: 1
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            message: 'Post created successfully',
            post: {
              id: 3,
              title: 'Test Post',
              content: 'This is a test post content.',
              authorId: 1,
              createdAt: '2023-08-11T10:00:00Z',
              updatedAt: '2023-08-11T10:00:00Z'
            }
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should create a new post', async () => {
      const newPost = {
        title: 'Test Post',
        content: 'This is a test post content.',
        authorId: 1
      };

      const response = await axios.post('http://localhost:1235/api/posts', newPost, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('message', 'Post created successfully');
      expect(response.data).toHaveProperty('post');
      expect(response.data.post).toHaveProperty('id');
      expect(response.data.post).toHaveProperty('title', 'Test Post');
      expect(response.data.post).toHaveProperty('content', 'This is a test post content.');
      expect(response.data.post).toHaveProperty('authorId', 1);
      expect(response.data.post).toHaveProperty('createdAt');
      expect(response.data.post).toHaveProperty('updatedAt');
    });
  });

  describe('POST /api/posts - Validation Error', () => {
    beforeEach(() => {
      const interaction = {
        state: 'any state',
        uponReceiving: 'a request to create a post with missing fields',
        withRequest: {
          method: 'POST',
          path: '/api/posts',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: {
            title: 'Test Post'
            // Missing content and authorId
          }
        },
        willRespondWith: {
          status: 400,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: {
            error: 'Validation error',
            message: 'Title, content, and authorId are required'
          }
        }
      };

      return provider.addInteraction(interaction);
    });

    it('should return validation error for incomplete post data', async () => {
      const incompletePost = {
        title: 'Test Post'
        // Missing content and authorId
      };

      try {
        await axios.post('http://localhost:1235/api/posts', incompletePost, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
      } catch (error) {
        expect(error.response.status).toBe(400);
        expect(error.response.data).toHaveProperty('error', 'Validation error');
        expect(error.response.data).toHaveProperty('message');
      }
    });
  });
});
