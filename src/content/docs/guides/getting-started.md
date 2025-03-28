---
title: Getting Started
description: Running your tests with Endform for the first time.
---

Make sure to check out the [requirements](/docs/reference/requirements) before you start.

# Getting Started

The easiest way to get started with endform, and to check if your setup is compatible with endform at the moment, is to run the endform cli from your playwright project directory.

```
npx endform@latest test
```

This will prompt you to login and run your tests.

# Running your tests in CI

Once you have your tests passing with endform from your machine, you might want to run endform in your CI pipeline.

The easiest way to do this is to replace your "playwright test" command with "endform test" in your CI pipeline.

`endform` should also be installed as a dependency in your repository.

Here's an example of a what a GitHub Actions workflow might look like:

```
name: Endform
on:
  push:
    branches:
      - main

jobs:
  test:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm install

      - name: Run tests with Endform
        run: npm run endform test
        env:
          ENDFORM_API_KEY: ${{ secrets.ENDFORM_API_KEY }}
```

You will need an Endform API key to run your tests in CI, which you can in the settings page of the endform dashboard.