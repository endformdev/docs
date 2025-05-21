---
title: Custom Playwright Reporters
description: Using custom playwright reports with endform
sidebar:
  order: 3
---

## Custom Playwright Reporters in Endform

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
    console.log("onBegin", config.metadata);
    console.log(`Running ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase) {
    console.log(`Starting test: ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test: ${test.title}`);
  }

  onEnd(result: FullResult) {
    console.log(`Test suite finished with status: ${result.status}`);
  }
}

export default MyCustomReporter;
```

For more details on creating custom reporters, see the [Playwright documentation on custom reporters](https://playwright.dev/docs/test-reporters#custom-reporters).

## When Custom Reporters Run

In Endform, custom reporters run **after all tests have completed**, not while they are running live on remote runners. This approach models Playwright's shareded test execution.

Endform runs each of your tests on a remote runner, which creates a blob report which is sent back to the original runner. Once all tests complete, the playwright `merge-reports` cli command is run, which is when your custom reporters will run.

For more information on Playwright's sharding and how test reports are merged, see the [Playwright documentation on sharded runs](https://playwright.dev/docs/test-sharding).

## Endform-specific Properties in Custom Reporters

Endform extends Playwright's reporter interface with additional properties to enhance your reporting experience.

In the `onBegin` hook, Endform provides an `endformReportURL` in the `config.metadata` parameter that links directly to your test run in the Endform dashboard:

```javascript
onBegin(config: FullConfig, suite: Suite) {
  // Access the Endform dashboard URL for this test run
  console.log("Endform Report URL:", config.metadata.endformReportURL);
  // Example output: https://formend.dev/dashboard/fkJegSuE?suite_run=2xObB8z5sDNiCMRXnBw4ZCPqM0U
}
```

You can use this URL in your custom reporting to provide direct links to the suite run results in the Endform dashboard.

