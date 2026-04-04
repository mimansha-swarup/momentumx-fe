---
name: Phase 4 Review Status
description: Findings from Phase 4 pipeline layout audit — a11y + styling pass on 2026-04-05
type: project
---

Phase 4 pipeline layout has had three prior review rounds plus a dedicated a11y + styling pass on 2026-04-05.

Build: passes (0 TypeScript errors). Lint: 14 warnings, all pre-existing outside Phase 4 files.

## A11y + Styling Pass (2026-04-05)

### Critical (must fix before shipping)
- **C1 StaleStepBanner.tsx:35** — `role="status"` is wrong for a static alert banner. Screen readers will not announce the stale warning at mount time because polite live regions only fire on content changes, not initial render. Fix: use `role="alert"`.

### Warnings (tech debt)
- **W1 ProjectHeader.tsx:110** — `role="heading" aria-level={1}` applied to a `<div>` that contains interactive children (`<button>`, `<input>`). ARIA spec prohibits interactive content inside heading role. Fix: use a real `<h1>` for the text only; move button and badge outside.
- **W2 ProjectHeader.tsx:143** — `<Pencil>` icon inside title-edit button is missing `aria-hidden="true"`. Button already has a complete `aria-label`; the icon is decorative.
- **W3 ProjectPipelineLayout.tsx:88** — Deletion overlay uses `role="status"` (polite). Inserted conditionally so some screen readers won't announce it at injection. Fix: use `role="alert"` for blocking-operation overlays.
- **W4 (from prior round, still open)** — `clearCurrentProject` never dispatched on unmount in ProjectPipelineLayout; stale currentProject persists when navigating away.

### Suggestions
- **S1 PipelineTracker.tsx:128** — `aria-hidden` on visible step labels is functional but could be expressed more clearly via `aria-describedby`.
- **S2 PipelineTracker.tsx:119** — `motion-safe:animate-pulse` correctly gated, but applied to full button element; consider limiting to decorative inner ring.
- **S3 ProjectPipelineLayout.tsx:81** — Add `id="main-content"` to `<main>` for future skip-link support.
- **S4 ProjectHeader.tsx:156** — Mobile menu button `aria-label` is static ("Open menu") regardless of sidebar open state; should reflect `aria-expanded`.

### Passing
- Glass-morphism design language: consistent across all files (bg-white/5, backdrop-blur-sm, border-white/10, rounded-xl)
- motion-safe: prefix: correctly applied to all animate-spin and animate-pulse instances
- Tailwind only: no inline styles; cn() used for all conditional classes
- @/ path alias: used everywhere, no relative path leakage
- Responsive design: mobile-first with md:/lg: breakpoints present
- focus-visible:ring-* on all interactive elements
- Decorative icons: aria-hidden="true" applied (except Pencil in ProjectHeader — see W2)
- Placeholder pages (Script, Hooks, Packaging): correct icon aria-hidden, custom utility classes consistent with codebase

**Why:** Tracked to inform Phase 5-7 reviewers. The C1 and W1 issues in shared layout components (StaleStepBanner, ProjectHeader) will affect all step pages built on top of them.
**How to apply:** When reviewing Phase 5-7 (script/hooks/packaging step implementations), verify the heading hierarchy is coherent once real h1 and h2 headings are in place, and that any new banner components use role="alert" for warnings that appear conditionally.
