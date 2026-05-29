---
title: Requirements
description: Our requirements on your Playwright setup
sidebar:
  order: 1
---

Endform is a _parallel_, _remote_ test runner.
Your Playwright tests will be run on many separate machines in the cloud.

### Parallel

We respect the [`fullyParallel` Playwright configuration option](https://playwright.dev/docs/api/class-testconfig#test-config-fully-parallel):

This means that:

- If `fullyParallel: false` (Playwright default), each _file_ will run in parallel.
- If `fullyParallel: true`, each _test case_ will run in parallel.

Generally, this means that your tests need to be _independent_ of each other in order to not interfere with other tests running at the same time.

If you already keep your tests decoupled from your application by, for example, using APIs to generate data, you are probably ready to use Endform.

### Remote

Since your tests will be running on remote machines, the servers you are testing against need to be accessible to the remote runners.
There are two ways to achieve this:

- You are running preview infrastructure or a testing environment that is exposed to the internet anyway.
- Endform can automatically shuttle traffic between the remote runners and the machine your CLI runs on. Check out the [guide on proxying traffic via your local network](/docs/guides/proxy-via-local) for more information about this approach.

## Playwright requirements

- We support Playwright projects written in TypeScript and JavaScript.
- The length of an individual test run is limited to 4 minutes (same as the `testConfig.timeout` option). The Playwright default timeout is 30 seconds. This does not include retries.
- If you are running `fullyParallel: false`, then the maximum timeout of 15 minutes applies to each _file_.
- We currently only support the latest two minor versions of Playwright.
- We currently only support Chrome. We run the same version of Chrome as the Playwright version you are running ships with. Let us know if you are in need of more browsers and we can prioritize this.

### Playwright configuration options

Endform tries to directly use or replicate all Playwright configuration options.
To understand how most of these options work, please refer to the [Playwright documentation](https://playwright.dev/docs/test-configuration).

There are a few exceptions to this.

Options that we currently don't support, but will do in future (let us know and we will prioritize them):

- `.only()`
- `.fail()`

## Node requirements

- A version of Node.js that is more recent than the latest LTS version (Node 22+).
- In the remote test environment, your tests will run on Node LTS.

## Browser requirements

- We currently only support Chrome. We run the same version of Chrome as the Playwright version you are running ships with.

## Operating system requirements

- We currently only support Linux and macOS.
