# Contributing guide

So you want to contribute to the project? Well, this guide list some things you have to know before you start.

## Where to contribute

As Yomu is a monorepo it house multiple packages within it. We only need to focus on two.

- [Yomu Web](./apps/web): The web client
- [Sources](./packages/sources): Where sources implementations are stored

The [Core](./packages/core/) and [UI](./packages/ui/) packages are not packages where you will have to contribute to them independently.

The Core package is used across all packages and the UI package is only for Shadcn components to be used in the web client.

So if you think a method will be reused across packages move it to the core package. And if you want to add a new Shadcn component, do it in the UI package.

## Gettings started

> [!TIP]
> We recommend using the [GitHub Flow](https://docs.github.com/en/get-started/using-github/github-flow) for contributing to this project.

You see a problem? check if there is an [issue](https://github.com/AGN907/yomu/issues/new) or [pull request](https://github.com/AGN907/yomu/pulls) addressed to it, or create one and start working on it on your own fork of the repository.

After you finish the work you can open a pull request with the changes. I will try to review it as soon as possible. and merge it to main.

The same process applies if you have a feature or an enhancement request.
