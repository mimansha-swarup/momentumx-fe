---
name: Service Layer & Network Audit — 2026-04-17
description: Findings from strict audit of src/service/, src/utils/network.ts, src/utils/firebase/
type: project
---

Service layer audit conducted 2026-04-17. No build errors, no lint errors. 11 lint warnings (all outside service layer). Key issues found:

**Critical:**
- network.ts:4 — hardcoded `return "http://localhost:3000"` makes `getApiDomain()` dead-code below it; entire env-switch logic and isLongResponse param are unreachable. Production domain is never used.
- network.ts:4 — HTTP (not HTTPS) hardcoded; SSE calls via getApiDomain(true) also resolve to http://localhost:3000

**High:**
- onboarding.ts:50-52 — `getUserRecord()` untyped return (no Promise<IBaseFetchResponse<T>>)
- onboarding.ts:55-67 — `saveOnboardingData()` and `updateProfile()` call `handleToast()` inside service — concern mixing, wrong layer
- onboarding.ts:55-67 — both mutation methods return `any` (no typed return)
- packaging.ts:99-128 — `generateTitleDependentContent()` returns bare object (not IBaseFetchResponse<T>), loses message/warning/statusCode; callers cannot call handleToast()

**Medium:**
- titles.ts:41 — `generateTitles` arrow function breaks singleton method consistency (mix of arrow and async methods in same class)
- network.ts:26 — `apiDomain` module-level constant calls `getApiDomain()` at import time; after the early return fix, `baseFetch` will hardcode the domain at import time — dynamic domain switching per-call is not possible without refactoring
- script.ts:35-38 — SSE token passed as plain query param in URL; token visible in server logs and browser history. Acceptable per EventSource API limitation but should be documented clearly

**Why:** hardcoded localhost will cause production outage when the early return is removed without updating env vars.
**How to apply:** flag network.ts:4 as the highest-priority fix before any production deploy.
