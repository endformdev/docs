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

```json
{
  "additionalFiles": ["user-state/*"]
}
```

If your playwright config already specifies `storageState`, this parameter should not be needed - endform will read and send those automatically.
However if your tests have implicit dependencies on more files, use this parameter.

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

### `proxyNetworkHosts`

Choose which host names will have their traffic redirected to the CLI from the remote runners.
All the traffic sent from the remote runners to your CLI is sent encrypted over direct peer-to-peer connections. Read more about [traffic to local servers here](/docs/guides/proxy-via-local).

```json
{
    "proxyNetworkHosts": ["*.test.internal-domain", "*.staging.internal-domain", "<loopback>"]
}
```

Each string in the array is a match rule. Either:

- A hostname pattern `my-domain.com`, `*.interal.org`
- An IP literal like `127.0.0.1`
- `<loopback>` to match interfaces `localhost`, `*.localhost`, `127.0.0.1`, `[::1]`


### `organizationId`

Specify which organization id this project should run within. Is the highest precedence configuration for organization id when running suites. Makes suite runs fail if the authenticated user does not have access to that organization.
