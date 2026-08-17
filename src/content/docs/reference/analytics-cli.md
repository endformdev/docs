---
title: Analytics and samples CLI
description: Compare Endform test trends and inspect concrete suite and test executions from the command line
sidebar:
  order: 5
---

The Endform CLI provides two commands for querying historical test data as JSON:

- `endform analytics` compares counts, pass rates, and average durations over time.
- `endform samples` returns concrete suite-run or test-run executions.

Use analytics to identify a trend or group worth investigating, then use samples to inspect the matching executions and errors.

## Authentication

Both commands use your active Endform login or the `ENDFORM_API_KEY` environment variable.

For local use, run:

```bash
npx endform@latest login
```

If your account has access to multiple organizations, set [`organizationId` in your Endform config](/docs/reference/endform-config-ts#organizationid) or pass `--organization-id`.

## Datasets

Both commands require one of two datasets:

- `suite-runs` represents complete Endform suite runs.
- `test-runs` represents individual Playwright test results within suite runs.

Use `suite-runs` for overall pass rate, duration, branch behavior, and CI health. Use `test-runs` to find failing, retried, flaky, or slow tests.

## Compare trends with `analytics`

Pass `--metric` with `count`, `pass-rate`, or `average-duration`.

Count suite runs over the last seven days:

```bash
npx endform@latest analytics suite-runs --metric count
```

Compare test pass rates by test on the main branch:

```bash
npx endform@latest analytics test-runs --metric pass-rate --group-by test --where 'branch = main'
```

Track average test duration by Playwright project over a fixed 24-hour window:

```bash
npx endform@latest analytics test-runs --metric average-duration --group-by project --period 24H --ending-at 2026-08-11T12:00:00Z
```

`--group-by` supports `outcome`, `branch`, `test`, and `project`. Suite runs cannot be grouped by test or project.

The response contains an `interval` and one or more time series. The response `unit` is `count`, `percent`, or `seconds`, depending on the selected metric.

## Inspect executions with `samples`

Find recent failing tests:

```bash
npx endform@latest samples test-runs --where 'testRun.outcome = fail'
```

Find tests that needed retries over the last 30 days:

```bash
npx endform@latest samples test-runs --where 'testRun.testAttemptsCount > 1' --period 30D --limit 25
```

Inspect failures from one suite run:

```bash
npx endform@latest samples test-runs --where 'suiteRun.id = sr_123, testRun.outcome = fail'
```

Suite-run samples include repository, directory, branch, commit, outcome, duration, and retry information. Test-run samples also include the test identity, Playwright project, and every attempt in chronological order, including error and OpenTelemetry trace details when available.

`--limit` defaults to 10 and accepts up to 50 records. If a response contains `nextCursor`, pass it to `--cursor` to fetch the next page:

```bash
npx endform@latest samples test-runs --cursor '<nextCursor>'
```

The cursor preserves the original query's time window.

## Filter results

Pass a comma-separated expression to `--where`:

```text
suite.repository = endformdev/endform, testRun.outcome = fail
```

Quote values that contain spaces, commas, or pipes. Strings support equality, prefix, suffix, substring, and set operators; numbers support equality and comparison operators. Outcomes are `pass` or `fail`, and durations are measured in seconds.

Test-run filters can target suite, test, test-run, and test-attempt fields. A `testAttempt.*` clause matches a test run when any attempt satisfies it, while the response still includes every attempt. Run either command with `--help` for the complete list of fields and operators.

## Time windows

Use `--period` with a positive integer followed by `H`, `D`, `W`, or `M`. The default is `7D`.

```bash
npx endform@latest analytics test-runs --metric pass-rate --period 2W
```

Add `--ending-at` with an ISO 8601 timestamp to end the relative window at a fixed time:

```bash
npx endform@latest samples suite-runs --period 24H --ending-at 2026-08-11T12:00:00Z
```

AI coding agents can query the same data through the [Endform MCP server](/docs/reference/mcp-server#analyze-historical-test-data).
