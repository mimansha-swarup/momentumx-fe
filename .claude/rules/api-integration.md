---
name: api-integration
description: Axios setup, service layer patterns, response handling, and auth token injection for MomentumX frontend API calls.
paths:
  - "src/service/**/*"
  - "src/utils/network*"
  - "src/utils/feature/**/*.thunk*"
---

# API Integration

## Must Follow

- Always use `baseFetch` from `@/utils/network` — never raw `axios` or `fetch()`
- Never hardcode API URLs — use URL constants defined in a `URLS` object at the top of each service file
- Services are classes exported as singleton instances (e.g., `export const videoProjectService = new VideoProjectService()`)
- All service methods must be `async` and return `Promise<IBaseFetchResponse<T>>` — no untyped returns
- One service file per backend resource, in `src/service/`
- Services do NOT catch errors — let them propagate to thunks
- No Redux, no React, no hooks inside service files — pure API wrappers only
- Call `handleToast(res)` in thunks, not in services
- For SSE streaming: use `EventSource` with `?token=` query param auth; always close the source on done or error
- Never call `alert()` or `console.log()` for user feedback — use `toastSuccess()` / `toastError()`

## Response Type

All responses are typed via `IBaseFetchResponse<T>` from `@/utils/network`. The `data` field is optional — check before accessing.

```typescript
export interface IBaseFetchResponse<T> {
  message?: string;
  warning?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
  data?: T;
}
```

## Auth Token Injection

Firebase ID tokens are injected automatically by the `baseFetch` request interceptor in `src/utils/network.ts`. Every outbound request includes:

```
Authorization: Bearer {idToken}
```

Do not manually pass tokens or attach headers in component code. The interceptor is the single source of truth.

## Current Services

| Service | Resource | File |
|---|---|---|
| UserService | Profile, auth data | `src/service/onboarding.ts` |
| TitleService | Topic generation (legacy) | `src/service/titles.ts` |
| ScriptService | Script generation, SSE streaming | `src/service/script.ts` |
| PackagingService | All packaging endpoints | `src/service/packaging.ts` |
| VideoProjectService | Video project CRUD, step transitions | `src/service/videoProject.ts` |
| HooksService | Hook generation, selection | `src/service/hooks.ts` |
| ResearchService | Research data (trending, competitors, keywords) | `src/service/research.ts` |

## Integration Pattern

Error handling flows through the layers:

```
Service (throws) → Thunk (catch, rejectWithValue) → Slice (error state) → Component (display error)
```

Example:

```typescript
// In thunk
try {
  const res = await packagingService.generateTitle(script);
  handleToast(res);
  return res.data;
} catch (error) {
  return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
}
```

## Deprecated Endpoints

Some services contain legacy endpoints that will be replaced when Video Project pipeline is fully integrated:

- `titleService` uses `/v1/content/topics` (legacy) instead of `/v1/topics`
- `scriptService` uses `/v1/content/scripts` (legacy) instead of `/v1/scripts`
- `packagingService.generateHooks()` is deprecated — use `hooksService.generateHooks()` for video projects

> For full service templates and backend endpoint reference, see the `api-service-layer` skill.
