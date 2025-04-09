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
