---
title: Requirements
description: Our requirements on your playwright setup.
---

## Your test environment

Endform is a _remote_ test runner that runs your tests on cloud infrastructure.

This means that your test environment needs to be accessible on the public internet.
Endform does not support servers running "locally" / on `localhost`.

We reccomend using playwright directly when creating tests / running against `localhost`, and to run endform in your ci environment / against your test/stage/preview environments.

Alternatively, you can use a tunneling service to expose your local services to the public internet, and configure endform to run tests against that.

## Playwright

- The latest minor version of playwright (`1.51.0` at the time of writing).
- Currently unsupported configuration options:
  - Playwright projects. Let us know if you need this, and we will prioritize it.
  - `forbidOnly`
  - `webWorkers`

## Node

- A version of Node.js that is more recent than the latest LTS version (Node 20+).

## Browser

- We currently only support Chrome. We run the same version of Chrome as the playwright version you are running.
