# Allure Report 3 — Single-Run Deep Dives

> This document covers the configuration and usage of **Allure Report 3** within this repository. Allure provides the engineering-level detail needed to debug failed tests, including traces, screenshots, videos, and step-by-step execution logs.
>
> **Versions verified (2026-05):** Allure v3.7.x, Allure-Playwright v3.7.x

## When to reach for Allure

Use when:
- You need to root-cause a specific test failure.
- You want to see the **execution trace** or **video** of a failed run.
- You need to share a detailed report with another engineer.
- You are debugging a new test locally and want to see the step timing.

Avoid when:
- You need high-level multi-run trend analytics (use the [QA Metrics Dashboard](../../wiki/QA-Metrics-Dashboard.md)).
- You want to track long-term defect arrival rates (use [ReportPortal](./report-portal.md)).

## Install / setup

Allure is included as a project dependency. No global installation is required.

```bash
# Verify the current version
npm list allure allure-playwright
```

## The 3-step happy path

1.  **Execute Tests**: Run your tests as usual. Playwright is configured to output raw Allure results to `allure-results/`.
    ```bash
    npm test
    ```
2.  **Generate Report**: Transform the raw results into a static HTML report.
    ```bash
    npm run allure-generate
    ```
3.  **Serve Locally**: Open the generated report in your browser.
    ```bash
    npm run allure-serve
    ```
    *Tip: Use `npm run report` to generate and serve in a single command.*

## Configuration in this repo

### 1. `allurerc.mjs` (CLI Config)
Located at the project root, this file controls how the report is built. It specifies the output folder (`./allure-report`) and the **Awesome Plugin** settings (logo, report name).

### 2. `playwright.config.ts` (Reporter Config)
The `allure-playwright` reporter is registered in the `reporter` array:
```ts
[
  'allure-playwright',
  {
    detail: true,
    outputFolder: 'allure-results',
    suiteTitle: true,
  },
]
```

## Worked example — Adding Metadata

You can enrich Allure reports using the `@playwright/test` annotations or specific Allure labels. In this repo, we use standard Playwright tags which Allure automatically maps to its internal labels.

```ts
import { test } from '@playwright/test';

test('TC01: Valid login', { tag: ['@P1', '@critical', '@auth'] }, async ({ loginPage }) => {
  // Allure will automatically show the @P1 priority and @critical severity.
  await loginPage.login(user);
});
```

## Anti-patterns this guideline rules out

- ❌ **Committing `allure-results/` or `allure-report/`**: These folders contain transient data and are gitignored. Only share them via CI artifacts or a local web server.
- ❌ **Using global Allure CLI**: Always use the version pinned in `package.json` via `npm run ...` to ensure consistency across the team and CI.
- ❌ **Overriding output paths in CLI**: The `allurerc.mjs` is the single source of truth for the output path. Passing `-o` manually will cause configuration drift.

## Related

*   [`report-portal.md`](./report-portal.md) — For multi-run trends.
*   [QA Metrics Dashboard](../../wiki/QA-Metrics-Dashboard.md) — For stakeholder-facing summaries.
*   [CI/CD Guidelines](../ci/README.md) — For Allure integration in GitHub Actions.
