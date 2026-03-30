# MomentumX Frontend

AI-powered YouTube creator workflow tool. React 19 + TypeScript + Vite + Redux Toolkit + Tailwind CSS 4.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # TypeScript + Vite build (use to check for errors)
npm run lint       # ESLint
npm run typecheck  # TypeScript type checking (no emit)
npm run format     # Prettier
```

## Architecture

```
Service → Thunk → Slice → Component
```

- **Services** (`src/service/`) — API calls via `baseFetch` (Axios + Firebase token)
- **Thunks** (`src/utils/feature/{feature}/{feature}.thunk.ts`) — `createAsyncThunk` wrappers
- **Slices** (`src/utils/feature/{feature}/{feature}.slice.ts`) — Redux state + reducers + selectors
- **Components** (`src/components/{feature}/`) — React UI, consumes state via `useAppSelector`
- **Pages** (`src/pages/{Feature}/index.tsx`) — Route-level containers, thin orchestrators

## Key Files

- `src/utils/network.ts` — Axios instance with Firebase auth interceptor
- `src/utils/store/index.ts` — Redux store (register new reducers here)
- `src/constants/route.tsx` — React Router config (add routes here)
- `src/index.css` — CSS variables, theme, custom animations
- `src/lib/utils.ts` — `cn()` for Tailwind class merging
- `src/service/` — Service classes (user, titles, scripts, packaging, videoProject, hooks, research)
- `src/utils/feature/{feature}/` — Feature Redux (slice, thunk) and service integration

## Path Alias

`@/` → `src/`. Always use `@/` imports, never deep relative paths.

## Current State

**Redux Slices** — 7 registered:
- `user` — authentication + profile
- `titles` — legacy topic generation (uses `/v1/content/` routes)
- `scripts` — script generation + streaming (legacy `/v1/content/` routes)
- `packaging` — title/description/thumbnail/hooks/shorts generation
- `videoProject` — video project CRUD, pipeline step transitions, stale cascade
- `hooks` — hook generation and selection
- `research` — research data (trending, competitors, keywords)

**Service Layer** — 7 fully built and aligned with backend:
- All services use `baseFetch` with Firebase token interceptor
- All responses typed via `IBaseFetchResponse<T>`
- Errors propagated to thunks via `rejectWithValue`

**Key Architecture Decisions:**
- `onboardingService` has a transformation layer mapping nested `IOnboardingPayload` → flat 8-field backend shape
- Titles/Scripts services now use `/v1/topics/` and `/v1/scripts/` routes (migrated from legacy `/v1/content/`)
- VideoProject service uses `IStepTransitionResponse` for partial pipeline updates from `startStep`/`completeStep`
- Backend auto-handles step progression: script generation auto-starts/links/completes, `selectHook` auto-completes hooks, `savePackaging` auto-links/completes packaging. Frontend must NOT duplicate these calls — just trigger and re-fetch project state.

**Frontend Pages**:
- Standalone Packaging page fully implemented
- Legacy pages (Onboarding, Title, Scripts, Profile, ScriptDetails) hidden behind `HIDE_OLD_FLOW`
- Dashboard page exists but needs Video Project integration

**Implementation Plan**: See `IMPLEMENTATION-PLAN.md` at project root for the full 9-phase, 40-task plan covering:
- Phase 1: Missing thunks + type fixes
- Phase 2: Dashboard + routes
- Phase 3: Research page
- Phase 4: Pipeline layout + PipelineTracker
- Phase 5: Script step
- Phase 6: Hooks step
- Phase 7: Packaging step (pipeline-integrated)
- Phase 8: Research intel panel
- Phase 9: Onboarding + profile

Related docs:
- Implementation plan: `/IMPLEMENTATION-PLAN.md` (tracks progress with checkboxes)
- Backend product overview: `/Users/jatin/Documents/Projects/Momentum-X/momentumx-be/docs/product/overview.md`
- Backend pipeline spec: `/Users/jatin/Documents/Projects/Momentum-X/momentumx-be/docs/product/pipeline-spec.md`

## Conventions

- TypeScript strict — no `any`, typed props, typed Redux state
- Tailwind only — no inline styles, use `cn()` for conditional classes
- Mobile-first responsive (`md:`, `lg:` breakpoints)
- Dark glass-morphism design language (see CSS variables in `index.css`)
- Conventional Commits — no Co-Authored-By or AI attribution footers
- `useAppDispatch` / `useAppSelector` — never raw Redux hooks

## Agents Team

See `.claude/agents/` for specialized agents:
- **developer** — core implementation (components, Redux, services)
- **ui-engineer** — design system, Tailwind, shadcn, animations
- **reviewer** — read-only code quality review
- **product-designer** — user flows, state shape, task breakdown
- **doc-writer** — documentation maintenance
