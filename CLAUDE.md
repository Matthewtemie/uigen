# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator with live preview. Users describe components in a chat interface, and Claude generates React/JSX code that renders in real-time in a sandboxed iframe. Components live in a virtual file system (nothing written to disk).

## Commands

```bash
npm run setup          # Install deps + generate Prisma client + run migrations
npm run dev            # Dev server with Turbopack (http://localhost:3000)
npm run build          # Production build
npm run lint           # ESLint (extends next)
npm test               # Vitest (all tests)
npx vitest run <path>  # Run a single test file
npm run db:reset       # Reset SQLite database
```

## Architecture

### Request Flow

1. User sends a message in the chat UI (left panel)
2. `ChatProvider` (`src/lib/contexts/chat-context.tsx`) sends it to `POST /api/chat` via Vercel AI SDK's `useChat`
3. The API route (`src/app/api/chat/route.ts`) reconstructs the `VirtualFileSystem` from serialized client state, attaches the system prompt, and calls `streamText` with two tools: `str_replace_editor` and `file_manager`
4. Tool calls stream back to the client where `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) applies them to the client-side VFS
5. `PreviewFrame` re-renders on every VFS change: Babel transforms JSX files into blob URLs, builds an import map, and writes an HTML document into a sandboxed iframe via `srcdoc`

### Key Subsystems

- **Virtual File System** (`src/lib/file-system.ts`): In-memory FS with `Map<string, FileNode>`. Supports create/read/update/delete/rename, serialization for network transport, and text-editor operations (view with line numbers, str_replace, insert). Used on both server (tool execution) and client (state management).

- **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`): Uses `@babel/standalone` to transform JSX/TSX to JS. Builds an import map with blob URLs for local files and `esm.sh` URLs for third-party packages. Handles `@/` import aliases.

- **AI Tools** (`src/lib/tools/`): Two tools exposed to the LLM:
  - `str_replace_editor`: view, create, str_replace, insert operations on files
  - `file_manager`: rename and delete operations

- **Mock Provider** (`src/lib/provider.ts`): When `ANTHROPIC_API_KEY` is not set, a `MockLanguageModel` returns static component code (counter/form/card) to allow development without API access. Uses `claude-haiku-4-5` when a key is present.

- **Auth**: JWT sessions via `jose` stored in httpOnly cookies. Server actions in `src/actions/index.ts` handle signUp/signIn/signOut. Middleware protects `/api/projects` and `/api/filesystem` routes.

- **Persistence**: Prisma + SQLite (`prisma/schema.prisma`). Projects store messages and VFS data as JSON strings. Anonymous users get an ephemeral session; authenticated users get persisted projects.

### Routing

- `/` — Anonymous workspace or redirect to most recent project (authenticated)
- `/[projectId]` — Load a saved project (requires auth)
- `/api/chat` — Streaming chat endpoint

### UI Layout

`MainContent` (`src/app/main-content.tsx`) is the main shell: resizable left panel (chat) and right panel (preview/code toggle). Code view has a nested resizable split with FileTree and CodeEditor (Monaco). UI components use shadcn/ui (new-york style) with Tailwind CSS v4.

## Tech Stack

- Next.js 15 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui (new-york style, `@/components/ui/`)
- Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)
- Prisma + SQLite, `@babel/standalone`, Monaco Editor
- Vitest + jsdom + React Testing Library

## Conventions

- Path alias: `@/*` maps to `./src/*`
- Generated components use `@/` imports in the virtual FS (e.g., `@/components/Foo`)
- Every generated project must have a root `/App.jsx` as entrypoint
- Server actions live in `src/actions/`
- Prisma client output is at `src/generated/prisma`
- The database schema is defined in `prisma/schema.prisma` — always reference it to understand the structure of data stored in the database.
