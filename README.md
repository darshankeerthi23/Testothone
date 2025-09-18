# Testothone

A Playwright + TypeScript automation framework built for TestAutothon.  
It enables **fast, reliable, and maintainable end-to-end testing**, with built-in utilities for reporting and analytics.

---

## 📦 Prerequisites
- Node.js v18+
- npm (comes with Node)
- Git (optional)

---

## 📂 Project Structure
```
.
├── .github/workflows/        # CI/CD workflows
├── analytics-dashboard/      # Dashboard / analytics utilities
├── tests/                    # Main test suite
├── tests-examples/           # Sample tests
├── playwright.config.ts      # Playwright configuration
├── create-summary.js         # Summary generator
├── create-summary-playwright.js
├── generate-analytics.js     # Analytics report generator
├── zerostep.config.json      # Extra config
├── package.json              # Dependencies + scripts
└── .env.ci                   # Example CI environment variables
```

---

## ⚙️ Setup
1. Clone the repo:
   ```bash
   git clone https://github.com/darshankeerthi23/Testothone.git
   cd Testothone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:  
   Create a `.env` file (or use `.env.ci`) with entries like:
   ```env
   BASE_URL=https://your.test.url
   USERNAME=testuser
   PASSWORD=secret
   ```

---

## ▶️ Running Tests
- Run the full suite:
  ```bash
  npm test
  ```

- Run in headed (browser visible) mode:
  ```bash
  npx playwright test --headed
  ```

- Run a specific file or pattern:
  ```bash
  npx playwright test tests/example.spec.ts
  ```

---

## 📊 Reporting & Analytics
- Generate summary:
  ```bash
  node create-summary-playwright.js
  ```

- Generate analytics:
  ```bash
  node generate-analytics.js
  ```

- (Optional) Allure reporting:
  ```bash
  npx allure serve ./allure-results
  ```

---

## 🤖 CI/CD
- GitHub Actions workflow already available in `.github/workflows/`.
- Use `.env.ci` for pipeline environment variables.
- Add secrets in repo → Settings → Secrets → Actions.

---

## ➕ Extending the Framework
- Add new specs under `tests/` with `.spec.ts`.
- Create reusable Page Objects for new pages.
- Follow DRY principles → reuse utilities in `utils/`.

---

## 🛠 Troubleshooting
| Issue | Fix |
|-------|-----|
| Tests timeout | Adjust `timeout` in `playwright.config.ts` |
| Env vars not found | Create `.env` or set in CI secrets |
| Reports empty | Ensure reporter configured in `playwright.config.ts` |
| Flaky selectors | Use Playwright locators instead of brittle CSS/XPath |

---

## 🎤 Demo Script (for Hackathon Presentation)
1. “We built this Playwright + TS framework to deliver fast, maintainable automation.”  
2. “Here’s a demo run: `npm test` (show live execution).”  
3. “Post-run, we generate analytics and summaries to help teams understand results quickly.”  
4. “Our design is modular, scalable, and CI-ready.”  

---

## 📌 Future Enhancements
- Add retry logic for flaky tests  
- Richer Allure / HTML reports  
- Test data parameterization  
- Negative & boundary scenario coverage  

---

## 📄 Quick Commands Cheat Sheet
```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with visible browser
npx playwright test --headed

# Run a specific test
npx playwright test tests/example.spec.ts

# Generate summary
node create-summary-playwright.js

# Generate analytics
node generate-analytics.js

# Serve allure report (if configured)
npx allure serve ./allure-results
```
