# PACT Contract Testing for Wallflower

This directory contains PACT contract tests for the Wallflower API. PACT is a contract testing framework that ensures the API provider (backend) and consumer (frontend) can communicate correctly.

## Directory Structure

```
tests/pact/
├── consumer/           # Consumer contract tests
│   ├── users.consumer.pact.test.js
│   ├── posts.consumer.pact.test.js
│   └── auth.consumer.pact.test.js
├── provider/           # Provider verification tests
│   └── provider.verification.test.js
├── templates/          # Templates for new API tests
│   └── api.consumer.template.js
└── README.md          # This file
```

## What is PACT?

PACT is a contract testing tool that:
- Defines contracts between service consumers and providers
- Generates contracts from consumer tests
- Verifies that providers fulfill the contracts
- Prevents breaking changes between services

## Running Tests

### Consumer Tests
Consumer tests define what the frontend expects from the API:

```bash
# Run all consumer tests
npm run test:pact:consumer

# Run specific consumer test
npx jest tests/pact/consumer/users.consumer.pact.test.js
```

### Provider Tests
Provider tests verify that the API meets the consumer contracts:

```bash
# Run provider verification
npm run test:pact:provider

# Run specific provider test
npx jest tests/pact/provider/provider.verification.test.js
```

### All PACT Tests
```bash
# Run all PACT tests
npm run test:pact
```

## Generated Contracts

Consumer tests generate PACT files in the `pacts/` directory:
- `wallflower-frontend-wallflower-api.json`

These files contain the contract specifications that the provider must fulfill.

## Adding New API Tests

1. **Copy the template:**
   ```bash
   cp tests/pact/templates/api.consumer.template.js tests/pact/consumer/your-api.consumer.pact.test.js
   ```

2. **Customize the template:**
   - Replace `YourAPI` with your API name
   - Replace `your-api` with your API path
   - Update the port number (use unique ports)
   - Modify test cases for your endpoints
   - Update provider states

3. **Add provider states:**
   Update `tests/pact/provider/provider.verification.test.js` to include state handlers for your new API.

## Best Practices

### Consumer Tests
- Test the happy path and common error scenarios
- Use realistic test data
- Keep tests focused on the contract, not implementation details
- Use unique ports for each API to avoid conflicts

### Provider States
- Set up the exact state described in the consumer test
- Reset state between tests
- Use descriptive state names

### Contract Design
- Design contracts from the consumer's perspective
- Include all required fields in responses
- Test error responses (400, 401, 404, 500)
- Use consistent error response formats

## Example Test Structure

```javascript
describe('API Consumer Contract Tests', () => {
  let provider;

  beforeAll(() => {
    provider = new Pact({
      consumer: 'wallflower-frontend',
      provider: 'wallflower-api',
      port: 1234, // Unique port
      // ... other config
    });
    return provider.setup();
  });

  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());

  describe('GET /api/endpoint', () => {
    beforeEach(() => {
      const interaction = {
        state: 'data exists',
        uponReceiving: 'a request for data',
        withRequest: {
          method: 'GET',
          path: '/api/endpoint',
          headers: { 'Accept': 'application/json' }
        },
        willRespondWith: {
          status: 200,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: { /* expected response */ }
        }
      };
      return provider.addInteraction(interaction);
    });

    it('should return expected data', async () => {
      // Test implementation
    });
  });
});
```

## Troubleshooting

### Common Issues

1. **Port conflicts:** Each consumer test must use a unique port
2. **State setup:** Ensure provider states match consumer expectations
3. **Response format:** Check that actual API responses match contract expectations
4. **Headers:** Include all required headers in both requests and responses

### Debugging

- Check the generated PACT files in `pacts/` directory
- Review logs in `logs/pact.log`
- Use `LOG_LEVEL=DEBUG` for more detailed logging
- Verify that the provider is running on the correct port during verification

## Integration with CI/CD

To integrate PACT tests with your CI/CD pipeline:

1. **Consumer tests:** Run during frontend builds
2. **Provider tests:** Run during backend builds
3. **PACT Broker:** Use a PACT Broker to share contracts between teams
4. **Can-I-Deploy:** Use PACT's can-i-deploy tool to check deployment safety

## Resources

- [PACT Documentation](https://docs.pact.io/)
- [PACT JavaScript Guide](https://github.com/pact-foundation/pact-js)
- [Contract Testing Best Practices](https://docs.pact.io/best_practices/)
