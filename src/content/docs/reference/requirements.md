---
title: Requirements
description: Our requirements on your playwright setup.
sidebar:
  order: 1
---

Endform is a _fully parallel_, _remote_ test runner.
Each of your playwright tests will be run on a separate machine in the cloud.

### Fully parallel

All of your tests will run at the same time with endform, which means that your tests need to be _completely independent_ of each other.

If you keep your tests decoupled from your application already by, for example, using apis to generate data, you are probably ready to use endform.

### Remote

Since your tests will be running on remote machines, your test environment needs to be accessible on the public internet.
Endform does not support servers running "locally" / on `localhost`.

We reccomend using playwright directly when creating tests / running against `localhost`, and to run endform in your ci environment / against your test/stage/preview environments.

## Playwright Requirements

- We support playwright projects written in typescript and javascript.
- The length of an individual test run is limited to 2 minutes (same as the `testConfig.timeout` option). The playwright default timeout is 30 seconds. This does not include retries.
- We currently only support the latest minor version of playwright (`1.51.0` at the time of writing).
- We currently only support Chrome. We run the same version of Chrome as the playwright version you are running ships with.

### Playwright Configuration Options

Endform tries to directly use or replicate all playwright configuration options.
To understand how most of these options work, please refer to the [Playwright documentation](https://playwright.dev/docs/test-configuration).

There are a few exceptions to this.

Options that we currently don't support, but will do in the future (let us know and we will prioritize them):

- `forbidOnly`
- the `on-all-retries`, `on-first-retry`, `retain-on-first-failure` trace recording options. `off`, `on` and `retain-on-failure` are our reccomended options for trace recording.

Options that aren't supported since they don't make sense in a remote context:

- `webWorkers`
- `fullyParallel` is always `true`

## Node Requirements

- A version of Node.js that is more recent than the latest LTS version (Node 22+).
- In the remote test environment, your tests will run on node lts.

## Browser Requirements

- We currently only support Chrome. We run the same version of Chrome as the playwright version you are running ships with.

## Operating System Requirements

- We currently only support Linux and MacOS.
