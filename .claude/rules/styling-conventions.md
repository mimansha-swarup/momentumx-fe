---
name: styling-conventions
description: Visual design conventions for MomentumX — Tailwind patterns, CSS variables, design tokens, glass morphism, and gradient system.
paths:
  - "src/components/**/*"
  - "src/pages/**/*"
  - "src/index.css"
  - "src/lib/utils.ts"
---

# Styling Conventions

## Must Follow

- Never hardcode color values — always use CSS variable classes (`text-foreground`, `bg-secondary`, `border-border`, etc.)
- No inline styles — use Tailwind classes; exception: dynamic values that cannot be expressed as Tailwind classes (e.g., `style={{ width: \`${progress}%\` }}`)
- Always use `cn()` from `@/lib/utils` for conditional or merged class names — never string concatenation
- Mobile-first: write base (mobile) styles first, then layer `md:` and `lg:` breakpoints
- Avoid arbitrary Tailwind values (e.g., `p-[22px]`) — use the default spacing scale
- Icons use Lucide React; size via `h-4 w-4`, `h-5 w-5`, `h-6 w-6`
- Loading spinners use `<Loader2 className="animate-spin" />` from Lucide
- The primary visual pattern is dark glass morphism: `bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl`
- Primary action buttons use the purple-to-blue gradient: `bg-gradient-to-r from-purple-500 to-blue-500`
- Always add `transition-colors duration-200` or `transition-all duration-200` when state changes affect visuals

> For the full design token reference, glass card variants, button patterns, and typography scale, see the `ui-design-system` skill.
