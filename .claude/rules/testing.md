---
name: testing
description: Constraints for writing tests in MomentumX — Vitest, React Testing Library, and mock patterns.
paths: ["src/**/*.test.ts", "src/**/*.test.tsx", "src/**/*.spec.ts", "src/**/*.spec.tsx", "src/**/__tests__/**"]
---

# Testing Constraints

Non-negotiable rules for every test file in this codebase.

---

## Stack

- **Test runner:** Vitest
- **Component testing:** React Testing Library (`@testing-library/react`)
- **User interactions:** `@testing-library/user-event` — never `fireEvent`

---

## File Placement

Test files live next to the source file they cover.

```
src/components/packaging/TitlesCard.tsx
src/components/packaging/TitlesCard.test.tsx   ✅

src/__tests__/TitlesCard.test.tsx              ❌ — wrong location
```

---

## What to Mock

- **Always mock services** — never let tests hit the network
- **Never mock Redux internals** — test against real reducers with a real store wrapped in `renderWithProviders`
- **Never mock React hooks** — test the component behavior, not hook internals

---

## What to Test

- User behavior: what a user sees, types, clicks, and reads
- Async state changes: loading → success, loading → error
- Conditional rendering: empty states, error states, content states
- **Never test implementation details** — no asserting on internal state, private functions, or component method calls

---

## No Snapshot Tests

Snapshot tests are brittle and provide low signal. Do not add them.

```typescript
// ❌ Never
expect(container).toMatchSnapshot();

// ✅ Assert on specific visible output
expect(screen.getByText('Generate Titles')).toBeInTheDocument();
```

---

## Thunk Tests

Test thunks by mocking the service and asserting dispatched actions — see the `testing-patterns` skill for the full pattern.
