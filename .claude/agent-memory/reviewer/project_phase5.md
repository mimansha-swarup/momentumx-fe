---
name: Phase 5 Script Step Audit
description: Audit findings for Phase 5 — service, useScriptStream hook, thunk, slice, ProjectScript, ScriptDetails (reviewed 2026-04-05)
type: project
---

Phase 5 reviewed 2026-04-05. Build passes clean; lint has 0 errors (14 warnings, 3 are in ScriptDetails).

**Why:** Phase 5 adds the ProjectScript page and useScriptStream hook for the pipeline script step.

**Critical findings:**
- `ScriptDetails/index.tsx:81` — calls `scriptService.getScriptById()` directly in component, bypassing thunk layer. Errors silently swallowed.
- `ScriptDetails/index.tsx:95` — calls `scriptService.startStreamingScripts()` directly with a no-op error handler. Second architecture violation.
- `useScriptStream.tsx:91-95` — `mountedRef.current` check is placed AFTER `dispatch(getProject)` and `dispatch(getScriptById)` inside the setTimeout callback. State updates on unmounted components remain possible.
- `ProjectScript/index.tsx:86` — `startStreaming` (useCallback) is a `useEffect` dep. If `scriptId`/`projectId` change, effect re-fires and calls `startStreaming` again. The `isStreamingRef` guard only blocks duplicate streams for the same values, not re-fires from new values that arrive while streaming.
- Export result is stored in Redux but `ProjectScript` never reads `selectScriptsExportResult` or triggers a download — exported data is discarded.

**Warning findings:**
- `ScriptDetails/index.tsx:57` — invalid dep array expression `titleRecord || titleFromUrl`, missing `titleRecord?.title` and `titleFromUrl`. ESLint flags this.
- `ScriptDetails/index.tsx:103` — missing `dispatch`, `hash`, `navigate`, `scriptRecord` from dep array. ESLint flags this. Stale closure risk.
- `ScriptDetails/index.tsx:49` — `isUpdating` local state duplicates `isEditing` in the scripts slice. Two sources of truth.
- `handleKeepAsIs` (`completeStep`) does not re-fetch project state after the step transition.
- `StaleStepBanner` receives hardcoded `staleReason="script_regenerated"` — semantically wrong for the script step.

**How to apply:** Future pipeline step page reviews should flag: (1) direct service calls from components, (2) mountedRef guard placement before async dispatches in timeouts, (3) post-transition project re-fetch, (4) export result surfacing, (5) staleReason semantic correctness.
