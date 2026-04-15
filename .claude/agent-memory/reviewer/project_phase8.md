---
name: Phase 8 Research Intel Panel Audit
description: Findings from Phase 8 (Research Intel Panel — TrendingTab, CompetitorsTab, KeywordsTab) review (2026-04-14).
type: project
---

Phase 8 added the Research Intel Panel section to the existing Research page: three tab components (TrendingTab, CompetitorsTab, KeywordsTab), barrel exports, and tab orchestration in ResearchPage.

**Build:** passes (0 TypeScript errors). **Lint:** 0 errors from Phase 8 files (11 pre-existing warnings in unrelated files, unchanged).

---

## Findings

### Warnings

- **W1:** `src/components/research/KeywordsTab.tsx:96` — `motion-safe:animate-spin` used on the keyword search spinner. Every other spinner in the Research page and sibling components uses bare `animate-spin`. Inconsistent: users with `prefers-reduced-motion` see only this one spinner stop. Either adopt `motion-safe:` everywhere or revert to bare `animate-spin` here.

- **W2:** `src/components/research/CompetitorsTab.tsx:126` and `KeywordsTab.tsx:141` — List keys use `${content}-${index}` composite pattern. `ICompetitorChannel` and `IKeywordResult` types have no backend `id` field, so there is no stable unique key. Lists are replaced wholesale on each fetch (no reordering), so practical risk is low. Resolution: add `id` to types from the backend, or use pure index keys with an explanatory comment.

### Suggestions

- **S1:** `src/pages/Research/index.tsx:128` — `useEffect` for tab-activated fetches depends on the full `trending` and `competitors` state objects (new reference on every dispatch). Guards prevent redundant fetches, but more precise deps (`trending.isLoading`, `trending.error`, `trending.videos.length`) would be cleaner.

- **S2:** `src/pages/Research/index.tsx:360` — `aria-controls` on tab buttons points to `panel-${tab}` ids that only exist in the DOM while that tab is active. Technically non-conformant for assistive technologies that use `aria-controls` to locate panels. Use `hidden` attribute across all rendered panels, or omit `aria-controls` and rely on `aria-labelledby` alone. Low impact in practice.

---

**Verdict: Shippable after W1 and W2 are resolved. No Criticals.**

**Why W1 matters:** Visual inconsistency for reduced-motion users; only one of many spinners respects the preference.
**Why W2 matters:** Composite key with index doesn't uniquely identify items if two channels share the same title; aligns with checklist rule against index keys for dynamic lists.
