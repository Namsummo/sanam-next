# Coding conventions — sanam-next

## 1. Tech & Commands

-Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4.
-UI: @base-ui/react, CVA, lucide-react. Merge classes with cn() (@/lib/utils).

```bash
pnpm dev
pnpm lint    # bắt buộc pass trước merge
pnpm build   # bắt buộc pass trước merge
```

---

## 2. Code Style

-Follow ESLint. Do not disable rules without a comment explaining why.
-One file, one responsibility; split if over 500 lines.
-No any (use unknown + narrow).
-Max 3 levels of nesting for if / for / try.
-Code names & comments: English. UI copy/metadata: Vietnamese is fine.

**Export**

-Components / utils: export function (named).
-Only page.tsx, layout.tsx, not-found.tsx may use export default.

---

## 3. React & Next.js

- Server Component by default. "use client" only when state, effects, or browser APIs are needed.
- Fetching: Server Components / Server Actions; avoid useEffect + fetch unless necessary.
- Images: next/image. Internal links: next/link.
- Metadata: export const metadata or generateMetadata on page.tsx.
- Imports use the @/ alias → src/.

---

## 4. Naming

- Route folder: kebab-case (`introduce/`, `worship/`).
- File component: kebab-case (`site-header.tsx`).
- Export component / type: PascalCase (`SiteHeader`, `NavLink`).
- Functions, variables: camelCase (isSiteNavActive).
- Asset `public/images/`: kebab-case (`logo.svg`).

---

## 5. Do Nots

- No jQuery or inline scripts from HTML templates.
- No new CSS Modules (use Tailwind + globals.css).
- No hardcoded hex colors in JSX when a token already exists.
- No useContext in shared UI — put providers in layouts or pass via props.
- No PRs mixing multiple unrelated goals.
- No page without a header (the (site) layout or not-found.tsx must include a header).

---

## 6. Git

Branches: feature/[ticket]-description · bug/... · chore/...
Commits: [ticket] Short description, imperative mood
PRs: single goal; pnpm lint + pnpm build must pass; include a screenshot if the UI changes.

---

## 7. Before Merging

- [ ] `pnpm lint` · `pnpm build`
- [ ] `"use client"` only when necessary
- [ ] Colors/fonts via tokens (globals.css / Tailwind utilities)
- [ ] Ảnh: `public/images/` + `next/image`

---
