# momentumx-fe — Parking Lot (deferred / tech debt)

> Pre-existing debt surfaced while syncing the FE to the backend contract changes
> (branch `feature/backend-contract-sync`, 2026-07). None of these are regressions
> from the sync — they're existing issues the sync brushed against. Logged so they
> aren't lost; pick up when the relevant area is next touched.

---

## 1. Legacy "old flow" still present — **MED**

The pre-ideas flow is hidden behind `HIDE_OLD_FLOW = true` (`constants/root.ts`) rather than
removed:
- `components/shared/titleCard` + `components/titles/list` + `pages/Titles` render the old
  title-first list. `TitlePage` is still lazy-imported in `constants/route.tsx` but has **no
  nav links** and is gated off.
- Because it's dead, the idea-field display (concept/type/evidence) was **only** added to the
  active surface (`research/TopicCard`), not `TitleCard`.
- **When resumed:** delete the old-flow components/pages/route once we're confident nothing
  depends on them, and drop the `HIDE_OLD_FLOW` flag.

## 2. Deprecated stateless hooks call likely 404s — **MED**

`packagingService.generateHooks()` (`service/packaging.ts`) posts to
`/v1/packaging/generate-hooks`, which **does not exist** on the backend (hooks live at
`/v1/hooks/*`). It's already marked `@deprecated` in `packaging.thunk.ts` with a note to
migrate to `hooks.thunk.ts` when a `videoProjectId` is available.
- **When resumed:** migrate the call sites to the project-scoped `/v1/hooks/generate` flow and
  remove the dead packaging hooks URL + thunk.

## 3. Naming debt: "titles" means "ideas" — **LOW (cosmetic)**

Step 1 now generates **ideas** (concepts), but the FE still names everything "titles":
`service/titles.ts`, `utils/feature/titles/*` (slice/thunk), `TitleService.generateTitles()`,
etc. The backend deliberately kept the `/v1/topics` path for FE compatibility, so this is a
naming-only mismatch, not a functional one.
- **When resumed:** rename the titles feature slice/service to `ideas` for clarity (coordinate
  with the P6A "topic → idea" copy relabel on the backend side).

## 4. No FE test suite — **MED**

`package.json` has `dev/build/preview/lint/format/typecheck` but **no `test` script** and no
test framework. Unlike the backend (Jest, 285 tests), FE changes rely on typecheck + lint +
manual review only — no safety net for regressions.
- **When resumed:** stand up Vitest + React Testing Library; start with the network
  interceptor (401 → signOut) and the packaging/title reducers.

## 5. Quality-chip primitive inconsistency — **LOW (cosmetic)**

The two backend-metadata "chips" use different primitives: `TopicCard`'s `ideaType` is a
`<Badge>` (matches its sibling badges), while `TitlesCard`'s CTR score is a raw `<span>` pill
(matches its local raw-span style + needs custom tier colours). Each is locally consistent;
unifying would drag a foreign pattern into one file. Only worth revisiting if a shared
"score/label chip" component emerges.
