---
name: ui-design-system
description: Reference for MomentumX design system — CSS variables, Tailwind patterns, shadcn component usage, glass morphism recipes, and animation patterns. Auto-invoke when styling components or working with the design system.
user-invocable: false
---

# UI Design System Reference

## Theme — CSS Variables

All defined in `src/index.css`. Use via Tailwind utility classes.

### Core Palette
Values are wrapped in `hsl()` in `src/index.css`.

| Variable | Value | Tailwind Class | Usage |
|---|---|---|---|
| `--background` | hsl(230 25% 7%) | `bg-background` | Main page background |
| `--foreground` | hsl(210 40% 96%) | `text-foreground` | Primary text |
| `--primary` | hsl(265 89% 66%) | `bg-primary`, `text-primary` | CTAs, active states |
| `--secondary` | hsl(230 25% 14%) | `bg-secondary` | Card backgrounds |
| `--accent` | hsl(230 25% 18%) | `bg-accent` | Subtle highlights |
| `--muted` | hsl(230 25% 14%) | `text-muted-foreground` | Secondary text |
| `--destructive` | hsl(0 72% 51%) | `bg-destructive` | Errors, delete |
| `--border` | hsl(230 20% 18%) | `border-border` | Default borders |
| `--ring` | hsl(265 89% 66%) | `ring-ring` | Focus rings |

## shadcn/ui Setup

**Config file:** `components.json` at project root
- Style: `new-york`
- Icon library: `lucide`
- Base color: `neutral`
- CSS variables: enabled

### Adding Components
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

### Installed Components (`src/components/ui/`)
accordion, alert, avatar, badge, button, card, checkbox, dialog, dropdown-menu, input, label, menubar, radio-group, select, separator, sheet, sidebar, skeleton, sonner, textarea, tooltip

### Class Merging Utility
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Glass Morphism Recipes

### Standard Card
```tsx
<div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
```

### Elevated Card (modals, hero sections)
```tsx
<div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl p-8">
```

### Subtle Card (list items, secondary)
```tsx
<div className="bg-white/[0.03] border border-white/5 rounded-lg p-4">
```

### Interactive Card (hover states)
```tsx
<div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer">
```

## Gradient Recipes

### Buttons
```tsx
// Primary CTA
className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 hover:shadow-purple-500/25 transition-all duration-200"

// Secondary CTA
className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"

// Success
className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
```

### Decorative
```tsx
// Ambient orb (background decoration)
className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"

// Grid overlay
className="bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"
```

## Animation Recipes

### Loading
```tsx
// Shimmer skeleton
<div className="animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg h-4" />

// Spinner
<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
```

### Transitions
```tsx
// Hover scale
className="transition-all duration-200 hover:scale-105"

// Color transition
className="transition-colors duration-200"

// Fade in
className="animate-in fade-in duration-300"
```

## Responsive Breakpoints

Mobile-first. Tailwind defaults:
| Breakpoint | Min Width | Usage |
|---|---|---|
| (default) | 0px | Mobile layout |
| `sm:` | 640px | Small tablets |
| `md:` | 768px | Tablets, small laptops |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Wide desktops |

### Common Patterns
```tsx
// Grid columns
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Padding
className="p-4 md:p-6 lg:p-8"

// Show/hide
className="hidden md:block"   // hidden on mobile, visible on tablet+
className="md:hidden"         // visible on mobile only
```

## Sidebar (shadcn Sidebar)

```tsx
// src/components/shared/sideDrawer/
// Uses shadcn Sidebar component with SidebarProvider in main.tsx
// Mobile: collapsible sheet
// Desktop: fixed sidebar

import { SidebarProvider } from '@/components/ui/sidebar';
```

## Toast Notifications (Sonner)

```tsx
// Configured in App.tsx
import { Toaster } from '@/components/ui/sonner';

// Usage via utilities
import { toastSuccess, toastError, toastInfo } from '@/utils/toast';

toastSuccess('Saved successfully');
toastError('Failed to generate');
```

## Icons (Lucide React)

```tsx
import {
  Plus, Loader2, Check, X, ChevronRight, ChevronDown,
  Copy, Download, Trash2, RefreshCw, ThumbsUp, ThumbsDown,
  Edit, Save, Eye, MoreHorizontal, ExternalLink
} from 'lucide-react';

// Size conventions
className="h-4 w-4"   // inline with text
className="h-5 w-5"   // standalone small
className="h-6 w-6"   // navigation, headers
```
