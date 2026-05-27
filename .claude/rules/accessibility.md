---
name: accessibility
description: Accessibility requirements for all MomentumX UI — semantic HTML, keyboard navigation, ARIA, and contrast.
paths:
  - "src/components/**/*"
  - "src/pages/**/*"
---

# Accessibility Constraints

Applies globally to every component and page. These are non-negotiable minimums.

---

## Semantic HTML First

Use the right element for the job. Never reach for a `div` when a semantic element exists.

```tsx
// ✅ Semantic
<nav>, <main>, <section>, <article>, <header>, <footer>, <button>, <a>

// ❌ Div soup
<div onClick={...}>Click me</div>   — use <button>
<div href="...">Link</div>          — use <a>
```

---

## Keyboard Accessibility

- Every interactive element must be reachable and operable via keyboard
- `Tab` navigates to all interactive elements
- `Enter` / `Space` activates buttons
- `Escape` closes dialogs and dropdowns
- Custom interactive elements that are not `<button>` or `<a>` must have `role`, `tabIndex={0}`, and keyboard event handlers

---

## Images

```tsx
// ✅ Meaningful image
<img src={thumbnail} alt="Video thumbnail for 'How to grow on YouTube'" />

// ✅ Decorative image — explicitly empty alt
<img src={decorativeBg} alt="" />

// ❌ Missing alt
<img src={thumbnail} />
```

---

## Form Labels

Every form input must have an associated label. Use `htmlFor` + `id` or wrap in `<label>`.

```tsx
// ✅
<label htmlFor="script-input">Script</label>
<textarea id="script-input" />

// ❌ No label
<textarea placeholder="Paste your script..." />
```

---

## ARIA

Use ARIA only when semantic HTML is not sufficient. Do not add ARIA to elements that already have an implicit role.

```tsx
// ✅ ARIA for custom components
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">

// ✅ Loading state
<div aria-live="polite" aria-busy={loading}>

// ❌ Redundant ARIA
<button role="button">   — button already has this role
```

---

## Color Contrast

- Text must meet WCAG AA: minimum 4.5:1 contrast ratio against its background
- Large text (18pt / 14pt bold): minimum 3:1
- Do not rely on color alone to convey meaning — pair with text or icons

---

## Focus Indicators

Focus rings must always be visible. Never suppress focus outlines without a visible replacement.

```tsx
// ❌ Hides focus with no replacement
className="outline-none"

// ✅ Replaces default with custom visible indicator
className="outline-none focus-visible:ring-2 focus-visible:ring-primary"
```
