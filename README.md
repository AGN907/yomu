<div align="center"><img src="apps/web/public/logo.svg" width="300" height="200" /></div>
<div align="center">
<h1>Yomu</h1>
<h3>Novel reader for all of your different sources</h3>
</div>
<div align="center">

  <a href="https://github.com/AGN907/Yomu/pulse">
      <img alt="Last commit" src="https://img.shields.io/github/last-commit/AGN907/Yomu?style=for-the-badge&logo=starship&color=8bd5ca&logoColor=D9E0EE&labelColor=302D41"/>
    </a>
 <a href="https://github.com/AGN907/Yomu/issues">
      <img alt="Issues" src="https://img.shields.io/github/issues/AGN907/Yomu?style=for-the-badge&logo=bilibili&color=F5E0DC&logoColor=D9E0EE&labelColor=302D41" />
    </a>
 <a href="https://twitter.com/intent/follow?screen_name=AGN907">
      <img alt="follow on Twitter" src="https://img.shields.io/twitter/follow/AGN907?style=for-the-badge&logo=twitter&color=8aadf3&logoColor=D9E0EE&labelColor=302D41" />
    </a>
    </div>
<br>

> Yomu is under active development, so you can expect some missing features and breaking changes in the future. If you find any issues please [open an issue](https://github.com/AGN907/yomu/issues/new) and I'll try to fix it as soon as possible.

# Overview

Yomu is an open-source and self-hosted web and mobile(soon) novel reader where you can read novels from third-party sources.

This repository contains all the code required to build & use the self-hosted web and mobile clients,

## Structure

- Next.js: the web client is built using Next.js with all code in Typescript
- React Native/Expo: the mobile client is built using React Native and Expo
- PNPM-workspace/Nx: the monorepo is managed using PNPM workspaces and Nx

| Name            | Path                                   | Description                                |
| --------------- | -------------------------------------- | ------------------------------------------ |
| `@yomu/web`     | [apps/web]('apps/web')                 | Next.js web client                         |
| `@yomu/core`    | [packages/core]('packages/core')       | Shared core library                        |
| `@yomu/sources` | [packages/sources]('packages/sources') | Implementation of third-party sources      |
| `@yomu/ui`      | [packages/ui]('packages/ui')           | UI components for web with Shadcn          |
| `@yomu/mobile`  | `apps/mobile`                          | React Native/Expo mobile client **(soon)** |

## CONTRIBUTING

I'm not really looking for contributions at the moment, but if you have any suggestions please [open an issue](https://github.com/AGN907/yomu/issues/new)
