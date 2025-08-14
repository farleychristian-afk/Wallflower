# Test Structure Documentation

## Current Test Organization

### Backend Tests (Root Level)
```
tests/
├── integration/
│   └── api.integration.test.js     # API endpoint integration tests
├── pact/
│   ├── consumer/                   # PACT consumer tests
│   │   ├── auth.consumer.pact.test.js
│   │   ├── posts.consumer.pact.test.js
│   │   └── users.consumer.pact.test.js
│   ├── provider/                   # PACT provider tests
│   │   └── provider.verification.test.js
│   └── templates/                  # PACT test templates
└── setup.js                       # Jest setup configuration
```

### Frontend Tests (Client Level)
```
client/src/
├── App.test.tsx                    # Main app component tests
├── data/
│   └── db.test.ts                  # Database generation tests
└── setupTests.ts                   # React Testing Library setup
```

### Archived Tests
```
archived_tests/
├── playwright_tests_backup/        # Saved Playwright E2E tests from backup
│   ├── fixtures/
│   │   └── base.ts                 # Test utilities and fixtures
│   └── smoke/                      # Smoke test suite
│       ├── app-loads.spec.ts
│       ├── console-errors.spec.ts
│       ├── navigation.spec.ts
│       ├── trip-planner.spec.ts
│       └── ui-components.spec.ts
└── playwright.config.ts            # Playwright configuration
```

## Test Commands

### Backend Tests
- `npm test` - Run all backend tests (Jest)
- `npm run test:pact` - Run PACT tests only
- `npm run test:pact:consumer` - Run PACT consumer tests
- `npm run test:pact:provider` - Run PACT provider verification

### Frontend Tests
- `cd client && npm test` - Run React tests (Jest + RTL)
- `cd client && npm test -- --coverage` - Run with coverage report
- `cd client && npm test -- --watchAll=false` - Run once without watch mode

## Test Status

### ✅ Working Tests
- `tests/integration/api.integration.test.js` - 12 tests passing
- `client/src/data/db.test.ts` - 6 tests passing

### ❌ Broken Tests (To Fix)
- `client/src/App.test.tsx` - Router dependency issues
- PACT consumer tests - Jest worker circular reference issues
- PACT provider tests - Missing pact contract files

### 📁 Archived
- Playwright E2E tests - Saved in `archived_tests/` for future restoration

## Next Steps

1. Fix App.test.tsx router dependency issues
2. Resolve PACT test technical problems
3. Set up test coverage reporting
4. Restore Playwright E2E testing capability
5. Add comprehensive component test coverage
