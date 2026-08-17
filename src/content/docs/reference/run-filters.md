---
title: Run filters
description: Filter Endform suite runs, test runs, and test attempts
sidebar:
  order: 7
---

## Overview

- Shared filter syntax for MCP tools and analytics CLI commands
- `where` expressions
- Suite-run and test-run datasets

## Expression syntax

- Comma-separated clauses
- Key, operator, and value structure
- Multiple clauses
- Quoted values
- Values containing spaces, commas, or pipes

## String operators

- `=`
- `!=`
- `^=`
- `$=`
- `~=`
- `!~=`
- `in`
- `!in`

## Number operators

- `=`
- `!=`
- `>`
- `>=`
- `<`
- `<=`
- `in`
- `!in`

## Suite-run fields

- `branch`
- `commitSha`
- `suite.id`
- `suite.repository`
- `suite.directory`
- `suiteRun.id`
- `suiteRun.outcome`
- `suiteRun.durationSeconds`
- `suiteRun.maxTestAttemptsCount`

## Test-run fields

- All suite-run fields
- `test.id`
- `test.name`
- `test.location`
- `test.describes`
- `testRun.id`
- `testRun.outcome`
- `testRun.projectName`
- `testRun.testAttemptsCount`
- `testRun.durationSeconds`

## Test-attempt fields

- `testAttempt.id`
- `testAttempt.outcome`
- `testAttempt.errorMessage`
- `testAttempt.errorLocation`
- `testAttempt.durationSeconds`

## Value conventions

- `pass` and `fail` outcomes
- Durations in seconds
- Pipe-separated values for `in` and `!in`

## Test-attempt matching

- Match a test run when any attempt satisfies the clause
- Return every ordered attempt for a matching test run

## Examples

- Filter failed suite runs
- Filter failed test runs
- Find retried tests
- Find slow tests
- Match test names
- Match error messages
- Combine repository, directory, branch, and outcome filters

## Related documentation

- [Endform MCP server](/docs/reference/mcp-server)
- [Analytics CLI](/docs/reference/analytics-cli)
- [Dashboard analytics](/docs/explanation/dashboard-analytics)
