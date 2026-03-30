---
name: testing-patterns
description: Vitest + React Testing Library patterns for MomentumX — component tests, thunk tests, mock services, and test utilities.
user-invocable: false
---

# Testing Patterns Reference

## Vitest Configuration

Vitest is configured in `vite.config.ts` (or a separate `vitest.config.ts`). The relevant settings for this project:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
```

The `globals: true` setting means `describe`, `it`, `expect`, `vi`, and `beforeEach` are available without imports.

---

## Redux Test Utilities — `renderWithProviders`

Never render components with a bare `render()` when they use Redux. Wrap them with a real store.

```typescript
// src/test/renderWithProviders.tsx
import { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { RootState } from '@/utils/store';
import userReducer from '@/utils/feature/user/user.slice';
import titlesReducer from '@/utils/feature/titles/titles.slice';
import scriptsReducer from '@/utils/feature/scripts/script.slice';
import packagingReducer from '@/utils/feature/packaging/packaging.slice';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: {
      user: userReducer,
      titles: titlesReducer,
      scripts: scriptsReducer,
      packaging: packagingReducer,
    },
    preloadedState,
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

Usage:

```typescript
const { store } = renderWithProviders(<TitlesCard />, {
  preloadedState: {
    titles: { topics: mockTopics, loading: false, error: null },
  },
});
```

---

## Component Test Pattern

Test what the user sees and does, not what the component does internally.

```typescript
// src/components/packaging/TitlesCard.test.tsx
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/renderWithProviders';
import { TitlesCard } from './TitlesCard';
import type { ITitle } from '@/types/feature/packaging';

const mockTitles: ITitle[] = [
  { id: '1', title: 'How to Grow on YouTube in 2025', selected: false },
  { id: '2', title: '5 YouTube Mistakes to Avoid', selected: false },
];

describe('TitlesCard', () => {
  it('renders all title options', () => {
    renderWithProviders(
      <TitlesCard
        titles={mockTitles}
        selectedIndex={0}
        loading={false}
        onSelect={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );

    expect(screen.getByText('How to Grow on YouTube in 2025')).toBeInTheDocument();
    expect(screen.getByText('5 YouTube Mistakes to Avoid')).toBeInTheDocument();
  });

  it('shows skeleton while loading', () => {
    renderWithProviders(
      <TitlesCard
        titles={[]}
        selectedIndex={-1}
        loading={true}
        onSelect={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );

    expect(screen.queryByText('How to Grow on YouTube in 2025')).not.toBeInTheDocument();
    // assert skeleton is rendered — query by test-id or role
  });

  it('calls onSelect when a title is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    renderWithProviders(
      <TitlesCard
        titles={mockTitles}
        selectedIndex={0}
        loading={false}
        onSelect={onSelect}
        onRegenerate={vi.fn()}
      />
    );

    await user.click(screen.getByText('5 YouTube Mistakes to Avoid'));
    expect(onSelect).toHaveBeenCalledWith(1);
  });

  it('calls onRegenerate when the button is clicked', async () => {
    const user = userEvent.setup();
    const onRegenerate = vi.fn();

    renderWithProviders(
      <TitlesCard
        titles={mockTitles}
        selectedIndex={0}
        loading={false}
        onSelect={vi.fn()}
        onRegenerate={onRegenerate}
      />
    );

    await user.click(screen.getByRole('button', { name: /regenerate/i }));
    expect(onRegenerate).toHaveBeenCalledTimes(1);
  });
});
```

---

## Thunk Test Pattern

Thunks are tested by mocking the service layer and asserting on the actions dispatched to a real store.

```typescript
// src/utils/feature/titles/titles.thunk.test.ts
import { configureStore } from '@reduxjs/toolkit';
import titlesReducer from './titles.slice';
import { generateTitles } from './titles.thunk';
import { titleService } from '@/service/titles';
import type { ITopic } from '@/types/feature/title';

// Mock the service module — never mock Redux internals
vi.mock('@/service/titles');

const mockTopics: ITopic[] = [
  { id: '1', title: 'How to Grow on YouTube', generated: true },
];

describe('generateTitles thunk', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({ reducer: { titles: titlesReducer } });
    vi.clearAllMocks();
  });

  it('dispatches fulfilled and stores topics on success', async () => {
    vi.mocked(titleService.generateTitles).mockResolvedValue({
      data: mockTopics,
      message: 'Titles generated',
    });

    await store.dispatch(generateTitles());

    const state = store.getState().titles;
    expect(state.topics).toEqual(mockTopics);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('dispatches rejected and sets error on failure', async () => {
    vi.mocked(titleService.generateTitles).mockRejectedValue(
      new Error('Network error')
    );

    await store.dispatch(generateTitles());

    const state = store.getState().titles;
    expect(state.loading).toBe(false);
    expect(state.error).toBeTruthy();
  });

  it('sets loading true while pending', () => {
    vi.mocked(titleService.generateTitles).mockReturnValue(new Promise(() => {}));

    store.dispatch(generateTitles());

    expect(store.getState().titles.loading).toBe(true);
  });
});
```

---

## Mock Service Pattern

Use `vi.mock()` with typed return values. Always place `vi.mock()` at the top of the file, before any imports that use the module.

```typescript
// Mocking a class-based service
vi.mock('@/service/packaging');

// In a test or beforeEach, set the resolved/rejected value
vi.mocked(packagingService.generateTitle).mockResolvedValue({
  data: { titles: [{ title: 'Mock Title', variation: 'A' }] },
  message: 'Success',
});

// For rejected paths
vi.mocked(packagingService.savePackaging).mockRejectedValue(
  new Error('Save failed')
);
```

For services with multiple methods, mock only what the test needs — leave others unset or mock them to throw so unexpected calls surface as failures.

---

## Testing Async State Changes

Use `waitFor` from RTL when testing async UI updates triggered by dispatched thunks.

```typescript
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('shows titles after generate button is clicked', async () => {
  const user = userEvent.setup();

  vi.mocked(packagingService.generateTitle).mockResolvedValue({
    data: { titles: [{ title: 'Mock Title', variation: 'A' }] },
    message: 'Success',
  });

  renderWithProviders(<PackagingPage />);

  await user.click(screen.getByRole('button', { name: /generate/i }));

  await waitFor(() => {
    expect(screen.getByText('Mock Title')).toBeInTheDocument();
  });
});
```

---

## Testing Error States

```typescript
it('shows error message when fetch fails', async () => {
  vi.mocked(titleService.getGeneratedData).mockRejectedValue(
    new Error('Failed to load')
  );

  renderWithProviders(<TitlesList />);

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
  });
});
```

---

## Testing Conditional Rendering

```typescript
it('shows empty state when there are no projects', () => {
  renderWithProviders(<ProjectList projects={[]} />);
  expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
});

it('shows project cards when projects exist', () => {
  renderWithProviders(<ProjectList projects={mockProjects} />);
  expect(screen.getAllByRole('article')).toHaveLength(mockProjects.length);
});
```

---

## Common Assertions

```typescript
// Element presence
expect(screen.getByText('Some text')).toBeInTheDocument();
expect(screen.queryByText('Hidden text')).not.toBeInTheDocument();

// By role — preferred over getByText for interactive elements
expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Dashboard');

// Attribute checks
expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
expect(screen.getByRole('textbox', { name: /title/i })).toHaveValue('My Title');

// Content checks
expect(screen.getByTestId('status-badge')).toHaveTextContent('Active');

// Count
expect(screen.getAllByRole('listitem')).toHaveLength(3);

// Action was called
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('expected-argument');
expect(mockFn).not.toHaveBeenCalled();
```

---

## What NOT to Test

```typescript
// ❌ Internal state values
expect(component.state.isOpen).toBe(true);

// ❌ Class names or styling
expect(el).toHaveClass('bg-primary');

// ❌ Function names or implementation
expect(wrapper.find('handleClick')).toBeDefined();

// ❌ Snapshot tests
expect(container).toMatchSnapshot();

// ❌ Redux store shape — test behavior, not internals
expect(store.getState().titles.meta.page).toBe(1);
// Instead: assert what the user sees as a result of that state
```
