---
name: project_phase1
description: Phase 1 type and service layer changes — review status as of 2026-03-30
type: project
---

Phase 1 adds new fields to ITitleState, IScriptState, IPackagingState, IPipelineStep, IGeneratedTopic, and aligns service return types.

**Build status (2026-03-30):** `npm run build` passes cleanly. `npm run lint` produces 13 warnings, 0 errors — all pre-existing (missing deps in useEffect, fast-refresh issues in shadcn ui files).

**Why:** Phase 1 is the type-foundation layer before UI implementation phases begin. The build passing is the primary gate.

**How to apply:** Future reviews should use these baselines. Any new errors introduced by subsequent phases need to be caught against this clean baseline.

**Phase 1a Titles review (2026-03-30) — issues to address:**
- CRITICAL: `editTitle` URL uses `{{titleId}}` placeholder but service URLS constant says `editTitle: "/v1/topics/edit/{{titleId}}"` — this actually matches the `.replace("{{titleId}}", titleId)` call. No bug.
- WARNING: `TopicsListResponse` in `titles.ts` defines `lists: IGeneratedTopic[]` but `IGeneratedTopic` lives in `src/types/components/dashboard.ts` — type should move or re-export from `src/types/feature/title.ts` to avoid cross-domain type dependency.
- WARNING: `generateTitles` in titles.service returns `IBaseFetchResponse<TopicsListResponse['lists']>` (an array) but `generateTitles.fulfilled` reducer spreads it as `action.payload?.data ?? []` — the data shape is `IGeneratedTopic[]`, not `TopicsListResponse`. This is consistent but the service return type is misleading (should be `IBaseFetchResponse<IGeneratedTopic[]>` explicitly).
- WARNING: `retrieveTitles` thunk omits `handleToast()` — success messages from GET are silent. Minor for read-only fetch, but inconsistent with the other thunks in the same file.
- WARNING: `useTitles.tsx:53` — useEffect missing `fetchTitle` and `lists?.length` from deps array — ESLint warning, could cause stale closure bugs.
- WARNING: `titleCard/index.tsx` — local `isLoading` state duplicates `isEditing` loading management that the slice already tracks. Not consuming `titlesIsEditing` selector.
- WARNING: `titleCard/index.tsx:54` — silent catch `catch { // Error handled silently }` around `dispatch(editTitles(...))`. Redux `rejected` case sets error state but the component swallows the dispatch result. Should unwrap or let the slice error surface through `useAppSelector(titlesError)`.
- INFO: `useTitles.tsx:14-15` — empty `useEffect([filterBy])` body is dead code.
- INFO: `ITitleState` missing `error: string | null` in the Phase 1 plan type-fixes checklist — it IS present in the current state, so this is already resolved.

**Phase 1c Packaging review (2026-03-30) — resolved and outstanding:**
- RESOLVED: `console.log` statements previously noted in `ShortsScriptCard.tsx` — no longer present in the file.
- RESOLVED: `action.payload as string` cast in packaging.slice.ts — replaced with `(action.payload as { message?: string })?.message ?? "Unknown error"` pattern throughout.
- RESOLVED: Service `regenerateItem` now returns `IBaseFetchResponse<RegenerateItemResponse>` directly (not `data: unknown`). Thunk uses `createAsyncThunk<RegenerateItemResponse, ...>` with a null-guard (`if (!response.data)`) before returning — no unsafe casts. Discriminated union narrowing verified by passing build.
- WARNING: `generateAllPackaging` thunk calls `packagingService.generateHooks()` directly on line 133 — bypasses any thunk error boundary for the hooks sub-call. If `generateHooks` rejects, the outer `try/catch` will surface it, so it won't be silent, but error recovery cannot target hooks independently.
- WARNING: `ThumbnailsCard.tsx` and `ShortsScriptCard.tsx` use `toast` directly from `sonner` rather than `toastError()`/`toastSuccess()` from `@/utils/toast`. Inconsistent with the pattern the rest of the codebase uses (via toast utilities).
- WARNING: `PackagingPage/index.tsx:129` — inline `style` prop for `animationDelay` on a background div. This is a pure decoration element; acceptable here but should be tracked as a known exception to the no-inline-styles rule.
- INFO: Phase 1c thunks `listPackaging`, `getPackaging`, `regenerateItem`, `submitPackagingFeedback`, `exportPackaging` are all present with correct `rejectWithValue` error propagation.
- INFO: `RegenerateItemResponse` discriminated union is well-formed and the slice switch/case in `extraReducers` handles all four arms correctly.

**Service layer review (2026-03-30 — all four files):**
- `titles.ts` — clean. All four reviewed methods (`regenerateAll`, `regenerateOne`, `submitFeedback`, `exportTopics`) correctly typed and use correct HTTP verbs. Singleton exported as `titleService`.
- `script.ts` — clean. All three new methods (`submitFeedback`, `exportScript`, `regenerateScript`) correctly typed. Singleton exported as `scriptService`. URL templates use single-brace `{param}` — inconsistent with double-brace `{{param}}` used in titles and packaging, but not a runtime bug.
- `packaging.ts` — near-clean. All five new methods (`listPackaging`, `getPackaging`, `regenerateItem`, `submitFeedback`, `exportPackaging`) correctly typed and correct HTTP verbs. Singleton exported as `packagingService`. One issue: `regenerateItem` return type uses `data: unknown` despite `RegenerateItemResponse` discriminated union already existing in the types file — see WARNING below.
- `onboarding.ts` — missing singleton export. Class is exported but no instance is exported. Callers use `new onboardingService()` at call-site. This is the key Phase 1 singleton fix that was not applied.

**Known issues carried forward (pre-existing):**
- No `handleToast()` call in `editScript` thunk — user is not notified of save success/failure.
- 13 pre-existing ESLint warnings (missing useEffect deps, fast-refresh in shadcn files).
- `onboardingService` calls `handleToast()` inline — should move error handling to thunks.
