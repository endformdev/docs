---
title: Endform Config - endform.jsonc
description: Configure endform further with an `endform.jsonc` file.
sidebar:
  order: 2
---

To further configure endform, place an `endform.jsonc` file in your repository. It can be:

- In the same folder as your playwright suite -> applies to that suite
- In the root of your repository -> applies to all suites in your repository

## `endform.jsonc` Config Parameters

Currently, `endform.jsonc` supports the following options:

### `additionalFiles`

`additionalFiles`: an array of strings used as globs to send extra files to your test machines.

```
{
  "additionalFiles": ["user-state/*"]
}
```

If your playwright config already specifies `storageState`, this parameter should not be needed - endform will read and send those automatically.
However if your tests have implicit dependencies on more files, use this parameter.

### `environmentVariables`

`environmentVariables`: an array of string regular expressions that are used to match environment variables that should be transferred to the remote runners.

```
{
  "environmentVariables": ["VERCEL_.*"]
}
```

By default the following environment variables are automatically transferred:

- Environment variables that start with `E2E_`
- All environment variables that are set in your `playwright.config.ts`
- Environment variables are directly inlined into the test command `URL=https://my-url.com npx endform@latest test`





