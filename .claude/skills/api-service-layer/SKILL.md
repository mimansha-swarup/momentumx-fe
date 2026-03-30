---
name: api-service-layer
description: Reference for the Axios-based service layer in MomentumX — baseFetch setup, service structure, response types, and auth token injection. Auto-invoke when creating or modifying API services or thunks.
user-invocable: false
---

# API Service Layer Reference

## Axios Instance — `baseFetch`

```typescript
// src/utils/network.ts
import axios from 'axios';
import { getAuth } from 'firebase/auth';

export interface IBaseFetchResponse<T> {
  message?: string;
  warning?: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
  data?: T;
}

// Note: `data` is optional — always check for its existence before accessing.

export const getApiDomain = (isLongResponse = false): string => {
  // Currently hardcoded to http://localhost:3000 during dev
  // In production, switches between:
  //   - Standard requests: https://momentumx-be.vercel.app
  //   - SSE/long responses: https://momentumx-be.onrender.com
  // Controlled by VITE_ENV env var (dev/local default)
};

export const baseFetch = axios.create({
  baseURL: getApiDomain(),
});

// Request interceptor — injects Firebase JWT token
// Runs on every outbound request. Token obtained from Firebase SDK.
// Authorization header is: Bearer <firebase_jwt>
baseFetch.interceptors.request.use(
  async (config) => {
    const user = getAuth().currentUser;
    const token = await user?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { baseFetch };
```

**Key notes:**
- All services use `baseFetch` to make requests — never call `axios` directly
- Firebase token is injected by the interceptor — do not pass tokens manually
- For SSE endpoints (script streaming), token is passed as `?token=` query param instead because EventSource API does not support custom headers. See `scriptService.startStreamingScripts()`.

## Existing Services

All services are **classes** exported as singleton instances. URL paths defined in `URLS` constant at the top of each file.

### onboardingService (`src/service/onboarding.ts`)

Handles user profile setup and enrichment (YouTube metadata, competitor data, website scraping).

```typescript
// Transforms frontend form shape to API payload, handles toast notifications inline
export class onboardingService {
  private transformPayload(payload: IOnboardingPayload): IOnboardingApiPayload
  // Converts form data → API shape (e.g., business.type → niche field)

  async getUserRecord(): Promise<IBaseFetchResponse<{...}>>
  // GET /v1/user/profile — returns full user document or {} if not onboarded

  async saveOnboardingData(payload: IOnboardingPayload): Promise<any>
  // PATCH /v1/user/onboarding — saves transformed payload, triggers enrichment

  async updateProfile(payload: IOnboardingPayload): Promise<any>
  // PATCH /v1/user/profile — updates + re-runs enrichment (YouTube, competitors, website)
}
```

**Note:** This service calls `handleToast()` directly, mixing concerns. This pattern is not repeated in newer services — error handling should move to thunks with `rejectWithValue()`.

### titleService (`src/service/titles.ts`)

Manages topics (renamed from "titles" in backend parlance). Uses current `/v1/topics` endpoints.

```typescript
export const titleService = new TitleService();

async generateTitles(): Promise<IBaseFetchResponse<{ titles: ... }>>
// POST /v1/topics/generate — generates 10 topic ideas, saves to Firestore

async getGeneratedData(query?: TopicsListParams): Promise<IBaseFetchResponse<TopicsListResponse>>
// GET /v1/topics?limit=&createdAt=&docId=&searchText=&isScriptGenerated=
// Paginated topic list with cursor-based navigation

async editTitle(titleId: string, body: Record<string, unknown>): Promise<any>
// PATCH /v1/topics/edit/:topicId — edit topic title text

async regenerateAll(): Promise<IBaseFetchResponse<unknown[]>>
// POST /v1/topics/regenerate-all — archive batch, generate 10 new, trigger stale cascade

async regenerateOne(topicId: string): Promise<IBaseFetchResponse<unknown>>
// POST /v1/topics/:topicId/regenerate — regenerate single topic in-place

async submitFeedback(topicId: string, feedback: "like" | "dislike" | null): Promise<...>
// PATCH /v1/topics/:topicId/feedback — record like/dislike signal

async exportTopics(): Promise<IBaseFetchResponse<{ text: string; count: number }>>
// GET /v1/topics/export — export active batch as plain-text list
```

### scriptService (`src/service/script.ts`)

Manages script generation and editing. Uses `/v1/scripts` endpoints.

```typescript
export const scriptService = new ScriptService();

async startStreamingScripts(id: string, setter: (prev: string) => void, onDone: () => void): EventSource
// GET /v1/scripts/stream/:scriptId?token=<jwt>
// SSE stream. Token passed as query param (EventSource API limitation).
// Setter called on each chunk, onDone() called on "done" event.
// Returns EventSource for optional manual closure.

async getGeneratedScript(): Promise<any>
// GET /v1/scripts — list all scripts for authenticated user

async getScriptById(id: string): Promise<any>
// GET /v1/scripts/:scriptId — get single script document

async editScript(id: string, data: { script: string }): Promise<any>
// PATCH /v1/scripts/edit/:scriptId — update script text (manual edit)

async submitFeedback(scriptId: string, feedback: "like" | "dislike" | null): Promise<IBaseFetchResponse<{ id: string; userFeedback: ... }>>
// PATCH /v1/scripts/:scriptId/feedback — record feedback

async exportScript(scriptId: string): Promise<IBaseFetchResponse<{ title: string; text: string }>>
// GET /v1/scripts/:scriptId/export — export script as plain-text

async regenerateScript(scriptId: string): Promise<IBaseFetchResponse<{ id: string; title: string; script: string }>>
// POST /v1/scripts/:scriptId/regenerate — non-SSE regeneration
// Side effect: marks downstream hooks + packaging stale if linked to a video project
```

### packagingService (`src/service/packaging.ts`)

Generates and manages packaging (titles, descriptions, thumbnails, shorts scripts). All endpoints stateless except save/list/get.

```typescript
export const packagingService = new PackagingService();

async generateTitle(script: string): Promise<IBaseFetchResponse<GenerateTitleResponse>>
// POST /v1/packaging/generate-title — returns 3 title variations

async generateDescription(script: string, title: string): Promise<IBaseFetchResponse<GenerateDescriptionResponse>>
// POST /v1/packaging/generate-description — SEO description using title as context

async generateThumbnail(script: string, title: string): Promise<IBaseFetchResponse<GenerateThumbnailResponse>>
// POST /v1/packaging/generate-thumbnail — 3 thumbnail design briefs

/**
 * @deprecated Use hooksService.generateHooks() for video project flows.
 * This stateless endpoint will be removed when packaging is integrated into the pipeline.
 */
async generateHooks(script: string): Promise<IBaseFetchResponse<GenerateHooksResponse>>
// POST /v1/packaging/generate-hooks — 5 hooks (legacy, stateless)

async generateShorts(script: string, duration: number = 60): Promise<IBaseFetchResponse<GenerateShortsResponse>>
// POST /v1/packaging/generate-shorts — shorts script with timestamped segments

async generateTitleDependentContent(script: string, duration: number = 60): Promise<{
  title: GenerateTitleResponse;
  description: GenerateDescriptionResponse;
  thumbnail: GenerateThumbnailResponse;
  shorts: GenerateShortsResponse;
}>
// Orchestration method: generate title first, then parallelize description + thumbnail + shorts

async savePackaging(data: { videoProjectId?: string; script: string; titles: ...; ... }): Promise<IBaseFetchResponse<SavePackagingResponse>>
// POST /v1/packaging/save — persist packaging document, optionally link to video project (upsert)

async listPackaging(): Promise<IBaseFetchResponse<GetPackagingResponse[]>>
// GET /v1/packaging/list — list all packaging documents for user

async getPackaging(packagingId: string): Promise<IBaseFetchResponse<GetPackagingResponse>>
// GET /v1/packaging/:packagingId — fetch single packaging document

async regenerateItem(packagingId: string, item: "title" | "description" | "thumbnail" | "shorts", data: {...}): Promise<IBaseFetchResponse<{ id: string; item: string; data: unknown }>>
// POST /v1/packaging/:packagingId/regenerate/:item — regenerate one item in-place

async submitFeedback(packagingId: string, item: "title" | "description" | "thumbnail" | "shorts", feedback: "like" | "dislike" | null): Promise<...>
// PATCH /v1/packaging/:packagingId/feedback — record per-item feedback

async exportPackaging(packagingId: string): Promise<IBaseFetchResponse<{ text: string }>>
// GET /v1/packaging/:packagingId/export — export as plain-text
```

### videoProjectService (`src/service/videoProject.ts`)

Manages video project lifecycle (creation, step progression, resource linking). Central to the pipeline workflow.

```typescript
export const videoProjectService = new VideoProjectService();

async createProject(topicId: string): Promise<IBaseFetchResponse<IVideoProject>>
// POST /v1/video-projects — create from selected topic, init all steps to not_started

async listProjects(params?: ListProjectsParams): Promise<IBaseFetchResponse<ListProjectsResponse>>
// GET /v1/video-projects?status=&limit=&cursor= — paginated project list (dashboard)

async getProject(projectId: string): Promise<IBaseFetchResponse<IVideoProject>>
// GET /v1/video-projects/:projectId — full project with complete pipeline state

async updateWorkingTitle(projectId: string, workingTitle: string): Promise<IBaseFetchResponse<Partial<IVideoProjectListItem>>>
// PATCH /v1/video-projects/:projectId — update working title only

async deleteProject(projectId: string): Promise<IBaseFetchResponse<{ id: string; isDeleted: boolean; deletedAt: string }>>
// DELETE /v1/video-projects/:projectId — soft delete (linked docs not deleted)

async startStep(projectId: string, stepName: string): Promise<IBaseFetchResponse<IStepTransitionResponse>>
// PATCH /v1/video-projects/:projectId/step/:stepName/start — mark step in_progress
// Valid stepName: "script", "hooks", "packaging" (not "research")

async completeStep(projectId: string, stepName: string): Promise<IBaseFetchResponse<IStepTransitionResponse>>
// PATCH /v1/video-projects/:projectId/step/:stepName/complete — mark step completed
// If all steps completed, sets overallStatus = "completed"

async linkResource(projectId: string, resourceType: "script" | "hooks" | "packaging", resourceId: string): Promise<IBaseFetchResponse<Partial<IVideoProject>>>
// PATCH /v1/video-projects/:projectId/link/:resourceType — save resource ID to project
// Called after script/hooks/packaging is generated/saved
```

### hooksService (`src/service/hooks.ts`)

Manages hook generation tied to video projects. Replaces the deprecated `POST /v1/packaging/generate-hooks` for pipeline flows.

```typescript
export const hooksService = new HooksService();

async generateHooks(videoProjectId: string, script: string): Promise<IBaseFetchResponse<IHooksBatch>>
// POST /v1/hooks/generate — generates 5 hooks, saves batch, links to project

async selectHook(hooksId: string, hookIndex: number, videoProjectId: string): Promise<IBaseFetchResponse<SelectHookResponse>>
// POST /v1/hooks/:hooksId/select — record selected hook index on project

async regenerateHooks(hooksId: string, script: string): Promise<IBaseFetchResponse<Partial<IHooksBatch>>>
// POST /v1/hooks/:hooksId/regenerate — regenerate hooks in-place
// Side effect: marks downstream packaging stale

async submitFeedback(hooksId: string, hookIndex: number, feedback: "like" | "dislike" | null): Promise<IBaseFetchResponse<HookFeedbackResponse>>
// PATCH /v1/hooks/:hooksId/feedback — record per-hook feedback

async exportHooks(hooksId: string): Promise<IBaseFetchResponse<ExportHooksResponse>>
// GET /v1/hooks/:hooksId/export — export hooks as plain-text
```

### researchService (`src/service/research.ts`)

Provides research intelligence: trending videos, competitor analysis, keyword signals. Read-only, no persistence.

```typescript
export const researchService = new ResearchService();

async getTrending(): Promise<IBaseFetchResponse<ITrendingVideo[]>>
// GET /v1/research/trending — trending videos in user's niche (fresh from YouTube API)

async getCompetitors(): Promise<IBaseFetchResponse<ICompetitorChannel[]>>
// GET /v1/research/competitors — top videos from competitor channels (user profile sourced)

async getKeywords(query: string): Promise<IBaseFetchResponse<IKeywordResult[]>>
// GET /v1/research/keywords?query= — keyword signals for search term
```

## Creating a New Service

Complete working example. Copy this pattern when adding a new service.

```typescript
// src/service/myFeature.ts
import { baseFetch, IBaseFetchResponse } from '@/utils/network';
import { MyFeatureResponse } from '@/types/feature/myFeature';

// 1. Define all URL paths as constants (use {{placeholder}} for path params)
const URLS = {
  create: '/v1/my-feature',
  list: '/v1/my-feature',
  getById: '/v1/my-feature/{id}',
  update: '/v1/my-feature/{id}',
  delete: '/v1/my-feature/{id}',
};

// 2. Create class with private urls
class MyFeatureService {
  private urls = URLS;

  // 3. Type all async methods with IBaseFetchResponse<T>
  async create(data: CreatePayload): Promise<IBaseFetchResponse<MyFeatureResponse>> {
    const response = await baseFetch.post(this.urls.create, data);
    return response.data;
  }

  async list(params?: ListParams): Promise<IBaseFetchResponse<{ items: MyFeatureResponse[] }>> {
    const response = await baseFetch.get(this.urls.list, { params });
    return response.data;
  }

  async getById(id: string): Promise<IBaseFetchResponse<MyFeatureResponse>> {
    const response = await baseFetch.get(this.urls.getById.replace('{id}', id));
    return response.data;
  }

  async update(id: string, data: Partial<MyFeatureResponse>): Promise<IBaseFetchResponse<MyFeatureResponse>> {
    const response = await baseFetch.patch(
      this.urls.update.replace('{id}', id),
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<IBaseFetchResponse<{ id: string; deleted: boolean }>> {
    const response = await baseFetch.delete(this.urls.delete.replace('{id}', id));
    return response.data;
  }
}

// 4. Export as singleton instance
export const myFeatureService = new MyFeatureService();
```

**Key patterns:**
- **No try-catch in services.** Let errors propagate to thunks, where they're caught with `rejectWithValue()`.
- **Always return `response.data`** — the API response is wrapped in `IBaseFetchResponse<T>`.
- **Type everything** — method signatures, payloads, responses. No implicit `any`.
- **No mixing of concerns.** Services do HTTP only; validation and user feedback belong in thunks/components.
- **Path params use curly braces `{}`** in URL constants, replaced with `.replace()` on call (avoid template strings to keep URLs readable).

## Service → Thunk → Component Flow

Services produce errors via promise rejection. Thunks catch these errors and convert them to Redux state:

```typescript
// Thunk catches service errors
const fetchProject = createAsyncThunk(
  'videoProject/fetchProject',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await videoProjectService.getProject(projectId);
      return response.data; // Thunk returns just the data, not wrapped
    } catch (error) {
      return rejectWithValue((error as AxiosError).message);
      // Error message goes to slice.error state
    }
  }
);

// Component reads state and status
export const ProjectDetail = ({ projectId }: Props) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) => state.videoProject.currentProject);
  const loading = useAppSelector((state) => state.videoProject.loading);
  const error = useAppSelector((state) => state.videoProject.error);

  useEffect(() => {
    dispatch(fetchProject(projectId));
  }, [projectId, dispatch]);

  if (loading) return <Spinner />;
  if (error) return <ErrorAlert message={error} />; // from Redux, not console
  return <ProjectView project={project} />;
};
```

## Backend API Endpoints — Complete Reference

All endpoints require `Authorization: Bearer <token>` except where noted.

### User (Onboarding & Profile)
```
PATCH  /v1/user/onboarding           — submit onboarding data, triggers enrichment
GET    /v1/user/profile              — fetch user document
PATCH  /v1/user/profile              — update profile + re-run enrichment
```

### Topics (Research Pipeline Step)
```
POST   /v1/topics/generate           — generate 10 topic ideas (batch)
GET    /v1/topics                    — paginated list with cursor navigation
PATCH  /v1/topics/edit/:topicId      — edit topic title
POST   /v1/topics/regenerate-all     — archive batch + generate 10 new + trigger stale cascade
POST   /v1/topics/:topicId/regenerate — regenerate single topic in-place
PATCH  /v1/topics/:topicId/feedback  — record like/dislike on topic
GET    /v1/topics/export             — export active batch as plain-text
```

### Scripts (Script Generation Pipeline Step)
```
GET    /v1/scripts/stream/:scriptId  — SSE stream script generation (?token=<jwt> query param)
GET    /v1/scripts                   — list all scripts
GET    /v1/scripts/:scriptId         — fetch single script document
PATCH  /v1/scripts/edit/:scriptId    — edit script text (manual)
POST   /v1/scripts/:scriptId/regenerate — regenerate script (non-SSE)
PATCH  /v1/scripts/:scriptId/feedback — record like/dislike
GET    /v1/scripts/:scriptId/export  — export as plain-text
```

### Hooks (Hooks Pipeline Step)
```
POST   /v1/hooks/generate            — generate 5 hooks, tied to video project
POST   /v1/hooks/:hooksId/select     — select a hook index
POST   /v1/hooks/:hooksId/regenerate — regenerate hooks in-place, mark packaging stale
PATCH  /v1/hooks/:hooksId/feedback   — record per-hook feedback
GET    /v1/hooks/:hooksId/export     — export as plain-text
```

### Packaging (Packaging Pipeline Step)
```
POST   /v1/packaging/generate-title       — generate 3 title variations
POST   /v1/packaging/generate-description — generate SEO description
POST   /v1/packaging/generate-thumbnail   — generate 3 thumbnail briefs
POST   /v1/packaging/generate-hooks       — generate 5 hooks (DEPRECATED — use /v1/hooks/generate)
POST   /v1/packaging/generate-shorts      — generate shorts script
POST   /v1/packaging/save                 — save/upsert packaging document
GET    /v1/packaging/list                 — list user's packaging
GET    /v1/packaging/:packagingId         — fetch packaging document
POST   /v1/packaging/:packagingId/regenerate/:item — regenerate item (title|description|thumbnail|shorts)
PATCH  /v1/packaging/:packagingId/feedback — record per-item feedback
GET    /v1/packaging/:packagingId/export  — export as plain-text
```

### Research Intelligence (Sidebar Research Module)
```
GET    /v1/research/trending        — trending YouTube videos in user's niche
GET    /v1/research/competitors     — top videos from competitor channels
GET    /v1/research/keywords        — keyword signals for search query (?query=)
```

### Video Projects (Pipeline State Container)
```
POST   /v1/video-projects                          — create project from topic
GET    /v1/video-projects                          — list projects (dashboard pagination)
GET    /v1/video-projects/:projectId               — fetch full project with pipeline state
PATCH  /v1/video-projects/:projectId               — update working title
DELETE /v1/video-projects/:projectId               — soft delete (fire-and-forget)
PATCH  /v1/video-projects/:projectId/step/:stepName/start    — mark step in_progress
PATCH  /v1/video-projects/:projectId/step/:stepName/complete — mark step completed
PATCH  /v1/video-projects/:projectId/link/:resourceType      — link resource (script|hooks|packaging)
```

## URL Patterns & Path Parameters

| Pattern | Example | Meaning |
|---|---|---|
| `{id}` or `{projectId}` | `/v1/video-projects/{projectId}` | Single path parameter, replaced with `.replace()` |
| `{resourceType}` | `/v1/video-projects/{projectId}/link/{resourceType}` | Enum param: `script`, `hooks`, or `packaging` |
| `{stepName}` | `/v1/video-projects/{projectId}/step/{stepName}/start` | Enum param: `script`, `hooks`, `packaging` |
| `{item}` | `/v1/packaging/{packagingId}/regenerate/{item}` | Enum param: `title`, `description`, `thumbnail`, `shorts` |
| `?query=` | `/v1/research/keywords?query=ai+tools` | Query string parameter |
| `?token=` | `/v1/scripts/stream/{scriptId}?token=<jwt>` | Query-param auth (SSE only) |

## Response Wrapper

All API responses follow this envelope:

```typescript
interface IBaseFetchResponse<T> {
  success?: boolean;
  message?: string;        // e.g., "Generated successfully", "Project created"
  warning?: string;        // e.g., "Website content is not parsed"
  statusCode?: number;
  meta?: Record<string, unknown>; // e.g., { nextCursor, hasNextPage }
  data?: T;               // The actual response payload — may be undefined
}
```

**In services,** always return `response.data`, which gives you the `IBaseFetchResponse<T>` object. The `data` field inside may be `undefined`. Always check before accessing.

```typescript
const response = await videoProjectService.getProject(projectId);
if (response.data) {
  // Use response.data.id, response.data.pipeline, etc.
} else {
  // Handle missing data
}
```

## Error Handling

**Services do not catch errors.** They throw axios errors, which propagate to thunks.

**Thunks catch errors and convert to Redux state:**

```typescript
const fetchProject = createAsyncThunk(
  'videoProject/fetch',
  async (projectId: string, { rejectWithValue }) => {
    try {
      const response = await videoProjectService.getProject(projectId);
      return response.data; // Return just the data, not the wrapper
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      return rejectWithValue(axiosError.message || 'Failed to fetch project');
      // This populates slice.error state
    }
  }
);
```

**Components never call services directly.** They dispatch thunks and read error from Redux state:

```tsx
// Bad — don't do this
const handleClick = async () => {
  try {
    const res = await videoProjectService.getProject(id); // Direct service call
  } catch (e) {
    console.error(e); // Error handling scattered everywhere
  }
};

// Good
const handleClick = () => {
  dispatch(fetchProject(id)); // Dispatch thunk
};

const error = useAppSelector((state) => state.videoProject.error); // Read state
if (error) <ErrorAlert message={error} />;
```

## Known Issues

- `onboardingService` calls `handleToast()` inline — should move error handling to thunks
- No validation on many API endpoints (backend docs note "no server-side validation" for onboarding fields, titles endpoint)
