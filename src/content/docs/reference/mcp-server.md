---
title: Endform MCP server
description: Install, configure, and use the Endform MCP server tools
sidebar:
  order: 6
---

## Overview

- What the Endform MCP server provides
- How the MCP server relates to the Endform CLI
- Supported MCP transport

## Prerequisites

- Endform account
- Endform CLI requirements
- Playwright project requirements

## Installation

- Run with `npx endform@latest mcp`
- Install the `endform` package globally or in a project
- Verify the installed server with `server_info`

## MCP client configuration

- Generic stdio configuration
- Cursor configuration
- Claude Code configuration
- OpenCode configuration
- Visual Studio Code configuration

## Authentication

- Authenticate interactively with `endform login`
- Authenticate with `ENDFORM_API_KEY`
- Select an organization
- Discover organizations with `list_organizations`

## Recommended workflows

- Debug one Playwright test with the debug tools
- Compare historical trends with `query_analytics`
- Inspect matching executions with `query_samples`
- Retrieve trace data with `get_otel_trace`

## Debugging tools

- `debug_test_start`
- `debug_test_run`
- `debug_test_status`
- `debug_test_stop`

## Historical test tools

- `query_analytics`
- `query_samples`
- `get_otel_trace`

## Utility tools

- `list_organizations`
- `server_info`

## Debug session lifecycle

- Starting
- Paused
- Running
- Ended
- Stale
- 15-minute session limit
- Explicit cleanup with `debug_test_stop`

## Tool responses and artifacts

- Inline ARIA snapshots
- Standard output and standard error
- Exit codes
- Screenshot and file artifact paths
- Result and log paths
- Pagination cursors
- OpenTelemetry trace identifiers

## Related documentation

- [Debug tests with an AI agent](/docs/guides/debug-tests-with-ai)
- [Investigate test history with an AI agent](/docs/guides/investigate-test-history-with-ai)
- [Run filters](/docs/reference/run-filters)
- [Analytics CLI](/docs/reference/analytics-cli)
