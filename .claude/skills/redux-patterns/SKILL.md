---
name: redux-patterns
description: Reference for Redux Toolkit patterns in MomentumX — slice structure, createAsyncThunk, selectors, and store configuration. Auto-invoke when working with Redux slices, thunks, or store config.
user-invocable: false
---

# Redux Patterns Reference

## Store Configuration

7 feature slices registered in the store:

```typescript
// src/utils/store/index.ts
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import userReducer from '../feature/user/user.slice';
import titlesReducer from '../feature/titles/titles.slice';
import scriptsReducer from '../feature/scripts/script.slice';
import packagingReducer from '../feature/packaging/packaging.slice';
import videoProjectReducer from '../feature/videoProject/videoProject.slice';
import hooksReducer from '../feature/hooks/hooks.slice';
import researchReducer from '../feature/research/research.slice';

const middlewares: Middleware[] = [];
if (['dev', 'local'].includes(import.meta.env.VITE_ENV || 'production')) {
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    titles: titlesReducer,
    scripts: scriptsReducer,
    packaging: packagingReducer,
    videoProject: videoProjectReducer,
    hooks: hooksReducer,
    research: researchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Redux logger is only active in dev/local. Produces no output in production.

## Redux State Shapes

### User State
```typescript
interface IUserInitialState {
  data: IUser | null;
  isLoading: boolean;
}
```

### Titles State
```typescript
interface ITitleState {
  data: ITitleData | null;
  params: { filter: TitleFilters; searchText: string };
  isLoading: boolean;
  isDone: boolean;
}
```

### Scripts State
```typescript
interface IScriptState {
  data: IScript[] | null;
  isLoading: boolean;
  isDone: boolean;
}
```

### Packaging State
```typescript
interface IPackagingState {
  script: string;
  titles: { titles: ITitle[]; selectedIndex: number; isLoading: boolean; error: string | null };
  description: { content: string; isLoading: boolean; error: string | null };
  thumbnails: { descriptions: string[]; selectedIndex: number; isLoading: boolean; error: string | null };
  hooks: { hooks: string[]; isLoading: boolean; error: string | null };
  shortsScript: { scripts: IShortsScript[]; isAddingNew: boolean };
  isSaving: boolean;
  packagingId: string | null;
  isGeneratingAll: boolean;
}
```

### Video Project State
```typescript
interface IVideoProjectState {
  projects: IVideoProjectListItem[];
  hasMore: boolean;
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
  currentProject: IVideoProject | null;
  isLoadingProject: boolean;
  projectError: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isStepTransitioning: boolean;
}
```

### Hooks State
```typescript
interface IHooksState {
  batch: IHooksBatch | null;
  selectedHookIndex: number | null;
  isLoading: boolean;
  isRegenerating: boolean;
  isSelecting: boolean;
  isExporting: boolean;
  isSubmittingFeedback: boolean;
  error: string | null;
}
```

### Research State
```typescript
interface IResearchState {
  trending: { videos: ITrendingVideo[]; isLoading: boolean; error: string | null };
  competitors: { channels: ICompetitorChannel[]; isLoading: boolean; error: string | null };
  keywords: { results: IKeywordResult[]; isLoading: boolean; error: string | null };
}
```

## Thunk Patterns

### Standard thunk with error handling
Always use `thunkAPI.rejectWithValue(error)` on catch — never let errors go silent.

```typescript
// src/utils/feature/research/research.thunk.ts
export const fetchTrending = createAsyncThunk(
  'research/fetchTrending',
  async (_, thunkAPI) => {
    try {
      const response = await researchService.getTrending();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
```

### Thunk with string parameter
```typescript
// src/utils/feature/research/research.thunk.ts
export const fetchKeywords = createAsyncThunk(
  'research/fetchKeywords',
  async (query: string, thunkAPI) => {
    try {
      const response = await researchService.getKeywords(query);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
```

### Thunk with object parameter and `handleToast`
Thunks that modify state should toast the result using `handleToast()` from `@/utils/toast`:

```typescript
// src/utils/feature/videoProject/videoProject.thunk.ts
export const createProject = createAsyncThunk(
  'videoProject/create',
  async (topicId: string, thunkAPI) => {
    try {
      const response = await videoProjectService.createProject(topicId);
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
```

### Thunk with state access (`getState`)
Access current state via `thunkAPI.getState()` for dependent data:

```typescript
// src/utils/feature/packaging/packaging.thunk.ts
export const generateDescription = createAsyncThunk(
  'packaging/generateDescription',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const { script, titles } = state.packaging;
      const selectedTitle = titles.titles[titles.selectedIndex]?.title ?? '';
      const response = await packagingService.generateDescription(script, selectedTitle);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
```

### Thunk with partial state update (IStepTransitionResponse pattern)
For step transitions, return only changed fields and deep-merge them in the reducer:

```typescript
// src/utils/feature/videoProject/videoProject.thunk.ts
export const startStep = createAsyncThunk(
  'videoProject/startStep',
  async ({ projectId, stepName }: { projectId: string; stepName: StepName }, thunkAPI) => {
    try {
      const response = await videoProjectService.startStep(projectId, stepName);
      handleToast({ message: response.message ?? '', warning: response.warning ?? '' });
      return response.data; // Returns IStepTransitionResponse with partial pipeline
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

// In reducer's extraReducers:
.addCase(startStep.fulfilled, (state, action) => {
  if (state.currentProject && action.payload) {
    state.currentProject.currentStep = action.payload.currentStep;
    // Deep merge: only update pipeline steps that came back from API
    for (const [stepName, stepData] of Object.entries(action.payload.pipeline)) {
      if (stepData) {
        state.currentProject.pipeline[stepName as StepName] = stepData;
      }
    }
  }
});
```

### Pagination append-vs-replace pattern
When fetching lists with cursor, append if cursor exists, replace on fresh fetch:

```typescript
// src/utils/feature/videoProject/videoProject.slice.ts
.addCase(listProjects.fulfilled, (state, action) => {
  state.isLoading = false;
  if (action.payload?.data) {
    const hasCursor = !!action.payload.params?.cursor;
    if (hasCursor) {
      // Append (pagination)
      state.projects = [...state.projects, ...action.payload.data.projects];
    } else {
      // Replace (fresh fetch)
      state.projects = action.payload.data.projects;
    }
    state.hasMore = action.payload.data.hasMore;
    state.nextCursor = action.payload.data.nextCursor;
  }
});
```

## Selector Patterns

### Simple selectors
Exported alongside slice actions. Follow naming: `select{FeatureName}`:

```typescript
// src/utils/feature/videoProject/videoProject.slice.ts
export const selectProjects = (state: RootState) => state.videoProject.projects;
export const selectProjectsLoading = (state: RootState) => state.videoProject.isLoading;
export const selectCurrentProject = (state: RootState) => state.videoProject.currentProject;
export const selectIsCreating = (state: RootState) => state.videoProject.isCreating;
```

### Computed selectors
```typescript
// src/utils/feature/packaging/packaging.slice.ts
export const selectCanAddMoreShorts = (state: RootState) =>
  state.packaging.shortsScript.scripts.length < MAX_SHORTS_SCRIPTS;

export const selectHasContent = (state: RootState) =>
  state.packaging.titles.titles.length > 0 ||
  !!state.packaging.description.content ||
  state.packaging.thumbnails.descriptions.length > 0 ||
  state.packaging.hooks.hooks.length > 0 ||
  state.packaging.shortsScript.scripts.length > 0;
```

### Nested feature selectors
For complex nested state, export root selector plus computed child selectors:

```typescript
// src/utils/feature/packaging/packaging.slice.ts
export const selectPackaging = (state: RootState) => state.packaging;
export const selectTitles = (state: RootState) => state.packaging.titles;
export const selectDescription = (state: RootState) => state.packaging.description;
export const selectHooks = (state: RootState) => state.packaging.hooks;
export const selectShortsScripts = (state: RootState) => state.packaging.shortsScript;
```

## Slice Structure

Standard anatomy of a slice:

```typescript
// src/utils/feature/{feature}/{feature}.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/utils/store';
import { thunkName } from './{feature}.thunk';
import { IFeatureState } from '@/types/feature/{feature}';

const initialState: IFeatureState = { /* ... */ };

const featureSlice = createSlice({
  name: 'featureName',
  initialState,
  reducers: {
    // Synchronous actions (user interactions, UI state)
    setProperty: (state, action: PayloadAction<Type>) => {
      state.property = action.payload;
    },
    clearState: () => initialState,
  },
  extraReducers: (builder) => {
    // Async thunk handlers
    builder
      .addCase(thunkName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(thunkName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload ?? null;
      })
      .addCase(thunkName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions (from reducers only)
export const { setProperty, clearState } = featureSlice.actions;

// Export selectors
export const selectFeature = (state: RootState) => state.featureName;
export const selectFeatureData = (state: RootState) => state.featureName.data;

// Export reducer as default
export default featureSlice.reducer;
```

Key points:
- `initialState` must match Redux state interface
- `reducers` are for synchronous, user-triggered actions
- `extraReducers` handle async thunk lifecycle (`pending`, `fulfilled`, `rejected`)
- Always export selectors alongside actions
- Use `thunkAPI.rejectWithValue()` in thunks — this passes the error to `rejected` case

## Typed Hooks

```typescript
// src/hooks/useRedux.ts (React Redux 9+ withTypes API)
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/utils/store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Always use these in components. Never use raw `useDispatch` / `useSelector`.

## Component Usage Pattern

```typescript
// In a component
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { selectFeatureData, selectLoading } from '@/utils/feature/{feature}/{feature}.slice';
import { someThunk } from '@/utils/feature/{feature}/{feature}.thunk';

const MyComponent = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectFeatureData);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(someThunk(params));
  }, [dispatch]);

  if (loading) return <Loader />;
  return <div>{/* render data */}</div>;
};
```
