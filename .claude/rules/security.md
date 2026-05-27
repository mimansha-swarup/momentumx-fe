---
name: security
description: Security constraints for MomentumX frontend — token handling, content rendering, and API safety.
---

# Security Constraints

Applies globally. These rules prevent credential leaks, XSS, and common frontend vulnerabilities.

---

## Token and Secret Storage

- **Never store auth tokens in `localStorage` or `sessionStorage`** — they are accessible to any JavaScript on the page
- Firebase ID tokens are managed entirely by the Firebase SDK and injected by `baseFetch`'s request interceptor — do not touch them manually
- Never log tokens, API keys, or user credentials anywhere in code

---

## No dangerouslySetInnerHTML

Do not render user-generated content as raw HTML. It opens XSS attack vectors.

```tsx
// ❌ Never
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Render as text or use a sanitized Markdown renderer
<MarkdownRenderer content={userContent} />
<p>{userContent}</p>
```

---

## API Keys and Environment Variables

- API keys and Firebase config values must never appear in source files
- Access them only via `import.meta.env.VITE_*` at runtime
- Never commit `.env` files — they are gitignored
- The `VITE_` prefix is required for Vite to expose variables to the client — do not expose server secrets this way

---

## External Data Validation

Validate and type-narrow all data received from external sources at the boundary where it enters the app (service layer). Never assume API response shapes are correct at the component level.

---

## HTTPS

All API calls go through `baseFetch`, which uses `VITE_API_URL` as its base. That URL must always be an `https://` address in production. Never hardcode `http://` production URLs.

---

## No eval / Function Constructor

```typescript
// ❌ Never
eval(userInput);
new Function(userInput)();

// These allow arbitrary code execution and have no valid use case here.
```

---

## CORS

CORS is configured and enforced server-side. Do not attempt to bypass it client-side (e.g., proxy hacks, disabling security headers in dev tools). If a CORS error occurs, fix it in the backend.

---

## Firebase Auth Interceptor

Firebase auth tokens are attached to every outbound request by the `baseFetch` interceptor in `src/utils/network.ts`. This is the single, authoritative place for auth token injection. Do not replicate this logic elsewhere or pass tokens manually in component code.
