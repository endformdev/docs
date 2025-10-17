---
title: Requirements
description: Our requirements on your Playwright setup
sidebar:
  order: 1
---

Endform is a _fully parallel_, _remote_ test runner.
Each of your playwright tests will be run on a separate machine in the cloud.

### Fully parallel

All of your tests will run at the same time with endform, which means that your tests need to be _completely independent_ of each other.

If you keep your tests decoupled from your application already by, for example, using apis to generate data, you are probably ready to use endform.

### Remote

Since your tests will be running on remote machines, the servers you are testing against need to be accesible to the remote runners.
There are two ways to acheive this:

- You are running preview infrastructure or a testing environment that is exposed to the internet anyway.
- You can use the `endform-proxy-network` addon to shuttle traffic between the remote runners and the machine your CLI runs on. Check out the [guide on proxying traffic via your local network](/docs/guides/proxy-via-local) for more information about this approach.

## Playwright requirements

- We support playwright projects written in typescript and javascript.
- The length of an individual test run is limited to 4 minutes (same as the `testConfig.timeout` option). The playwright default timeout is 30 seconds. This does not include retries.
- We currently only support the latest minor version of playwright (`1.53.0` at the time of writing).
- We currently only support Chrome. We run the same version of Chrome as the playwright version you are running ships with. Let us know if you are in need of more browsers and we can prioritise this.

### Playwright configuration options

Endform tries to directly use or replicate all playwright configuration options.
To understand how most of these options work, please refer to the [Playwright documentation](https://playwright.dev/docs/test-configuration).

There are a few exceptions to this.

Options that we currently don't support, but will do in the future (let us know and we will prioritize them):

- `forbidOnly`

Options that aren't supported since they don't make sense in a remote context:

- `fullyParallel` is always `true`, but you can limit concurrency using settings in the endform dashboard.

## Node requirements

- A version of Node.js that is more recent than the latest LTS version (Node 22+).
- In the remote test environment, your tests will run on node lts.

## Browser requirements

- We currently only support Chrome. We run the same version of Chrome as the playwright version you are running ships with.

## Operating system requirements

- We currently only support Linux and MacOS.
