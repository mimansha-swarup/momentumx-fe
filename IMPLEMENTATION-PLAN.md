# MomentumX Frontend — Implementation Plan

## Parity Status

| Layer | Coverage |
|-------|----------|
| Service methods | 100% — every backend endpoint has a frontend service method |
| Thunks | ~60% — video project, hooks, research have thunks. Topics and packaging missing thunks for newer endpoints |
| UI/Pages | ~20% — only Packaging page is active. Everything else hidden or doesn't exist |

## Backend Auto-Behavior (CRITICAL — verified from source code)

The backend automatically handles many state transitions. The frontend must NOT duplicate these calls.

| Frontend Action | Backend Auto-Does | Frontend Should NOT Call |
|----------------|-------------------|------------------------|
| Trigger SSE script stream | `startStep("script")` + `linkResource("script")` + `completeStep("script")` | Any of these three — just re-fetch project after stream completes |
| `generateHooks()` | `linkResource("hooks", batchId)` | `linkResource` for hooks |
| `selectHook()` | `completeStep("hooks")` + sets `selectedHookIndex` on project | `completeStep("hooks")` |
| `savePackaging()` with `videoProjectId` | `linkResource("packaging")` + `completeStep("packaging")` | Either of these — just re-fetch project after save |
| `regenerateScript()` | `markStale` on hooks + packaging steps + packaging document | Manual stale state management — just re-fetch project |
| `regenerateHooks()` | `markStale` on packaging step + packaging document, clears `selectedHookIndex` | Manual stale management |
| `regenerateItem()` | Updates `itemStatuses[item]` to "completed", auto-clears `isStale` if all items done | Manual `itemStatuses` tracking |

## Built But Zero UI Consumers

| Feature | Built Thunks (0 callers) | Missing Thunks (service exists, no thunk) |
|---------|-------------------------|------------------------------------------|
| Video Project | `createProject`, `listProjects`, `getProject`, `updateWorkingTitle`, `deleteProject`, `startStep`, `completeStep`, `linkResource` | — |
| Hooks | `generateHooks`, `selectHook`, `regenerateHooks`, `submitHookFeedback`, `exportHooks` | — (no GET endpoint exists on backend) |
| Research | `fetchTrending`, `fetchCompetitors`, `fetchKeywords` | — |
| Topics | `generateTitles`, `retrieveTitles`, `editTitles` (hidden pages only) | `regenerateAll`, `regenerateOne`, `submitFeedback`, `exportTopics` |
| Scripts | (hidden pages only) | `submitFeedback`, `exportScript`, `regenerateScript` |
| Packaging | active page covers generation + save | `listPackaging`, `getPackaging`, `regenerateItem`, `submitFeedback`, `exportPackaging` |

## Open Blockers

| Blocker | Impact | Resolution |
|---------|--------|-----------|
| No `GET /v1/hooks/:hooksId` | Can't load existing hooks when revisiting Hooks step | Frontend must cache hooks batch in Redux; on revisit, only `hooksId` is available from project. Need to store hooks data persistently in slice or request backend addition |
| `regenerateOne` (topic) clears `videoProjectId` | Regenerating a single topic detaches it from its project — destructive | Show warning in UI before allowing single-topic regeneration if topic has a linked project |

**Resolved:** `completeStep` on stale status — verified backend allows `stale` → `completed` transition (no guard against it). "Keep as-is" flow is safe.

## Key Data Model Facts

- **Script ID = Topic ID** — deterministic 1:1 mapping, not auto-generated
- **Packaging is upserted** — `savePackaging` with same `videoProjectId` updates existing doc
- **`thumbnailHint`** — extracted from first thumbnail text, stored on project for list view
- **Hooks batch has no GET endpoint** — only generate, select, regenerate, feedback, export
- **Topic `embedding`** field exists (vector) — not relevant for frontend, ignore
- **`hookFeedback` keys are string indices** ("0", "1", etc.) not numbers

## Review Findings — Issues to Address Per Phase

### Prerequisites (before any phase)
- [x] Install `dialog` UI component: `npx shadcn@latest add dialog` — needed for Phase 2b delete confirm
- [x] Remove `console.log` in `src/components/packaging/ShortsScriptCard.tsx:74` and `:301`
- [x] Fix `onboardingService` export — currently exports the class, not a singleton instance

### Type fixes needed during Phase 1
- [x] Add `archived`, `batchId`, `videoProjectId`, `userFeedback` fields to `TopicsListResponse.lists` items
- [x] Tighten `IPipelineStep.items` to `{ titles: StepStatus; description: StepStatus; thumbnail: StepStatus; shorts: StepStatus }`
- [x] Add `isStale`, `staleReason: "script_regenerated" | "hooks_regenerated" | null`, `staleSince` to `GetPackagingResponse`
- [x] Add `PackagingItemStatus` type and `itemStatuses` to packaging types
- [x] Add per-item feedback state to `IPackagingState`
- [x] Add `linkResource.rejected` handler in videoProject slice
- [x] Add `thumbnailHint: string | null` to `IVideoProjectListItem` if not present

### Additional fixes during Phase 1
- [x] Add `handleToast()` calls to hooks thunks (all 5 are missing toast handling)
- [x] Add `error`, `isSubmittingFeedback`, `isExporting`, `isRegenerating` fields to `IScriptState` in `script.slice.ts`
- [x] Add `script.slice.ts` extraReducers for new script thunks (submitScriptFeedback, exportScript, regenerateScript)

### Notes for specific phases
- **Phase 3**: `regenerateAll` triggers stale cascade on ANY active video project linked to old topics
- **Phase 3**: `regenerateOne` clears `videoProjectId` from topic — destructive, warn user
- **Phase 5**: SSE uses `?token=` query param, NOT `baseFetch`. `:scriptId` param is actually a `topicId`
- **Phase 5**: Backend auto-starts, auto-links, auto-completes script step — frontend just streams and re-fetches
- **Phase 6**: `selectHook` auto-completes hooks step — no separate complete call needed
- **Phase 6**: On revisit, hydrate `selectedHookIndex` from project. Hooks batch data must be cached in Redux since no GET endpoint exists
- **Phase 7**: `savePackaging` auto-links and auto-completes — no separate complete/link calls needed
- **Phase 7**: `selectedHook` text should be passed to generation endpoints for better AI quality
- **Phase 7**: `regenerateItem` auto-updates `itemStatuses` and auto-clears `isStale` when all items done
- **Phase 9**: Fix `user?.brandName` redirect guard, fix `@ts-expect-error`, fix singleton export

---

## Phase 1 — Missing Thunks + Type Fixes

- [x] **1a** Add thunks for topics: `regenerateAllTopics`, `regenerateOneTopic`, `submitTopicFeedback`, `exportTopics` → `titles.thunk.ts`, `titles.slice.ts`
- [x] **1b** Add thunks for scripts: `submitScriptFeedback`, `exportScript`, `regenerateScript` → `script.thunk.ts`, `script.slice.ts`
- [x] **1c** Add thunks for packaging: `listPackaging`, `getPackaging`, `regenerateItem`, `submitPackagingFeedback`, `exportPackaging` → `packaging.thunk.ts`, `packaging.slice.ts`
- [x] **1d** Fix types: see "Type fixes needed" section above

## Phase 2 — Dashboard + Routes

- [x] **2a** Rewrite Dashboard to show video project list (ProjectCard, ProjectList, pagination, status filter). ProjectCard shows: `workingTitle`, `currentStep` badge, `overallStatus` badge, `thumbnailHint`, relative timestamp
- [x] **2b** Add delete project UI (confirm dialog) — requires `dialog` component
- [x] **2c** Add all new routes to `route.tsx` — lazy-load all non-Dashboard pages, add `/app/project/:projectId` placeholder
- [x] **2d** Update sidebar nav — add Research, remove standalone Packaging

## Phase 3 — Research Page

- [x] **3a** Build Research page with topic generation grid
- [x] **3b** Wire topic selection → `createProject(topicId)` → navigate to `/app/project/:projectId` (ProjectDetailRedirect handles routing to current step)
- [x] **3c** Add topic feedback, regenerate single (with warning if topic linked to project), regenerate all (with stale cascade warning)
- [x] **3d** Add topic export button
- [x] **3e** Show `isScriptGenerated` badge, filter out `archived` topics, show `videoProjectId` linkage status

## Phase 4 — Pipeline Layout

- [x] **4a** Build `ProjectPipelineLayout` (nested layout with `<Outlet />`)
- [x] **4b** Build `PipelineTracker` from scratch — existing Stepper doesn't support `stale`. 4 steps with per-step status
- [x] **4c** Build `ProjectDetailRedirect` — fetch project, redirect to `currentStep` sub-route
- [x] **4d** Build `StaleStepBanner` — shows contextual message from `staleReason`
- [x] **4e** Build inline-editable working title in ProjectHeader
- [x] **4f** Add selector factories: `selectIsStepStale(stepName)`, `selectStepStatus(stepName)`
- [x] **4g** Handle navigation after project deletion — redirect to dashboard

## Phase 5 — Script Step

- [x] **5a** Build Script step page — trigger SSE stream. Note: `:scriptId` param = `topicId`. Uses `?token=` not baseFetch
- [x] **5b** After stream completes, re-fetch project via `getProject(projectId)` — backend already started/linked/completed the step
- [x] **5c** Show script in editor (reuse shared Editor component), allow inline editing via `editScript`
- [x] **5d** Add script feedback (like/dislike), export, regenerate buttons
- [x] **5e** After `regenerateScript`, re-fetch project — backend auto-triggers stale cascade on hooks/packaging

## Phase 6 — Hooks Step

- [x] **6a** Build Hooks step page — 5 hook cards, selection UI
- [x] **6b** If hooks not generated yet, show "Generate hooks" button → `generateHooks({ videoProjectId, script })`
- [x] **6c** Wire `selectHook` — backend auto-completes the step. Re-fetch project after. Navigate to packaging step
- [x] **6d** Wire hooks regenerate, per-hook feedback (indexed by string "0"-"4"), export
- [x] **6e** Build stale banner with "Regenerate" / "Keep as-is" actions
- [x] **6f** Cache hooks batch in Redux — no GET endpoint exists. On revisit, only `hooksId` + `selectedHookIndex` are available from project
- [x] **6g** On page load, hydrate `selectedHookIndex` from `currentProject`
- [x] **6h** After `regenerateHooks`, re-fetch project — backend clears `selectedHookIndex` and triggers packaging stale

## Phase 7 — Packaging Step (Pipeline-Integrated)

- [x] **7a** Build pipeline-integrated Packaging page — pre-load script, load existing packaging via `getPackaging(packagingId)` if available
- [x] **7b** `savePackaging` with `videoProjectId` — backend auto-links + auto-completes. Re-fetch project after save
- [x] **7c** Remove `HooksParagraphCard` from this view
- [x] **7d** Wire per-item regeneration (`regenerateItem`) — requires `packagingId` from prior save. Backend auto-updates `itemStatuses` and auto-clears `isStale`
- [x] **7e** Wire per-item feedback buttons
- [x] **7f** Wire packaging export
- [x] **7g** Build per-item stale indicators from `itemStatuses`, document-level stale from `isStale`/`staleReason`
- [x] **7h** Pass `selectedHook` text to generation endpoints (`generateTitle`, `generateDescription`, `generateThumbnail`, `regenerateItem`)
- [x] **7i** Build completion celebration when `overallStatus === "completed"` (all 4 steps done)

## Phase 8 — Research Intel Panel (non-blocking)

- [x] **8a** Add trending tab, competitors tab, keywords tab to Research page
- [x] **8b** Wire `fetchTrending`, `fetchCompetitors`, `fetchKeywords`

## Phase 9 — Onboarding + Profile

- [x] **9a** Unhide onboarding — fix `user?.brandName` redirect guard, fix `@ts-expect-error`, verify end-to-end with transformation layer
- [x] **9b** Build profile editing page with `updateProfile` thunk, re-enrichment loading state
- [x] **9c** Fix `onboardingService` to singleton export (already correct — verified)

---

## Component Hierarchy Reference

### Dashboard (Phase 2)
```
Dashboard (page)
├── Header — "Dashboard"
├── Greetings (existing)
├── StatsRow / DashboardCard x3 (existing)
└── ProjectListSection
    ├── ProjectListHeader (heading + status filter tabs + "Start new video" → /app/research)
    ├── ProjectList (loading skeleton / error / empty state / cards)
    │   └── ProjectCard x N (workingTitle, StepBadge, StatusBadge, thumbnailHint, timestamp, delete)
    └── LoadMoreButton (pagination via cursor)
```

### Research (Phase 3)
```
ResearchPage (page)
├── Header — "Research"
├── TopicGenerationSection
│   ├── GenerateTopicsButton
│   ├── TopicGrid (skeleton / empty / cards, filters out archived)
│   │   └── TopicCard x N (title, "Use this topic", regenerate with warning, FeedbackButtons, isScriptGenerated badge, videoProjectId link indicator)
│   └── RegenerateAllButton (warns about stale cascade on active projects)
└── ResearchIntelPanel (Phase 8)
```

### Pipeline Layout (Phase 4)
```
ProjectPipelineLayout (nested layout with <Outlet />)
├── ProjectHeader (inline-editable workingTitle, OverallStatusBadge, back → dashboard)
└── PipelineTracker (from scratch, NOT existing Stepper)
    ├── Research (auto-completed at project creation)
    ├── Script
    ├── Hooks
    └── Packaging (with items sub-statuses on hover/expand)
```

### Script Step (Phase 5)
```
ProjectScriptPage
├── empty state → GenerateScriptButton (triggers SSE stream with topicId)
├── streaming state → StreamingScriptView (live text via EventSource + ?token=)
├── loaded state → ScriptEditor
│   ├── Editor (shared, existing)
│   └── ScriptActions (regenerate, feedback, export)
└── No explicit "complete" button — backend auto-completes on generation
```

### Hooks Step (Phase 6)
```
ProjectHooksPage
├── StaleStepBanner (if stale — staleReason context)
├── empty state → GenerateHooksButton
├── HooksList
│   └── HookCard x5 (hook text, "Select" button, FeedbackButtons, selected indicator from project.selectedHookIndex)
├── HooksActions (regenerate all, export)
└── No explicit "complete" button — selectHook auto-completes
```

### Packaging Step (Phase 7)
```
ProjectPackagingPage
├── StaleStepBanner (if isStale — staleReason)
├── ScriptDisplay (read-only)
├── TitlesCard (with feedback + regenerateItem + selectedHook context)
├── OutputCard (description, with feedback + regenerateItem + selectedHook context)
├── ThumbnailsCard (with feedback + regenerateItem + selectedHook context)
├── ShortsScriptCard (with feedback + regenerateItem)
├── Per-item stale indicators (from itemStatuses)
├── "Save" → savePackaging(videoProjectId) — auto-completes step
└── Completion celebration (when overallStatus === "completed")
```

---

## Route Structure

```
/app/dashboard                           → Dashboard (project list)
/app/research                            → ResearchPage (topic generation + intel)
/app/project/:projectId                  → ProjectPipelineLayout
  ├── index                              → ProjectDetailRedirect (→ active step)
  ├── script                             → ProjectScriptPage
  ├── hooks                              → ProjectHooksPage
  └── packaging                          → ProjectPackagingPage
/app/packaging                           → PackagingPage (standalone, keep for now)
```

---

## New Files To Create

### Phase 2
- `src/components/dashboard/ProjectCard.tsx`
- `src/components/dashboard/ProjectList.tsx`
- `src/components/dashboard/ProjectCardSkeleton.tsx`
- `src/components/dashboard/StatusFilterTabs.tsx`

### Phase 3
- `src/pages/Research/index.tsx`
- `src/components/research/TopicCard.tsx`
- `src/components/research/TopicGrid.tsx`
- `src/components/research/TopicCardSkeleton.tsx`
- `src/components/research/FeedbackButtons.tsx`
- `src/components/research/index.ts`

### Phase 4
- `src/components/project/ProjectPipelineLayout.tsx`
- `src/components/project/PipelineTracker.tsx`
- `src/components/project/ProjectDetailRedirect.tsx`
- `src/components/project/StaleStepBanner.tsx`
- `src/components/project/ProjectHeader.tsx`
- `src/components/project/index.ts`

### Phase 5
- `src/pages/ProjectScript/index.tsx`

### Phase 6
- `src/pages/ProjectHooks/index.tsx`
- `src/components/hooks/HookCard.tsx`
- `src/components/hooks/HooksList.tsx`
- `src/components/hooks/index.ts`

### Phase 7
- `src/pages/ProjectPackaging/index.tsx`

## Files To Modify

- `src/constants/route.tsx` — add new routes, remove dead imports (Phase 2)
- `src/constants/navigate.ts` — update sidebar nav (Phase 2)
- `src/pages/Dashboard/index.tsx` — rewrite for project list (Phase 2)
- `src/utils/feature/titles/titles.thunk.ts` — add missing thunks (Phase 1)
- `src/utils/feature/titles/titles.slice.ts` — add extraReducers (Phase 1)
- `src/utils/feature/scripts/script.thunk.ts` — add missing thunks (Phase 1)
- `src/utils/feature/scripts/script.slice.ts` — add error/loading state + extraReducers for new thunks (Phase 1)
- `src/utils/feature/packaging/packaging.thunk.ts` — add missing thunks (Phase 1)
- `src/utils/feature/packaging/packaging.slice.ts` — add extraReducers + feedback state (Phase 1)
- `src/utils/feature/videoProject/videoProject.slice.ts` — add selector factories + fix rejected handlers (Phase 4)
- `src/types/feature/packaging.ts` — add stale fields, PackagingItemStatus, tighten types (Phase 1)
- `src/types/feature/videoProject.ts` — tighten IPipelineStep.items (Phase 1)
- `src/service/titles.ts` — add missing fields to TopicsListResponse (Phase 1)
- `src/service/onboarding.ts` — fix to singleton export (Phase 9)
