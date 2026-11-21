<h1 align="left">
  <img src="public/logo.webp" alt="CabreraJorge logo" width="60" align="absmiddle"> CabreraJorge
</h1>

> Personal Infrastructure

[![License](https://img.shields.io/badge/License-MIT-3178C6.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Pnpm](https://img.shields.io/badge/pnpm-Package%20Manager-EFEFEF?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Hono](https://img.shields.io/badge/Hono-Framework-F38020?logo=hono&logoColor=white)](https://hono.dev)
[![Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflareworkers&logoColor=white)](https://workers.cloudflare.com)
[![Biome](https://img.shields.io/badge/Biome-Lint%20%26%20Format-EFEFEF?logo=biome&logoColor=white)](https://biomejs.dev)

---

## About

Personal site and infrastructure of Jorge Cabrera, live at [cabrerajorge.com](https://cabrerajorge.com). A server-rendered landing built with Hono and deployed on Cloudflare Workers — no framework bloat, minimal client-side JS (HTMX for interactivity).

## Features

- Server-rendered pages with typed JSX (Hono) and HTMX for dynamic bits.
- Styling with Tailwind CSS 4 and daisyUI, compiled at build time.
- Deploys to Cloudflare Workers as a single minimal Worker with static assets.

## Stack

- **Hono** — Lightweight, fast server framework with typed JSX.
- **PNPM** — Fast, strict package manager with a tight, reproducible lockfile.
- **TypeScript** — Static typing across the app, giving end-to-end type safety.
- **Cloudflare Workers** — Serverless compute on V8 isolates at the edge.
- **Tailwind CSS 4 + DaisyUI** — Utility-first styling with ready components.
- **Biome** — Lint and format in one fast, consistent tool.

## Getting Started

```bash
pnpm install          # install dependencies
cp .env.example .env  # set up environment variables
pnpm dev              # dev server at localhost:3001
```

Deploy to Cloudflare:

```bash
pnpm deploy
```

## Roadmap

- [ ] Backend API with Better Auth, Drizzle ORM, oRPC and D1 at `api.cabrerajorge.com`.
- [ ] Personal MCP server: agents feed on their own data, stored per-user in D1.
- [ ] Monorepo with Turborepo + pnpm (`apps/backend`, `apps/private`).
- [ ] Private app with TanStack Start at `app.cabrerajorge.com`.

---

## License

MIT © 2026 Jorge Cabrera — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built by <a href="https://cabrerajorge.com">Jorge Cabrera</a>
</p>
