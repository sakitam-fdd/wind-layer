# 贡献指南

## 版本

| 主版本号      | 次版本号                   |  修订号              |
| ------------- | -------------------------- | -------------------- |
| 破坏性变更    | 功能添加,无破坏性变更      | Bug修正,无破坏性变更 |

### 版本号递增规则如下：

- 主版本号：当你做了不兼容的 API 修改,
- 次版本号：当你做了向下兼容的功能性新增,
- 修订号：当你做了向下兼容的问题修正.

## Issue 规范

- issue 仅用于提交 Bug 或 Feature 以及设计相关的内容，其它内容可能会被直接关闭。

- 在提交 issue 之前，请搜索相关内容是否已被提出。

- 请说明使用的插件的版本号，并提供操作系统和浏览器信息。推荐使用 [JSFiddle](https://jsfiddle.net/) 或者[codepen](https://codepen.io/)生成在线 demo，这能够更直观地重现问题。

## Pull Request 规范
- 请先 fork 一份到自己的项目下，不要直接在仓库下建分支。

- commit 信息要以# [记录] + messages


- 执行 `npm run dev && npm run build` 后可以正确打包文件。

- 提交 PR 前请 rebase，确保 commit 记录的整洁。

- 确保 PR 是提交到 `dev` 分支，而不是 `master` 分支。

- 如果是修复 bug，请在 PR 中给出描述信息。


## 开发环境搭建

首先你需要 Node.js 4+ 和 NPM 3+
```shell
git clone https://github.com/sakitam-fdd/wind-layer.git
npm install
npm run dev
npm run build
npm run karma.test
npm run karma.cover
```
