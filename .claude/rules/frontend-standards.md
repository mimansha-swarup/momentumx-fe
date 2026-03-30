---
name: frontend-standards
description: Non-negotiable conventions for MomentumX frontend — component architecture, file naming, TypeScript, and import patterns.
---

# Frontend Standards

## Component Architecture

```
Pages → Components → Shared/UI
```

- **Pages** (`src/pages/{Feature}/index.tsx`) — thin orchestrators, no heavy logic
- **Feature Components** (`src/components/{feature}/`) — receive data via props or Redux hooks
- **Shared Components** (`src/components/shared/`) — reusable across features
- **UI Primitives** (`src/components/ui/`) — shadcn/Radix; modified only by UI Engineer

## File Naming

- Pages: `src/pages/{Feature}/index.tsx` — PascalCase folder, `index.tsx` entry
- Components: `src/components/{feature}/ComponentName.tsx` — PascalCase file
- Barrel exports: `src/components/{feature}/index.ts`
- Hooks: `src/hooks/useSomething.tsx` — camelCase with `use` prefix
- Services: `src/service/featureName.ts` — camelCase, class-based exported as singleton
- Feature Redux modules: `src/utils/feature/{feature}/{feature}.slice.ts`, `{feature}.thunk.ts` — one file per layer
- Types: `src/types/feature/featureName.ts` — camelCase, organized by feature

## Import Alias — Always `@/`

`@/` maps to `src/`. Always use it. Never use relative paths crossing directories (e.g., `../../../hooks/useRedux`).

## TypeScript — Always

- No `any` type and no `as any` assertions — find the correct type
- Props must have explicit interfaces
- Redux state must be typed
- Event handlers typed (`React.ChangeEvent<HTMLInputElement>`, not `any`)
- Service responses typed via `IBaseFetchResponse<T>`

## Export Patterns

- Named exports for components: `export const MyComponent: React.FC<Props> = ...`
- Default exports for pages: `export default PageComponent`
- Barrel exports in `index.ts` per feature component directory (named exports)
- Services exported as singleton instances: `export const featureService = new FeatureService()`
- Redux slices use default export: `export default {reducer from createSlice}`
- Redux thunks exported as named exports: `export const fetchData = createAsyncThunk(...)`

## Data Flow — Non-Negotiable

```
Service → Thunk → Slice → Component
```

- Components never call services directly and never import `baseFetch`
- Components dispatch thunks via `useAppDispatch()`
- Components read state via `useAppSelector()`
- Thunks handle errors with `rejectWithValue` — no silent failures
- Services always return `IBaseFetchResponse<T>` where `T` is the typed response shape
- Thunks use `handleToast()` to surface messages and warnings from the API response
- Partial response types (e.g., `IStepTransitionResponse`) are used when endpoints return only a subset of the full object

## Error Handling & API Responses

### Service Layer

Services call `baseFetch` (Axios wrapper) and return typed responses:

```typescript
// Service method
async generateTitles(script: string): Promise<IBaseFetchResponse<{ titles: string[] }>> {
  const response = await baseFetch.post('/v1/topics/generate', { script });
  return response.data;  // Already typed by backend
}
```

All responses have this shape:
```typescript
interface IBaseFetchResponse<T> {
  message?: string;     // User-facing success message
  warning?: string;     // Non-blocking warning
  statusCode?: number;  // HTTP status
  data?: T;             // Actual response payload (may be undefined)
}
```

Always check for `data` existence before accessing it.

### Thunk Error Handling

Thunks use `rejectWithValue()` to propagate errors to the Redux slice:

```typescript
export const fetchData = createAsyncThunk(
  'feature/fetch',
  async (arg, thunkAPI) => {
    try {
      const response = await featureService.getData();
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
```

Slices handle `rejected` actions to set error state:
```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchData.pending, (state) => { state.loading = true; })
    .addCase(fetchData.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    })
    .addCase(fetchData.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as AxiosError)?.message ?? 'Unknown error';
    });
};
```

### User Feedback

- `handleToast()` — Call in thunk after API success to surface `message` or `warning` from backend
- `toastError()` — For component-level error handling (rare)
- Redux error state — Always render error UI in components via `useAppSelector`

## No Console.log in Production

Remove all `console.log` before committing. No `console.log` in any code path (production or development). Use Redux error state or `handleToast()` instead.
