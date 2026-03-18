---
title: Environment variables
description: Environment variables used by Endform and how to configure them
sidebar:
  order: 3
---

## User-defined environment variables

Endform transfers selected environment variables to remote runners. For details, see [`environmentVariables` in `endform.jsonc`](/docs/reference/endform-config#environmentvariables).

At a high level:

- `E2E_*` variables are transferred automatically.
- Variables referenced from tests via `process.env` are transferred automatically.
- You can explicitly include additional variables with `environmentVariables`.

## Runtime marker: `ENDFORM=true`

Endform sets `ENDFORM=true` for Node processes it starts as part of your test execution flow.

You can use this to detect Endform runtime context in your own code:

```ts
const isEndform = process.env.ENDFORM === "true";
```

## Extra HTTP Headers

You can set `ENDFORM_EXTRA_HTTP_HEADERS` to override the Playwright `extraHttpHeaders` option.
See [`extraHttpHeaders` in `endform.jsonc`](/docs/reference/endform-config#extrahttpheaders).

## Git metadata overrides

`ENDFORM_GIT_BRANCH` and `ENDFORM_GIT_COMMIT_SHA` are a simple way to override the branch and commit that Endform reports for a run.

### `ENDFORM_GIT_BRANCH`

Explicitly sets the git branch name Endform should associate with a suite run.

### `ENDFORM_GIT_COMMIT_SHA`

Explicitly sets the git commit SHA Endform should associate with a suite run.

If set, Endform uses these values instead of automatic git detection.

