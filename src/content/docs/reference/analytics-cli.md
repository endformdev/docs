---
title: Analytics CLI
description: Query Endform suite and test analytics from the command line
sidebar:
  order: 5
---

The `endform query` command returns Endform analytics data as raw JSON. Use it when you want to inspect suite runs or test runs from a terminal, script, or CI job.

The same underlying data powers Endform's dashboard analytics: suite outcomes, test outcomes, durations, retries, branches, commits, projects, errors, and trace links.

## Authentication

The command uses your active Endform login or the `ENDFORM_API_KEY` environment variable.

For local use, run:

```bash
npx endform@latest login
```

For CI, set `ENDFORM_API_KEY` in your CI environment.

If your account has access to multiple organizations, set [`organizationId` in your Endform config](/docs/reference/endform-config-ts#organizationid) or pass `--organization-id`.

## Query kinds

There are two query kinds:

- `suite-runs` returns one row per Endform suite run.
- `test-runs` returns one row per test result inside suite runs.

Use `suite-runs` to understand whole-suite behavior. Use `test-runs` to find individual failing, slow, or flaky tests.

## Examples

Find recent failing suite runs:

```bash
npx endform@latest query suite-runs --where 'suiteRun.outcome = fail' --last 7d --limit 20
```

Find failing test runs from the last month:

```bash
npx endform@latest query test-runs --where 'testRun.outcome = fail' --last 30d --limit 50
```

Find tests that needed retries:

```bash
npx endform@latest query test-runs --where 'testRun.testAttemptsCount > 1' --last 30d --limit 50
```

Find slow test runs:

```bash
npx endform@latest query test-runs --where 'testRun.durationSeconds > 30' --last 7d --limit 50
```

Find failures inside a specific suite run:

```bash
npx endform@latest query test-runs --where 'suiteRun.id = sr_123, testRun.outcome = fail' --last 5d
```

Find passing suite runs in an absolute time range:

```bash
npx endform@latest query suite-runs --where 'suiteRun.outcome = pass' --from 2026-05-01T00:00:00Z --to 2026-05-28T00:00:00Z
```

Find tests whose name contains `checkout`:

```bash
npx endform@latest query test-runs --where 'test.name ~= checkout' --last 2w
```

## Time ranges

Use exactly one time range mode.

For a relative time range, use `--last` with `h`, `d`, `w`, or `m`:

```bash
npx endform@latest query test-runs --where 'testRun.outcome = fail' --last 24h
```

For an absolute time range, use both `--from` and `--to` with ISO 8601 timestamps:

```bash
npx endform@latest query suite-runs --where 'suiteRun.outcome = pass' --from 2026-05-01T00:00:00Z --to 2026-05-28T00:00:00Z
```

## Filters

Filters are passed with `--where`. Separate multiple filters with commas.

Useful suite-level filters include:

- `suiteRun.id`
- `suiteRun.outcome`
- `suiteRun.durationSeconds`
- `suiteRun.maxTestAttemptsCount`
- `branch`
- `commitSha`
- `suite.repository`
- `suite.directory`

Useful test-level filters include:

- `test.name`
- `test.location`
- `test.describes`
- `testRun.outcome`
- `testRun.projectName`
- `testRun.testAttemptsCount`
- `testRun.durationSeconds`
- `testAttempt.errorMessage`
- `testAttempt.errorLocation`

Do not use `testRun.*` or `testAttempt.*` filters with `suite-runs`. Use `test-runs` instead.

## Operators

Supported operators include:

- `=` equals
- `!=` not equals
- `^=` starts with
- `$=` ends with
- `~=` contains
- `!~=` does not contain
- `>` greater than
- `>=` greater than or equal
- `<` less than
- `<=` less than or equal
- `in` is one of several values
- `!in` is not one of several values

## Pagination

The response includes pagination information. When `page.hasMore` is true, pass `page.nextCursor` to `--cursor` to fetch the next page.

```bash
npx endform@latest query test-runs --where 'testRun.outcome = fail' --last 30d --cursor <nextCursor>
```
