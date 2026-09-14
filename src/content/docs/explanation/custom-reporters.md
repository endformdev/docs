---
title: Custom Playwright reporters
description: Using custom Playwright reporters with Endform
sidebar:
  order: 5
---

## Custom Playwright reporters in Endform

Endform fully supports Playwright's custom reporter functionality. You can use all standard Playwright reporter configurations and methods to create custom reports for your test runs.

Custom reporters follow the Playwright reporter interface:

```typescript
import type {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from "@playwright/test/reporter";

class MyCustomReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log("Endform Report URL:", config.metadata.endformReportURL);
    console.log(`Running ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test: ${test.title}`);
    const endformTraceUrl = result.annotations.find(
      (annotation) => annotation.type === "endformTestAttemptTraceURL",
    )?.description;
    if (endformTraceUrl) {
      console.log(`Endform trace URL: ${endformTraceUrl}`);
    }

    const endformOtelTraceUrl = result.annotations.find(
      (annotation) => annotation.type === "endformTestAttemptOtelTraceURL",
    )?.description;
    if (endformOtelTraceUrl) {
      console.log(`Endform OpenTelemetry trace URL: ${endformOtelTraceUrl}`);
    }
  }

  onEnd(result: FullResult) {
    console.log(`Test suite finished with status: ${result.status}`);
  }
}

export default MyCustomReporter;
```

For more details on creating custom reporters, see the [Playwright documentation on custom reporters](https://playwright.dev/docs/test-reporters#custom-reporters).

## When custom reporters run

In Endform, custom reporters run **after all tests have completed**, not while they are running live on remote runners. This approach models Playwright's sharded test execution.

Endform runs each of your tests on a remote runner, which creates a blob report that is sent back to the original runner. Once all tests complete, the Playwright `merge-reports` CLI command runs, which is when your custom reporters will run.

For more information on Playwright's sharding and how test reports are merged, see the [Playwright documentation on sharded runs](https://playwright.dev/docs/test-sharding).

## Endform-specific properties in custom reporters

Endform extends Playwright's reporter interface with additional properties to enhance your reporting experience.

### Endform report URL

In the `onBegin` hook, Endform provides an `endformReportURL` in the `config.metadata` parameter that links directly to your test run in the Endform dashboard:

```javascript
onBegin(config: FullConfig, suite: Suite) {
  // Access the Endform dashboard URL for this test run
  console.log("Endform Report URL:", config.metadata.endformReportURL);
  // Example output: https://endform.dev/dashboard/fkJegSuE?suite_run=2xObB8z5sDNiCMRXnBw4ZCPqM0U
}
```

You can use this URL in your custom reporting to provide direct links to the suite run results in the Endform dashboard.

### Endform test attempt URL

In the `onTestEnd` hook, Endform adds an annotation with the type `endformTestAttemptTraceURL` that contains a link to the specific test attempt trace if one was created:

```javascript
onTestEnd(test: TestCase, result: TestResult) {
  // Access the Endform trace URL for this specific test attempt
  const endformTraceUrl = result.annotations.find(
    (annotation) => annotation.type === "endformTestAttemptTraceURL",
  )?.description;
  if (endformTraceUrl) {
    console.log(`Endform trace URL: ${endformTraceUrl}`);
    // Example output: https://endform.dev/app/org/xyz...
  }
}
```

You can use this URL in your custom reporting to link directly to the detailed trace information for each test attempt.

### Endform OpenTelemetry trace URL

When a Playwright OpenTelemetry trace was created for a test attempt, Endform also adds an annotation with the type `endformTestAttemptOtelTraceURL`. Endform detects this from the `playwrightOpentelemetryTraceId` annotation added by `playwright-opentelemetry/reporter`:

```javascript
onTestEnd(test: TestCase, result: TestResult) {
  const endformOtelTraceUrl = result.annotations.find(
    (annotation) => annotation.type === "endformTestAttemptOtelTraceURL",
  )?.description;
  if (endformOtelTraceUrl) {
    console.log(`Endform OpenTelemetry trace URL: ${endformOtelTraceUrl}`);
    // Example output: https://endform.dev/app/org/xyz...
  }
}
```

This annotation is only present when the remote runner produced a Playwright OpenTelemetry trace for that test attempt.

## Quarantined results

[Quarantine rules](/docs/guides/quarantine-tests) allow selected tests to keep running without their failures normally failing the suite. Endform's dashboard and analytics preserve the actual outcomes. The merged blob reports consumed by Playwright reporters use a passing representation for quarantined attempts whose original status is `passed`, `failed`, or `timedOut`.

For those attempts, the reported status and expected status are `passed`, and the reported errors are cleared. This means an HTML, JUnit, or custom reporter can show a passing result where Endform's dashboard shows a quarantined failure. Skipped, interrupted, and attempts that did not run are not converted to passing results by quarantine.

The original information is available in two places:

- An `endform-quarantined` annotation identifies the quarantine rule and original status.
- An `application/json` attachment named `endform-quarantined-original-result` contains `quarantineRuleId`, `status`, `expectedStatus`, `errors`, and `annotations` from the original attempt.

If your reporter needs the original outcome, read the attachment rather than relying only on `result.status`. Attachments can be supplied as an inline body or a file path:

```typescript
import { readFileSync } from "node:fs";
import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";

export default class QuarantineReporter implements Reporter {
  onTestEnd(test: TestCase, result: TestResult) {
    const attachment = result.attachments.find(
      (item) => item.name === "endform-quarantined-original-result",
    );
    if (!attachment) return;

    const body =
      attachment.body ??
      (attachment.path ? readFileSync(attachment.path) : null);
    if (!body) return;

    const original = JSON.parse(body.toString("utf8"));
    console.log(`${test.title}: ${original.status} (quarantined)`);
    console.log("Quarantine rule:", original.quarantineRuleId);
  }
}
```

Endform's built-in terminal reporter reads these diagnostics to display original outcomes with quarantine labels and counts. Using the original failure to fail a separate reporting check can make that check fail even when Endform considers the suite passing.
