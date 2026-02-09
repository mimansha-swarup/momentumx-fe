# Codebase Audit Report

**Date:** January 29, 2026
**Project:** MomentumX Frontend
**Branch:** onboarding

---

## Table of Contents

1. [Dead/Unused Code](#1-deadunused-code)
2. [Architectural Issues](#2-architectural-issues)
3. [Code Quality Issues](#3-code-quality-issues)
4. [Summary Statistics](#4-summary-statistics)
5. [Priority Fixes](#5-priority-fixes)

---

## 1. Dead/Unused Code

### 1.1 Completely Unused Components

#### AnimatedSection Component
- **File:** `src/components/shared/animatedSection/index.tsx`
- **Status:** Entire file is commented out (67 lines)
- **Issue:** The entire component implementation is commented out, including TypeScript interfaces and logic. Never imported or used anywhere in the codebase.
- **Recommendation:** Delete this dead code or implement if needed.

#### useDebounce Hook
- **File:** `src/hooks/useDebounce.tsx`
- **Status:** Defined but never imported or used anywhere
- **Issue:** A complete debounce hook with documentation exists but is not utilized in any component.
- **Recommendation:** Remove if not planned for future use, or integrate into components that perform searches.

### 1.2 Large Commented Code Blocks

| File | Lines | Size | Content |
|------|-------|------|---------|
| `src/components/shared/animatedSection/index.tsx` | 1-67 | 67 lines | Entire component |
| `src/components/profile/userSettings.tsx` | 48-89 | 42 lines | Competitor input form logic |
| `src/components/shared/sideDrawer/menu.tsx` | 45-116 | 75+ lines | Dropdown menu structure with unused Lucide icon imports |
| `src/pages/Onboarding/index.tsx` | 84-89 | 4 lines | Keyboard event handler |
| `src/components/dashboard/generatedContent.tsx` | 35 | 1 line | Single JSX line |
| `src/pages/Scripts/index.tsx` | 19-24 | 6 lines | Download button section |
| `src/components/shared/MarkdownRenderer/index.tsx` | 9 | 1 line | CSS class name |

### 1.3 Unused Imports in menu.tsx

The following Lucide icons are imported but never used (due to commented code):
- Cloud, CreditCard, Github, Keyboard, LifeBuoy, Mail, MessageSquare, Plus, PlusCircle, Settings, User, UserPlus, Users

---

## 2. Architectural Issues

### 2.1 Type Safety Disabled (Critical)

Multiple files aggressively disable TypeScript and ESLint:

| File | Disabled Rules |
|------|----------------|
| `src/pages/Onboarding/index.tsx` | `@ts-nocheck` |
| `src/pages/Review/index.tsx` | `@ts-nocheck`, `ban-ts-comment`, `no-explicit-any` |
| `src/components/onboarding/sidebar.tsx` | `@ts-nocheck`, `ban-ts-comment`, `no-explicit-any` |
| `src/components/profile/userSettings.tsx` | `@ts-nocheck`, `ban-ts-comment` |

**Recommendation:** Re-enable TypeScript checking and fix type errors properly instead of suppressing them.

### 2.2 Components with Too Many Responsibilities

#### Onboarding Page
- **File:** `src/pages/Onboarding/index.tsx`
- **Size:** 193 lines
- **Issues:**
  - Mixes form state, navigation, progress tracking, and section management
  - Multiple useState hooks managing: currentSectionIndex, currentQuestionIndex, maxSectionIndex
  - Complex conditional rendering logic
  - Hardcoded gradient colors (PROGRESS_GRADIENT object)

#### ProtectedRoute Component
- **File:** `src/components/shared/ProtectedRoute/index.tsx`
- **Issues:**
  - Handles authentication, data fetching, server keep-alive, and layout composition
  - Server ping logic mixed with authentication concerns
  - Should be split into separate concerns

### 2.3 Duplicate/Similar Components

| Component 1 | Component 2 | Issue |
|-------------|-------------|-------|
| `src/components/dashboard/card.tsx` | `src/components/onboarding/card.tsx` | Both could be consolidated into a generic Card component |

### 2.4 Inconsistent Patterns

#### Component Structure
- Some components use functional components directly: `components/landing/*`
- Others use `FC<Props>` pattern: `components/dashboard/card.tsx`, `components/shared/titleCard/index.tsx`
- Mixed export patterns: some use `export default`, some use named exports

#### Folder Structure
- Some feature folders have index files (e.g., `components/shared/glassCard/index.tsx`)
- Others are flat files (e.g., `components/dashboard/card.tsx`)
- Inconsistent naming: `card.tsx` exists in both `dashboard` and `onboarding` folders

#### Type Definitions
- Types scattered across multiple locations:
  - `src/types/components/*`
  - Some inline in component files
- No single source of truth for shared types

### 2.5 State Management Issues

#### Redundant Auth State Management
- Both localStorage and Redux used for auth state
- `isUserLoggedIn()` checks localStorage directly
- Redundancy in `src/utils/index.ts`

#### localStorage vs Redux Confusion
- `getIsNewUser()` function in utils/index.ts uses localStorage
- Also stored/checked in Redux user slice
- Multiple sources of truth for the same data

### 2.6 Bug: Navigate Not Returned

**File:** `src/pages/Onboarding/index.tsx:80-81`

```tsx
if (user?.niche) {
  <Navigate to="/app/dashboard" replace />;  // Missing return statement!
}
```

**Issue:** JSX element not returned; Navigate won't execute.
**Fix:** Add `return` before `<Navigate ... />`

---

## 3. Code Quality Issues

### 3.1 Console Logs in Production Code

| File | Line | Console Call | Severity |
|------|------|--------------|----------|
| `src/components/shared/ProtectedRoute/index.tsx` | 39 | `console.log("Executed")` | Medium |
| `src/components/shared/ProtectedRoute/index.tsx` | 41 | `console.log("Ping sent to keep server awake")` | Medium |
| `src/components/shared/titleCard/index.tsx` | 55 | `console.log("error", error)` | Low |
| `src/pages/Onboarding/index.tsx` | 109 | `console.log(activeQuestion, currentQuestionIndex, currentSectionIndex)` | High |
| `src/pages/ScriptDetails/index.tsx` | 120 | `console.log("Error :", error)` | Low |
| `src/service/onboarding.ts` | Multiple | `console.error()` and `console.log()` | Medium |
| `src/service/script.ts` | Multiple | `console.log()` and `console.error()` | Medium |
| `src/service/titles.ts` | Multiple | `console.error()` | Low |
| `src/utils/feature/scripts/script.thunk.ts` | Multiple | `console.log()` | Medium |
| `src/utils/feature/titles/titles.thunk.ts` | Multiple | `console.log()` | Medium |
| `src/utils/firebase/login.ts` | Multiple | `console.error()` | Low |
| `src/utils/storage.ts` | Multiple | `console.error()` | Low |

**Recommendation:** Remove console statements or wrap in development environment check:
```tsx
if (process.env.NODE_ENV === 'development') {
  console.log(...);
}
```

### 3.2 TODO/FIXME Comments Requiring Attention

| File | Line | Comment | Action Needed |
|------|------|---------|---------------|
| `src/components/titles/list.tsx` | 3 | `// TODO: check and Fix` | Vague - needs clarification |
| `src/pages/ScriptDetails/index.tsx` | 71 | `// edit logic and create a get if record is not present then fetch it TODO:` | Incomplete implementation |
| `src/utils/firebase/config.ts` | N/A | `// TODO: Add SDKs for Firebase products that you want to use` | Auto-generated, can be removed |

### 3.3 Hardcoded Values That Should Be Constants

| Location | Value | Context | Suggested Constant Name |
|----------|-------|---------|------------------------|
| `src/components/shared/ProtectedRoute/index.tsx:45` | `13 * 60 * 1000` | Server ping interval | `HEALTH_CHECK_INTERVAL_MS` |
| `src/pages/Review/index.tsx:44` | `2000` | Timeout on submit | `SUBMIT_SUCCESS_DELAY_MS` |
| `src/pages/ScriptDetails/index.tsx:92` | `3000` | Navigation delay | `SCRIPT_GENERATION_DELAY_MS` |
| `src/pages/Onboarding/index.tsx:29-39` | `PROGRESS_GRADIENT` object | Gradient colors by index | Move to `constants/onboarding.ts` |
| `src/constants/route.tsx:23` | `"dsfsdfsd"` | Suspense fallback text | Replace with proper loading component |
| `src/utils/scripts/index.ts:3` | `300` | Markdown character limit | `MARKDOWN_PREVIEW_LIMIT` |
| `src/utils/onboarding/index.tsx:158` | `300px` | Max height for group rows | Move to CSS variables or config |

### 3.4 Placeholder/Test Data in Production

**File:** `src/constants/route.tsx:23`

```tsx
<Suspense fallback={<div>dsfsdfsd</div>}>
```

**Issue:** Placeholder text "dsfsdfsd" should be replaced with proper loading component.
**Recommendation:** Use existing `RootLoader` or create a lightweight spinner component.

### 3.5 Accessibility Issues

- Very limited `aria-label` usage (only found on sidebar toggle)
- No `data-testid` attributes for testing
- Potential color contrast issues not verified
- Missing alt text on some images (profile avatar fallback not always set)

### 3.6 Performance Considerations

#### Missing useCallback Dependencies
- **File:** `src/components/titles/list.tsx`
- **Issue:** `handleObserver` function dependencies array may be incomplete

#### Potential Memory Leaks
- Server ping interval in ProtectedRoute should be cleared on unmount (verify cleanup)

---

## 4. Summary Statistics

| Category | Count |
|----------|-------|
| Completely Unused Components | 1 (AnimatedSection) |
| Unused Hooks | 1 (useDebounce) |
| Large Commented Code Blocks | 7 |
| Console.log Statements | 25+ instances |
| TODO/FIXME Comments | 3 |
| Hardcoded Values | 7+ instances |
| Files with @ts-nocheck | 4 |
| Duplicate Components | 2 (Card components) |
| Files with ESLint Disables | 4 |
| Placeholder/Test Strings | 1 ("dsfsdfsd") |
| Missing Return Statements (Bugs) | 1 (Navigate) |

---

## 5. Priority Fixes

### Critical (Fix Immediately)

1. **Fix missing `return` before `<Navigate>`** in `src/pages/Onboarding/index.tsx:80-81`
2. **Replace placeholder `"dsfsdfsd"`** in `src/constants/route.tsx:23` with proper loading component

### High Priority

3. **Remove console.log statements** or wrap in development environment check
4. **Delete unused code:**
   - `src/components/shared/animatedSection/index.tsx`
   - `src/hooks/useDebounce.tsx`
5. **Re-enable TypeScript checking** in disabled files and fix type errors properly

### Medium Priority

6. **Extract hardcoded values** to constants file (`src/constants/app.ts`)
7. **Consolidate duplicate Card components** into a single reusable component
8. **Clean up commented code blocks** - either restore or delete
9. **Address TODO comments** with proper implementations or remove them
10. **Fix state management** - choose single source of truth (localStorage OR Redux)

### Low Priority

11. **Improve accessibility** - add aria-labels, alt text, data-testid attributes
12. **Standardize component patterns** - choose FC<Props> or function declarations
13. **Organize type definitions** into centralized location
14. **Add proper error logging/monitoring** instead of console statements

---

## Appendix: Files Requiring Attention

### Files with Most Issues

1. `src/pages/Onboarding/index.tsx` - @ts-nocheck, console.log, hardcoded values, bug
2. `src/components/shared/ProtectedRoute/index.tsx` - multiple console.logs, hardcoded interval
3. `src/pages/Review/index.tsx` - @ts-nocheck, hardcoded values
4. `src/components/shared/sideDrawer/menu.tsx` - 75+ lines commented, unused imports
5. `src/components/shared/animatedSection/index.tsx` - entirely dead code

---

*This audit should be reviewed periodically and updated as issues are resolved.*
