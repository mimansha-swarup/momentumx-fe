---
name: component-patterns
description: Reference for React component conventions in MomentumX — component organization, prop typing, hook patterns, and the container/presentational split. Auto-invoke when building or modifying React components.
user-invocable: false
---

# Component Patterns Reference

## Component Organization

```
src/
├── pages/                    — Route-level containers (one per route)
│   ├── Dashboard/index.tsx
│   ├── Packaging/index.tsx
│   ├── Login/index.tsx
│   ├── Landing/index.tsx
│   ├── Onboarding/index.tsx  (hidden by HIDE_OLD_FLOW)
│   ├── Profile/index.tsx     (hidden by HIDE_OLD_FLOW)
│   ├── Titles/index.tsx      (hidden by HIDE_OLD_FLOW)
│   ├── Scripts/index.tsx     (hidden by HIDE_OLD_FLOW)
│   ├── ScriptDetails/index.tsx (hidden by HIDE_OLD_FLOW)
│   └── Review/index.tsx      (legacy)
│
├── components/               — Feature and shared components
│   ├── dashboard/            — Dashboard-specific components
│   │   ├── card.tsx
│   │   ├── greetings.tsx
│   │   └── generatedContent.tsx
│   ├── packaging/            — Packaging-specific components
│   │   ├── ScriptInput.tsx
│   │   ├── TitlesCard.tsx
│   │   ├── OutputCard.tsx
│   │   ├── ThumbnailsCard.tsx
│   │   ├── HooksParagraphCard.tsx
│   │   ├── ShortsScriptCard.tsx
│   │   ├── GradientSkeleton.tsx
│   │   └── index.ts          — barrel export
│   ├── shared/               — Reusable across features
│   │   ├── ProtectedRoute/
│   │   ├── rootLayout/
│   │   ├── header/
│   │   ├── sideDrawer/
│   │   ├── Loader/
│   │   ├── MarkdownRenderer/
│   │   ├── Editor/
│   │   ├── emptyState/
│   │   └── glassCard/
│   └── ui/                   — shadcn/Radix primitives (UI Engineer only)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       └── ...
│
└── hooks/                    — Reusable custom hooks
    ├── useAuth.tsx
    ├── useRedux.ts
    ├── useDebounce.tsx
    ├── useUserProfile.ts
    ├── useTitles.tsx
    └── use-mobile.ts
```

## Page Components (Containers)

Pages are thin orchestrators. They:
- Dispatch thunks on mount (data fetching)
- Compose feature components
- Handle route-level concerns (params, navigation)

```tsx
// src/pages/Dashboard/index.tsx
const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <Header title="Dashboard" />
      <Greetings />
      <ProjectList projects={projects} />
    </div>
  );
};

export default DashboardPage;
```

## Feature Components (Presentational)

Feature components receive data via props or Redux hooks. They render UI and dispatch actions.

```tsx
// src/components/packaging/TitlesCard.tsx
interface TitlesCardProps {
  titles: ITitle[];
  selectedIndex: number;
  loading: boolean;
  onSelect: (index: number) => void;
  onRegenerate: () => void;
}

export const TitlesCard: React.FC<TitlesCardProps> = ({
  titles,
  selectedIndex,
  loading,
  onSelect,
  onRegenerate,
}) => {
  if (loading) return <GradientSkeleton />;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      {titles.map((title, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className={cn(
            "w-full text-left p-3 rounded-lg cursor-pointer transition-colors",
            i === selectedIndex ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
          )}
        >
          {title.title}
        </button>
      ))}
      <Button onClick={onRegenerate} variant="outline">Regenerate</Button>
    </div>
  );
};
```

## Props Typing

```typescript
// ✅ Interface for every component
interface ComponentProps {
  title: string;
  onAction: () => void;
  children?: React.ReactNode;
  className?: string;           // allow parent to extend styling
}

// ✅ Optional className prop for composability
export const Card: React.FC<ComponentProps> = ({ title, className }) => (
  <div className={cn("bg-secondary rounded-xl p-4", className)}>
    <h3>{title}</h3>
  </div>
);

// ✅ Extending HTML element props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  loading?: boolean;
}
```

## Custom Hooks

### Existing hooks reference:

| Hook | Purpose | Returns |
|---|---|---|
| `useAuthenticate()` | Firebase auth listener, dispatches user fetch | void (side effect) |
| `useAuthCredential()` | User + loading from Redux | `{ user, loading }` |
| `useAppDispatch()` | Typed Redux dispatch | `AppDispatch` |
| `useAppSelector()` | Typed Redux selector | typed state |
| `useTitles()` | Titles data from Redux | titles data |
| `useUserProfile()` | User profile with memoization | user profile |
| `useDebounce(value, delay)` | Debounced value | debounced value |
| `useIsMobile()` | Mobile breakpoint detection | `boolean` |

### Custom hook conventions:

```typescript
// ✅ Prefix with "use"
// ✅ Return typed values
// ✅ Keep hooks focused — one responsibility
export const useVideoProject = (projectId: string) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector((state) =>
    state.videoProject.projects.find(p => p.id === projectId)
  );
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    if (!project) dispatch(fetchProject(projectId));
  }, [projectId, dispatch, project]);

  return { project, loading };
};
```

## Conditional Rendering Pattern

Always handle all three states: loading, error, and empty.

```tsx
const ProjectList: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  if (loading) return <Loader />;
  if (error) return <div className="text-destructive">{error}</div>;
  if (projects.length === 0) return <EmptyState message="No projects yet" />;

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};
```

## Packaging Components — Data Patterns

The packaging components use `string[]` for array data because it aligns with the backend response:

```typescript
// ThumbnailsCard accepts string[] of briefs
interface ThumbnailsCardProps {
  descriptions: string[];    // Array of thumbnail brief strings
  selectedIndex: number;
  isLoading: boolean;
  onRegenerate: () => void;
  onSelectThumbnail: (index: number) => void;
}

// HooksParagraphCard accepts string[] of hooks
interface HooksParagraphCardProps {
  hooks: string[];           // Array of hook strings
  isLoading: boolean;
  onEditHook: (index: number, value: string) => void;
  onDeleteHook?: (index: number) => void;
}

// Both components handle empty state gracefully
const displayHooks = hooks.length > 0 ? hooks : ['', '', ''];  // Show 3 placeholders when loading
```

## Barrel Exports

Feature component directories should have an `index.ts`:

```typescript
// src/components/packaging/index.ts
export { ScriptInput } from './ScriptInput';
export { TitlesCard } from './TitlesCard';
export { OutputCard } from './OutputCard';
export { ThumbnailsCard } from './ThumbnailsCard';
export { HooksParagraphCard } from './HooksParagraphCard';
export { ShortsScriptCard } from './ShortsScriptCard';
export { GradientSkeleton } from './GradientSkeleton';
```

## Shared Component Patterns

### MarkdownRenderer

Renders markdown content safely — never use `dangerouslySetInnerHTML`:

```tsx
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';

<MarkdownRenderer content={scriptContent} />
```

### Loader

Loading skeleton for page-level waits:

```tsx
import RootLoader from '@/components/shared/Loader';

if (loading) return <RootLoader />;
```

### GlassCard

Reusable glass-morphism container:

```tsx
import { GlassCard } from '@/components/shared/glassCard';

<GlassCard>Content</GlassCard>
```
