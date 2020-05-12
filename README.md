# Rust `clippy` Action

[![Sponsoring](https://img.shields.io/badge/Support%20it-Say%20%22Thank%20you!%22-blue)](https://actions-rs.github.io/#sponsoring)
![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)
[![Gitter](https://badges.gitter.im/actions-rs/community.svg)](https://gitter.im/actions-rs/community)
![Continuous integration](https://github.com/actions-rs/cargo/workflows/Continuous%20integration/badge.svg)
![Dependabot enabled](https://api.dependabot.com/badges/status?host=github&repo=actions-rs/toolchain)

> Clippy lints in your commits and Pull Requests

**Table of Contents**

* [Motivation](#motivation)
* [Example workflow](#example-workflow)
* [Inputs](#inputs)
* [License](#license)
* [Contribute and support](#contribute-and-support)

## Motivation

This is a **next gen** version of [actions-rs/clippy-check](https://github.com/actions-rs/clippy-check) Action
and it's in an **unstable** state right now, as it uses unstable/undocumented GitHub Actions features
and potentially can break at any time.

Compared to [actions-rs/clippy-check](https://github.com/actions-rs/clippy-check)
it has few advantages:

 1. `GITHUB_TOKEN` secret is not required anymore, using this Action is much safer in terms of security
 2. It works correctly for Pull Requests created from forked repositories

## Example workflow

This example is utilizing [`toolchain`](https://github.com/actions-rs/toolchain) Actions
to install the most recent `nightly` clippy version.

```yaml
on: [push, pull_request]
name: Clippy
jobs:
  clippy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions-rs/toolchain@v1
        with:
            toolchain: nightly
            components: clippy
            override: true
      # Note that there is no release tag available yet
      # and the following code will use master branch HEAD
      # all the time.
      - uses: actions-rs/clippy@master
        with:
          args: --all-features --all-targets
```

### With stable clippy

```yaml
on: [push, pull_request]
name: Clippy
jobs:
  clippy_check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: actions-rs/toolchain@v1
        with:
            toolchain: stable
            components: clippy
      - uses: actions-rs/clippy@master
        with:
          args: --all-features --all-targets
```

## Inputs


## Inputs

| Name        | Required | Description                                                                                                                            | Type   | Default |
| ------------| :------: | ---------------------------------------------------------------------------------------------------------------------------------------| ------ | --------|
| `args`      |          | Arguments for the `cargo clippy` command                                                                                               | string |         |

## License

This Action is distributed under the terms of the MIT license, see [LICENSE](https://github.com/actions-rs/toolchain/blob/master/LICENSE) for details.

## Contribute and support

Any contributions are welcomed!

If you want to report a bug or have a feature request,
check the [Contributing guide](https://github.com/actions-rs/.github/blob/master/CONTRIBUTING.md).

You can also support author by funding the ongoing project work,
see [Sponsoring](https://actions-rs.github.io/#sponsoring).
