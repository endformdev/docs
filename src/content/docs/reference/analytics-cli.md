---
title: Test history CLI
description: Compare Endform test trends, inspect concrete suite and test executions, and replay test attempts from the command line
sidebar:
  order: 5
---

The Endform CLI provides these commands for querying historical test data:

- `endform analytics` compares counts, pass rates, and average durations over time.
- `endform samples` returns concrete suite-run or test-run executions.
- `endform test-attempt` inspects one test attempt step by step and links to its replay.

Use analytics to identify a trend or group worth investigating, use samples to inspect the matching executions and errors, then inspect a single attempt to see what it did.

## Authentication

These commands use your active Endform login or the `ENDFORM_API_KEY` environment variable.

For local use, run:

```bash
npx endform@latest login
```

## Datasets

`analytics` and `samples` require one of two datasets:

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

Suite-run samples include repository, directory, branch, commit, outcome, duration, and retry information. Test-run samples also include the test identity, Playwright project, and every attempt in chronological order, including error and OpenTelemetry trace details when available. Pass an attempt's `id` to [`test-attempt`](#inspect-a-test-attempt-with-test-attempt).

`--limit` defaults to 10 and accepts up to 50 records. If a response contains `nextCursor`, pass it to `--cursor` to fetch the next page:

```bash
npx endform@latest samples test-runs --cursor '<nextCursor>'
```

The cursor preserves the original query's time window.

## Inspect a test attempt with `test-attempt`

`test-attempt inspect` shows what a test attempt did, where and how it failed, and how it compares with a passing run. A failed attempt is compared with a passing retry in the same test run when there is one, and otherwise with recent passing runs on the suite's default branch:

```bash
npx endform@latest test-attempt inspect <test-attempt-id>
```

The output lists the attempt's steps aligned with the compared run's steps, and marks the first step that changed and the step that failed. The command downloads both runs' traces and screenshots, saves the chosen step's screenshots as `step-N-attempt.jpg` and `step-N-comparison.jpg`, and writes `steps.json`, which maps each step to its span and screenshot in both runs. It prints the paths.

- `--compare-with none` skips the comparison.
- `--branch <name>` compares with recent passing runs on another branch, such as a pull request's base branch.
- `--compare-test-attempt-id <id>` compares with a specific attempt.
- `--step-index <n>` saves screenshots for another step.
- `--output-dir <dir>` downloads the files into a directory of your choice instead of the system temporary directory.

`test-attempt replay-link` creates a link to a replay of the attempt's run, step by step with screenshots. It prints the link to the full replay, then a player link to embed in an iframe. Both work without a login until they expire:

```bash
npx endform@latest test-attempt replay-link <test-attempt-id> \
  --compare-test-attempt-id <passing-attempt-id> \
  --span-id <span-id> \
  --span-label 'Pay now is still disabled'
```

`--compare-test-attempt-id` plays another attempt's run beside this one, and `--compare-label` names it. `--span-id` opens the replay on a step's span from `inspect` or `steps.json`, `--span-label` captions it, and `--at start` opens on the start of the span instead of its result.

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

AI coding agents can query the same data through the [Endform MCP server](/docs/reference/mcp-server#analyze-historical-test-data), whose tools match these commands.
