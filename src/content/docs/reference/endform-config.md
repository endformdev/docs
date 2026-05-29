---
title: Endform config - endform.jsonc
description: Configure endform further with an `endform.jsonc` file
sidebar:
  order: 2
---

To further configure endform, place an `endform.jsonc` file in your repository. It can be:

- In the same folder as your playwright suite -> applies to that suite
- In the root of your repository -> applies to all suites in your repository

## `endform.jsonc` config parameters

Currently, `endform.jsonc` supports the following options:

### `additionalFiles`

`additionalFiles`: an array of strings used as globs to send extra files to your test machines.

```json
{
  "additionalFiles": ["user-state/*"]
}
```

If your playwright config already specifies `storageState`, this parameter should not be needed - endform will read and send those automatically.
However if your tests have implicit dependencies on more files, use this parameter.

### `concurrentTestLimits`

Set concurrency limits for a suite run. Each item has a `scope`, optional `label`, and `limit`.

Two scopes are supported:
- `"within-suite-run"` for limiting concurrent tests in that test suite run
- `"across-all-runs"` for limiting concurrent tests across all matching test suites that your organisation is running - a shared, global limit

For `label`:

- use `tag:@my-tag` to limit by [test tag](https://playwright.dev/docs/test-annotations#tag-tests)
- use `project:project-name` to limit runs of tests within a project
- if not set / `null`, the limit applies to all tests in the run

Then set `limit` for the maximum number of allowed concurrent tests to run within that group.


```json
{
  "concurrentTestLimits": [
    { "scope": "within-suite-run", "limit": 20 },
    { "scope": "within-suite-run", "label": "tag:@smoke", "limit": 2 }
    { "scope": "across-all-runs", "label": "project:slow-backend", "limit": 10 }
  ]
}
```

Running tests must satisfy all applicable limits. In this example:

- Within the suite run, 20 tests can run concurrently, with at most 2 tagged `@smoke` tests running
- No more than 10 tests in the `slow-backend` project can run at the same time, across all currently running test suites in your organisation

### `environmentVariables`

`environmentVariables`: an array of string regular expressions that are used to match environment variables that should be transferred to the remote runners.

```json
{
  "environmentVariables": ["VERCEL_.*"]
}
```

By default the following environment variables are automatically transferred:

- Environment variables that start with `E2E_`
- All environment variables that are set in your `playwright.config.ts`

### `extraHttpHeaders`

Set extra HTTP headers that will be applied to the Playwright browser contexts when tests run on remote runners. The value is a JSON object mapping header names to string values.

```json
{
  "extraHttpHeaders": {
    "x-custom-auth": "my-secret-token",
    "x-bypass-protection": "token-value"
  }
}
```

These headers are merged into Playwright's `extraHTTPHeaders` option on both the top-level `use` and each project's `use`. Headers defined in your `playwright.config.ts` take precedence — if the same header name exists in both your Playwright config and `endform.jsonc`, the value from your Playwright config wins.

#### Environment variable override

You can override `extraHttpHeaders` using the `ENDFORM_EXTRA_HTTP_HEADERS` environment variable. Set it to a JSON string of key-value pairs:

```bash
ENDFORM_EXTRA_HTTP_HEADERS='{"x-custom-auth":"env-token"}' npx endform test
```

When this environment variable is set, it **fully replaces** the `extraHttpHeaders` defined in `endform.jsonc` (the two are not merged together).

### `organizationId`

Specify which organization id this project should run within. Is the highest precedence configuration for organization id when running suites. Makes suite runs fail if the authenticated user does not have access to that organization.

### `proxyNetworkHosts`

Choose which host names will have their HTTP traffic redirected to the CLI from the remote runners.
This is the easiest option for local web apps and APIs, and uses HTTP interception in Node and in the browser.
All the traffic sent from the remote runners to your CLI is sent encrypted over direct peer-to-peer connections. Read more about [traffic to local servers here](/docs/guides/proxy-via-local).

```json
{
    "proxyNetworkHosts": ["*.test.internal-domain", "*.staging.internal-domain", "<loopback>"]
}
```

Each string in the array is a match rule. Either:

- A hostname pattern `my-domain.com`, `*.internal.org`
- An IP literal like `127.0.0.1`
- `<loopback>` to match interfaces `localhost`, `*.localhost`, `127.0.0.1`, `[::1]`

### `proxyNetworkPorts`

Choose which local loopback ports will accept raw TCP connections from the remote runners.
Use this for databases or other clients that need to connect directly to `127.0.0.1:<port>`.
All the traffic sent from the remote runners to your CLI is sent encrypted over direct peer-to-peer connections. Read more about [traffic to local servers here](/docs/guides/proxy-via-local).

```json
{
  "proxyNetworkPorts": [5432, 6379]
}
```

### `region`

By default, your tests are run in the closest available region to where the endform CLI was run.

To override this choice, for example if your test environment is in a different region to your CI jobs, add the region parameter to your `endform.jsonc`.

Available values are `"eu"` and `"us"`.

```json
{
  "region": "eu"
}
```

### `remoteReporters`

Array of reporter names which should run exclusively during remote execution of tests.
Must correspond to the name of a reporter configured in your Playwright config.

For example in the case where `endform.jsonc` is:
```json
{
  "remoteReporters": ["./custom-reporter.ts"]
}
```

And `playwright.config.ts` set to:
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  reporter: [
    ["./custom-reporter.ts", { myCustomReporterOption: true }]
  ],
});

```

Then `./custom-reporter.ts` will run once on each remotely running test machine (one per test), and _not_ on the collected result.

### `traceRetention`

Control whether Endform retains Playwright traces for viewing in the dashboard. Accepts `"on"` (default) or `"off"`.

```json
{
  "traceRetention": "off"
}
```

When set to `"on"` (the default), traces from your test runs are uploaded to Endform and can be viewed later in the dashboard.

When set to `"off"`, traces are not uploaded to Endform. This can be useful for compliance requirements or if you have privacy concerns about trace data.

**Note:** This setting only controls what Endform stores for dashboard viewing. Regardless of this setting, traces are still generated and accessible locally depending on your Playwright `trace` config option.
