---
name: routing-and-layout
description: Reference for React Router v7 setup, route configuration, protected routes, layout structure, and navigation patterns in MomentumX. Auto-invoke when adding routes, modifying layouts, or working with navigation.
user-invocable: false
---

# Routing & Layout Reference

## Router Setup

React Router v7 with `createBrowserRouter` in `src/constants/route.tsx`.

```typescript
// src/constants/route.tsx
import { createBrowserRouter } from 'react-router-dom';
import { HIDE_OLD_FLOW } from './root';

// NOTE: exported as `localRouter`, not `router`
export const localRouter = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/', element: <Landing /> },

  // Protected routes — children depend on HIDE_OLD_FLOW flag
  {
    path: '/app',
    element: <ProtectedLayout />,  // auth guard + layout wrapper
    children: HIDE_OLD_FLOW
      ? [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'packaging', element: <PackagingPage /> },
        ]
      : [
          { path: 'onboarding', element: <Onboarding /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'title', element: <TitlePage /> },
          { path: 'scripts', element: <ScriptPage /> },
          { path: 'script/:scriptId', element: <ScriptDetails /> },
          { path: 'packaging', element: <PackagingPage /> },
        ],
  },
]);

// Used in App.tsx
<RouterProvider router={localRouter} />
```

## Current Routes

When `HIDE_OLD_FLOW = true` (current state):

| Path | Component | Purpose |
|---|---|---|
| `/` | Landing | Marketing / unauthenticated entry |
| `/login` | Login | Firebase auth |
| `/app/dashboard` | Dashboard | Video project list (WIP) |
| `/app/packaging` | PackagingPage | Standalone packaging UI |

Legacy routes (disabled, in `src/pages/` but not accessible):

| Path | Component | Status |
|---|---|---|
| `/app/onboarding` | Onboarding | Will be replaced by pipeline integration |
| `/app/title` | TitlePage | Replaced by Dashboard |
| `/app/scripts` | ScriptPage | Replaced by Dashboard |
| `/app/script/:scriptId` | ScriptDetails | Replaced by project detail view |
| `/app/profile` | Profile | Settings moved elsewhere |

## Pending Routes

Not yet built — awaiting Video Project pipeline integration:

- `/app/project/:projectId` — project detail view with step tracker
- `/app/project/:projectId/research` — topic generation
- `/app/project/:projectId/script` — script generation (SSE streaming)
- `/app/project/:projectId/hooks` — hook selection
- `/app/project/:projectId/packaging` — packaging items

## Adding a New Route

1. Create the page component in `src/pages/{Feature}/index.tsx`
2. Add the route to `src/constants/route.tsx` under the `/app` children
3. If it needs sidebar navigation, add entry in `src/components/shared/sideDrawer/`
4. If it needs its own layout (no sidebar), create a new layout route

```typescript
// Adding a new protected route
{
  path: '/app',
  element: <ProtectedLayout />,
  children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'packaging', element: <Packaging /> },
    // New route:
    { path: 'project/:projectId', element: <ProjectView /> },
  ],
}
```

## Protected Route Guard

```typescript
// src/components/shared/ProtectedRoute/
// Checks Firebase auth state via localStorage flag
// Redirects to /login if not authenticated
// Fetches initial data (user profile, titles, scripts) on first access
// Runs health check interval (every 13 minutes)

const ProtectedLayout = () => {
  const isLoggedIn = isUserLoggedIn(); // checks localStorage

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <RootLayout>
      <Outlet />  {/* child routes render here */}
    </RootLayout>
  );
};
```

## Layout Structure

```
ProtectedLayout
├── RootLayout
│   ├── SideDrawer (sidebar navigation)
│   │   ├── Brand logo
│   │   ├── Navigation links
│   │   └── Logout button
│   ├── Ambient background (gradient orbs + grid)
│   └── Main content area
│       └── <Outlet /> (page content)
```

### RootLayout (`src/components/shared/rootLayout/`)
- Wraps all protected pages
- Provides sidebar + ambient background
- Uses shadcn `SidebarProvider` (set up in `main.tsx`)

## Navigation

```typescript
// src/constants/navigate.ts — navigation helper utilities
import { useNavigate } from 'react-router-dom';

// Programmatic navigation in components
const navigate = useNavigate();
navigate('/app/dashboard');
navigate(`/app/project/${projectId}`);
navigate('/login');

// Navigation links in sidebar
<Link to="/app/dashboard">Dashboard</Link>
<Link to="/app/packaging">Packaging</Link>
```

## Route Parameters

```typescript
// Reading route params
import { useParams } from 'react-router-dom';

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  // use projectId to fetch data
};

// Reading search params
import { useSearchParams } from 'react-router-dom';

const TopicList = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
};
```

## HIDE_OLD_FLOW Flag

```typescript
// src/constants/root.ts
export const HIDE_OLD_FLOW = true;
```

When `true`, the following routes are not registered:
- `/app/onboarding`
- `/app/title`
- `/app/scripts`
- `/app/script/:scriptId`
- `/app/profile`

These legacy pages exist in `src/pages/` but are not accessible. They will be replaced by the new pipeline-integrated UI.

## Lazy Loading

For route-level code splitting:

```typescript
import { lazy, Suspense } from 'react';

const ProjectView = lazy(() => import('@/pages/ProjectView'));

// In route config
{
  path: 'project/:projectId',
  element: (
    <Suspense fallback={<Loader />}>
      <ProjectView />
    </Suspense>
  ),
}
```

## SPA Redirect (Netlify)

```toml
# netlify.toml — already configured
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

All routes redirect to `index.html` — React Router handles client-side routing.
