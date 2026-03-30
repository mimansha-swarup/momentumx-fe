---
name: state-management
description: Redux Toolkit conventions for MomentumX — slice structure, thunk patterns, selectors, and what belongs in Redux vs local state.
paths:
  - "src/utils/feature/**/*"
  - "src/utils/store/**/*"
  - "src/hooks/useRedux*"
---

# State Management

## Must Follow

- Always use `useAppDispatch` and `useAppSelector` from `@/hooks/useRedux` — never raw `useDispatch` / `useSelector`
- Components never call services directly — dispatch thunks only
- Every thunk must wrap its call in try/catch and return `rejectWithValue(error)` on failure
- Call `handleToast(res)` in thunks for API responses that carry messages/warnings
- Thunks return `res.data`, not the full response object
- Thunk name format: `'{sliceName}/{actionName}'`
- Every slice state interface must include `loading: boolean` and `error: string | null` alongside data fields
- Use `null` for "not yet fetched" and `[]` for "fetched but empty"
- Selectors are defined in the slice file and exported — never inline in components
- Register every new reducer in `src/utils/store/index.ts`
- Slice files live at `src/utils/feature/{feature}/{feature}.slice.ts`; thunks at `src/utils/feature/{feature}/{feature}.thunk.ts`

## Redux vs Local State

Redux: API data, loading/error states, selected items shared across components, auth state.

Local state: form input values, UI toggles (modal open, dropdown), hover/focus states, draft editing state.

## Current Redux Slices

Registered in `src/utils/store/index.ts`:

| Slice | Purpose | File | Status |
|---|---|---|---|
| `user` | Profile, auth state, onboarding data | `src/utils/feature/user/` | ✅ Built |
| `titles` | Topic generation, batch management | `src/utils/feature/titles/` | ✅ Built (legacy) |
| `scripts` | Script generation, SSE streaming, selection | `src/utils/feature/scripts/` | ✅ Built (legacy) |
| `packaging` | Packaging items (title, description, thumbnail, shorts) | `src/utils/feature/packaging/` | ✅ Built |
| `videoProject` | Video project list, pipeline state, step tracking | `src/utils/feature/videoProject/` | ✅ Built |
| `hooks` | Hook generation, selection, batch management | `src/utils/feature/hooks/` | ✅ Built |
| `research` | Research data (trending, competitors, keywords) | `src/utils/feature/research/` | ✅ Built |

## Data Flow Architecture

```
Service (API call) → Thunk (async logic) → Slice (state update) → Component (consume state)
```

Components:
1. Dispatch thunks on mount via `useAppDispatch()`
2. Read state via `useAppSelector()` with selector functions
3. Thunks manage API calls, error handling, and state mutations
4. Slices define state shape, reducers, and selectors
5. Services are stateless API wrappers — no Redux awareness

Example thunk:

```typescript
export const fetchVideoProjects = createAsyncThunk(
  'videoProject/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const res = await videoProjectService.list();
      handleToast(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch');
    }
  }
);
```

> For full slice templates, thunk patterns, and selector examples, see the `redux-patterns` skill.
