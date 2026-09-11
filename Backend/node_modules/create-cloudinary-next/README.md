# create-cloudinary-next

[![npm version](https://img.shields.io/npm/v/create-cloudinary-react.svg?style=flat-square)](https://www.npmjs.com/package/create-cloudinary-next)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Scaffold a modern, production-ready Next.js application using Cloudinary. Features interactive setup, automatic environment configuration, and built-in AI coding assistance.

![Build with Cloudinary!](https://res.cloudinary.com/cloudinary-creators-community/image/upload/c_thumb,w_200,g_face/v1771434800/Tee-Mascot-Hacktoberfest-cloudicorn_x6zvtf.png)

## Quick start

Type this into your terminal:

```
npx create-cloudinary-next
```

...and you're off! The CLI will guide you through:

1.  **Project Name**: naming your new folder
2.  **Cloud Name**: entering your [Cloudinary cloud name](https://console.cloudinary.com/app/home/dashboard)
3.  **Upload Preset** (Optional): handling uploads to Cloudinary
4.  **Agentic Coding Tools Configuration**: installing the configuration your agentic tooling needs

## Requirements

- **Node.js** — use a [current LTS](https://nodejs.org/en/about/previous-releases) release.
- A **Cloudinary account**
  - [Sign up for free](https://cld.media/nextregisterreadme)
  - Your cloud name is in your [dashboard](https://console.cloudinary.com/app/home/dashboard)

## Features

- **Cloudinary Library and Components**: Pre-configured with Cloudinary's Next.js library, giving you robust, ergonomic, fully-typed components.
- **Interactive Setup**: Validates your cloud name and configures `.env` automatically.
- **AI-First**: Auto-generates configuration for Claude, Cursor, GitHub Copilot, and other agentic coding tools.
- **Skill-Powered Development**: Installs Cloudinary’s NextJS, transformation, and documentation skills to give agentic tooling expert-level Cloudinary context.
- **MCP Support**: Built-in Model Context Protocol configuration so that agentic tooling can call Cloudinary APIs directly.

### Headless Mode

For CI/CD pipelines, scripts, or automated workflows, pass `--headless` along with all options as flags to skip the interactive prompts:

```bash
npx create-cloudinary-next --headless \
  --cloudName your-cloud-name \
  --projectName my-app
```

#### Headless Mode Options

| Flag | Type | Default | Description |
|---|---|---|---|
| `--cloudName` | string | *(required)* | Your Cloudinary cloud name |
| `--projectName` | string | `my-cloudinary-app` | Output directory name |
| `--hasUploadPreset` | boolean | `false` | Set if you have an unsigned upload preset |
| `--uploadPreset` | string | — | Your unsigned upload preset name (required if `--hasUploadPreset`) |
| `--aiTools` | string (repeatable) | `cursor` | AI tools to configure: `cursor`, `copilot`, `claude`, `generic` |
| `--installDeps` | boolean | `true` | Install dependencies after scaffolding |
| `--startDev` | boolean | `false` | Start the dev server after install |
| `--packageManager` | string | *(auto-detected)* | `npm`, `pnpm`, `yarn`, or `bun` |

> **Note:** Shell variables should be quoted to prevent unexpected expansion: `--cloudName "$CLOUD_NAME"`.

## Development

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for version management and [semantic-release](https://github.com/semantic-release/semantic-release) for automated releases.

### Release Process

Releases are triggered manually via GitHub Actions workflow. The workflow uses npm trusted publishing (OIDC) for secure package publishing. New versions are published to npm when the workflow runs without dry run.

**Dry run (default):** When you run the workflow, "Dry run only" is checked by default. This runs semantic-release in dry-run mode—**no git push, no tags, no npm publish**. Use this to verify the next version and release notes before doing a real release. To publish for real, run the workflow again and **uncheck** "Dry run only". Each real release creates a GitHub release, updates CHANGELOG, and publishes the new version to npm (when the version changes).

### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `perf`: Performance improvements

