---
name: git-workflow
description: Commit message format, branch naming, and pre-commit hooks for MomentumX frontend.
---

# Git Workflow

## Commit Message Format — Conventional Commits

```
<type>[optional scope]: <description>
```

- Description under 72 chars — no body or footer needed
- Never add `Co-Authored-By`, `Generated-By`, or any AI attribution footer

**Types:** `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `perf` | `ci` | `build` | `style` | `revert`

**Scopes:** `dashboard` | `packaging` | `research` | `script` | `hooks` | `onboarding` | `auth` | `ui` | `state` | `routing` | `config`

Breaking changes: `feat(routing)!: restructure app routes for pipeline`

Examples: `feat(dashboard): add video project list view` | `fix(packaging): handle empty title variations from API`

## Branch Naming

```
<type>/<description>
```

Types: `feature/` | `bugfix/` | `hotfix/` | `release/` | `chore/`

- Lowercase, numbers, and hyphens only — no consecutive or leading/trailing hyphens
- Example: `feature/video-project-dashboard`, `bugfix/packaging-save-error`
- Optionally include ticket number: `feature/issue-42-project-dashboard`

## Pre-Commit Hooks (Husky + lint-staged)

ESLint and Prettier run automatically on staged files. If lint fails, the commit is blocked — fix the issues, never bypass with `--no-verify`.

## Before Pushing

- `npm run build` passes with no TypeScript errors
- `npm run lint` passes with no ESLint errors
- No `console.log` left in production code paths
- No uncommitted `.env` files

## Never Commit

- `.env` or any file containing API keys or Firebase config
- `node_modules/`, `dist/`, `*.local` files
