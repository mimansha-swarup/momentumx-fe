# Packaging Feature - Planning Document

> **Route:** `/app/packaging`
> **Created:** 2026-02-07
> **Status:** Planning Phase

---

## 1. Feature Overview

The Packaging feature transforms a podcast script into ready-to-use marketing assets:

| Output | Description |
|--------|-------------|
| **Title** | Catchy, SEO-optimized podcast episode title |
| **Description** | Full podcast description for YouTube/platforms |
| **Thumbnail Description** | Designer instructions for thumbnail creation |
| **Hooks** | Multiple attention-grabbing hooks (opening line, pattern interrupt, CTA) |
| **YT Shorts Script** | Timestamped 60-second script for YouTube Shorts |

---

## 2. User Requirements Summary

### Input
- **Current:** Text area paste (large textarea for script input)
- **Future:** YouTube link import (disabled with "Coming Soon" badge)
- Both options will be visible, YT link input disabled for now

### Generation Behavior
- Each field has **separate API calls**
- User can **regenerate individual fields** independently
- All pieces visible in **one unified view**

### Output Actions
- **Copy to clipboard** button for each generated field
- **Save to database** for persistence
- Inline editing capability with character limit warnings

### Loading UX
- **Skeleton loaders** while generating content
- Each card shows skeleton independently during regeneration

---

## 3. UI/UX Specifications

### Layout: Card-Based Design
```
┌─────────────────────────────────────────────────────────────┐
│  PACKAGING                                                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐│
│  │  SCRIPT INPUT                                           ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │ [Paste Script]  [YouTube Link - Coming Soon]        │││
│  │  ├─────────────────────────────────────────────────────┤││
│  │  │                                                     │││
│  │  │  Textarea for podcast script...                     │││
│  │  │                                                     │││
│  │  └─────────────────────────────────────────────────────┘││
│  │                              [Generate All Assets] btn  ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │  TITLE               │  │  DESCRIPTION          │         │
│  │  ─────────────────   │  │  ─────────────────    │         │
│  │  Generated title...  │  │  Generated desc...    │         │
│  │                      │  │                       │         │
│  │  [↻] [📋] 45/100    │  │  [↻] [📋] 1200/5000  │         │
│  └──────────────────────┘  └──────────────────────┘         │
│                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐         │
│  │  THUMBNAIL DESC      │  │  YT SHORTS SCRIPT     │         │
│  │  ─────────────────   │  │  ─────────────────    │         │
│  │  Designer brief...   │  │  0:00-0:05 Hook...    │         │
│  │                      │  │  0:05-0:20 Point 1... │         │
│  │  [↻] [📋] 200/500   │  │  0:20-0:45 Point 2... │         │
│  └──────────────────────┘  │  0:45-0:60 CTA...     │         │
│                            │  [↻] [📋]             │         │
│                            └──────────────────────┘         │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  HOOKS                                                   ││
│  │  ─────────────────────────────────────────────────────  ││
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        ││
│  │  │Opening Line │ │Pattern Int. │ │CTA Hook     │        ││
│  │  │"Did you..." │ │"But wait..."│ │"Click now..│        ││
│  │  │[↻] [📋]    │ │[↻] [📋]    │ │[↻] [📋]    │        ││
│  │  └─────────────┘ └─────────────┘ └─────────────┘        ││
│  └─────────────────────────────────────────────────────────┘│
│                                                              │
│                                    [Save All to Database]    │
└─────────────────────────────────────────────────────────────┘
```

### Theme: Dark Creative
- Dark background (slate-900/950)
- Vibrant accent colors:
  - Primary: Purple (#8B5CF6 / violet-500)
  - Secondary: Blue (#3B82F6 / blue-500)
  - Success: Emerald (#10B981)
- Gradient accents on cards and buttons
- Subtle glow effects on interactive elements

### Character Limits Display
| Field | Limit | Display |
|-------|-------|---------|
| Title | 100 chars | `45/100` with color warning at 90%+ |
| Description | 5000 chars | `1200/5000` |
| Thumbnail Desc | 500 chars | `200/500` |
| Opening Hook | 280 chars | `150/280` |
| Pattern Interrupt | 280 chars | `120/280` |
| CTA Hook | 280 chars | `200/280` |
| YT Shorts Script | N/A | Show duration estimate |

---

## 4. Technical Architecture

### File Structure
```
src/
├── pages/
│   └── Packaging/
│       └── index.tsx              # Main page component
│
├── components/
│   └── packaging/
│       ├── ScriptInput.tsx        # Input section with tabs
│       ├── TitleCard.tsx          # Title output card
│       ├── DescriptionCard.tsx    # Description output card
│       ├── ThumbnailCard.tsx      # Thumbnail desc card
│       ├── HooksCard.tsx          # All 3 hooks in one card
│       ├── ShortsScriptCard.tsx   # YT Shorts timestamped script
│       ├── OutputCard.tsx         # Base reusable card component
│       └── SkeletonCard.tsx       # Loading skeleton
│
├── types/
│   └── feature/
│       └── packaging.ts           # Type definitions
│
├── utils/
│   └── feature/
│       ├── packaging/
│       │   ├── packaging.slice.ts # Redux slice
│       │   └── packaging.thunk.ts # Async thunks
│
├── service/
│   └── packaging.service.ts       # API service class
│
└── hooks/
    └── usePackaging.ts            # Feature hook
```

### Redux State Shape
```typescript
interface IPackagingState {
  // Input
  script: string;

  // Generated outputs
  title: {
    content: string;
    isLoading: boolean;
    error: string | null;
  };
  description: {
    content: string;
    isLoading: boolean;
    error: string | null;
  };
  thumbnailDescription: {
    content: string;
    isLoading: boolean;
    error: string | null;
  };
  hooks: {
    openingLine: string;
    patternInterrupt: string;
    ctaHook: string;
    isLoading: boolean;
    error: string | null;
  };
  shortsScript: {
    content: ITimestampedSegment[];
    isLoading: boolean;
    error: string | null;
  };

  // Meta
  isSaving: boolean;
  savedAt: string | null;
  packagingId: string | null; // DB record ID
}

interface ITimestampedSegment {
  startTime: string;  // "0:00"
  endTime: string;    // "0:15"
  content: string;
  type: 'hook' | 'point' | 'cta' | 'transition';
}
```

---

## 5. API Contracts

### Base URL
```
POST /api/packaging/{action}
```

### 5.1 Generate Title
```typescript
// POST /api/packaging/generate-title
interface GenerateTitleRequest {
  script: string;
  userId: string;
}

interface GenerateTitleResponse {
  title: string;
  characterCount: number;
}
```

### 5.2 Generate Description
```typescript
// POST /api/packaging/generate-description
interface GenerateDescriptionRequest {
  script: string;
  title?: string; // Optional: use generated title for context
  userId: string;
}

interface GenerateDescriptionResponse {
  description: string;
  characterCount: number;
}
```

### 5.3 Generate Thumbnail Description
```typescript
// POST /api/packaging/generate-thumbnail
interface GenerateThumbnailRequest {
  script: string;
  title?: string;
  userId: string;
}

interface GenerateThumbnailResponse {
  thumbnailDescription: string;
  characterCount: number;
}
```

### 5.4 Generate Hooks
```typescript
// POST /api/packaging/generate-hooks
interface GenerateHooksRequest {
  script: string;
  userId: string;
}

interface GenerateHooksResponse {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
}
```

### 5.5 Generate YT Shorts Script
```typescript
// POST /api/packaging/generate-shorts
interface GenerateShortsRequest {
  script: string;
  userId: string;
  maxDuration?: number; // seconds, default 60
}

interface GenerateShortsResponse {
  segments: ITimestampedSegment[];
  totalDuration: string; // "0:58"
}
```

### 5.6 Save Packaging
```typescript
// POST /api/packaging/save
interface SavePackagingRequest {
  userId: string;
  scriptId?: string; // If linked to existing script
  script: string;
  title: string;
  description: string;
  thumbnailDescription: string;
  hooks: {
    openingLine: string;
    patternInterrupt: string;
    ctaHook: string;
  };
  shortsScript: ITimestampedSegment[];
}

interface SavePackagingResponse {
  packagingId: string;
  savedAt: string;
}
```

### 5.7 Get Packaging (for edit/view)
```typescript
// GET /api/packaging/:id
interface GetPackagingResponse {
  packagingId: string;
  script: string;
  title: string;
  description: string;
  thumbnailDescription: string;
  hooks: {
    openingLine: string;
    patternInterrupt: string;
    ctaHook: string;
  };
  shortsScript: ITimestampedSegment[];
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. Component Specifications

### 6.1 ScriptInput Component
```typescript
interface ScriptInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

// Features:
// - Tab toggle: "Paste Script" | "YouTube Link (Coming Soon)"
// - Large textarea with placeholder
// - Word count display
// - "Generate All Assets" primary button
// - Disabled YouTube input with badge
```

### 6.2 OutputCard Component (Base)
```typescript
interface OutputCardProps {
  title: string;
  content: string;
  isLoading: boolean;
  error?: string;
  characterLimit?: number;
  onRegenerate: () => void;
  onCopy: () => void;
  onEdit?: (newContent: string) => void;
  editable?: boolean;
}

// Features:
// - Card header with title
// - Content area (skeleton when loading)
// - Footer with: regenerate btn, copy btn, char count
// - Inline edit mode toggle
// - Error state display
```

### 6.3 HooksCard Component
```typescript
interface HooksCardProps {
  openingLine: string;
  patternInterrupt: string;
  ctaHook: string;
  isLoading: boolean;
  onRegenerateAll: () => void;
  onRegenerateOne: (hookType: 'opening' | 'pattern' | 'cta') => void;
  onCopy: (hookType: 'opening' | 'pattern' | 'cta') => void;
}

// Features:
// - 3 mini-cards inside for each hook type
// - Individual regenerate/copy per hook
// - "Regenerate All Hooks" option
```

### 6.4 ShortsScriptCard Component
```typescript
interface ShortsScriptCardProps {
  segments: ITimestampedSegment[];
  isLoading: boolean;
  onRegenerate: () => void;
  onCopy: () => void;
}

// Features:
// - Timestamped segments list
// - Color-coded segment types
// - Total duration display
// - Copy full script button
```

---

## 7. User Flows

### Flow 1: Generate All Assets
```
1. User pastes podcast script in textarea
2. User clicks "Generate All Assets"
3. All cards show skeleton loaders simultaneously
4. API calls fire in parallel:
   - generateTitle()
   - generateDescription()
   - generateThumbnail()
   - generateHooks()
   - generateShorts()
5. Each card updates as its API resolves
6. User reviews all generated content
7. User clicks "Save All" to persist
```

### Flow 2: Regenerate Single Field
```
1. User is unhappy with generated title
2. User clicks regenerate (↻) on Title card
3. Only Title card shows skeleton
4. Title API re-called
5. Title updates, other fields unchanged
```

### Flow 3: Edit Before Save
```
1. User wants to tweak description
2. User clicks on description content (inline edit)
3. Textarea appears with current content
4. User edits, sees live character count
5. User clicks outside or presses Enter to save edit
6. Content updates locally
7. User clicks "Save All" to persist changes
```

---

## 8. Implementation Phases

### Phase 1: Foundation
- [ ] Create route `/app/packaging` in route.tsx
- [ ] Create Packaging page component
- [ ] Set up Redux slice and types
- [ ] Create packaging service (empty API calls with TODOs)

### Phase 2: Input Section
- [ ] Build ScriptInput component
- [ ] Implement paste functionality
- [ ] Add YouTube link tab (disabled)
- [ ] Add "Generate All Assets" button

### Phase 3: Output Cards
- [ ] Build base OutputCard component
- [ ] Build TitleCard, DescriptionCard, ThumbnailCard
- [ ] Build HooksCard with 3 sub-sections
- [ ] Build ShortsScriptCard with timestamps

### Phase 4: Loading & Animations
- [ ] Create SkeletonCard component
- [ ] Implement skeleton loading states
- [ ] Add transitions and micro-animations

### Phase 5: Functionality
- [ ] Wire up Redux thunks to components
- [ ] Implement regenerate per field
- [ ] Implement copy to clipboard (with toast)
- [ ] Implement inline editing
- [ ] Add character count warnings

### Phase 6: Persistence
- [ ] Implement Save All functionality
- [ ] Add save confirmation toast
- [ ] Handle save errors

### Phase 7: Polish
- [ ] Dark creative theme styling
- [ ] Responsive design
- [ ] Accessibility (keyboard nav, screen readers)
- [ ] Error states and recovery

---

## 9. Design Tokens (Dark Creative Theme)

```css
/* Colors */
--bg-primary: #0f172a;      /* slate-900 */
--bg-secondary: #1e293b;    /* slate-800 */
--bg-card: #1e293b;         /* slate-800 */
--bg-card-hover: #334155;   /* slate-700 */

--text-primary: #f8fafc;    /* slate-50 */
--text-secondary: #94a3b8;  /* slate-400 */
--text-muted: #64748b;      /* slate-500 */

--accent-primary: #8B5CF6;  /* violet-500 */
--accent-secondary: #3B82F6;/* blue-500 */
--accent-gradient: linear-gradient(135deg, #8B5CF6, #3B82F6);

--success: #10B981;         /* emerald-500 */
--warning: #F59E0B;         /* amber-500 */
--error: #EF4444;           /* red-500 */

--border: #334155;          /* slate-700 */
--border-focus: #8B5CF6;    /* violet-500 */

/* Shadows */
--shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
--shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);

/* Spacing */
--gap-cards: 1.5rem;
--padding-card: 1.5rem;
--radius-card: 0.75rem;
```

---

## 10. Open Questions / Future Considerations

1. **History View:** Should we show past packaging sessions in a sidebar/list?
2. **Templates:** Pre-built prompt templates for different content types?
3. **A/B Testing:** Generate multiple title options for A/B testing?
4. **Analytics:** Track which generated content performs best?
5. **Export:** Export all assets as a single PDF/document?
6. **AI Prompt Tuning:** Allow users to influence generation style?

---

## 11. Dependencies

### New Packages (if needed)
- None required - using existing stack

### Existing Stack Used
- Tailwind CSS (styling)
- Radix UI (accessible primitives)
- Redux Toolkit (state)
- Axios (API calls)
- Sonner (toast notifications)
- Lucide React (icons)

---

## 12. Success Metrics

- [ ] User can paste script and generate all 5 asset types
- [ ] Each field regenerates independently
- [ ] Copy to clipboard works with success toast
- [ ] Inline editing with character limits
- [ ] Save to database persists all content
- [ ] Loading skeletons for smooth UX
- [ ] Dark creative theme matches design spec
- [ ] Responsive on tablet and desktop

---

*Document maintained by: Development Team*
*Last updated: 2026-02-07*
