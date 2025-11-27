# MERN AI Agent

Full-stack AI content generation application using MERN stack (MongoDB, Express, React, Node.js) with OpenAI GPT-4o-mini. Generates blog post outlines, product descriptions, and social media captions through an asynchronous queue-based system.

## Features

- JWT-based authentication
- AI content generation (blog outlines, product descriptions, social media captions)
- Queue-based async processing with Bull/Redis
- Real-time job status polling
- Conversation management with markdown rendering

## Tech Stack

**Backend**: Node.js, Express, TypeScript, MongoDB, Bull/Redis, OpenAI API, JWT, TypeDI, routing-controllers

**Frontend**: React, TypeScript, Vite, Redux Toolkit, Redux Saga, React Router, Radix UI, Tailwind CSS, Axios, react-markdown

**Infrastructure**: Redis, pnpm, Docker Compose

## Prerequisites

- Node.js v18+
- pnpm v10.15.1+
- MongoDB (local or connection string)
- Redis (local or Docker)
- OpenAI API Key

## Setup

### Backend

```bash
cd backend
pnpm install
```

Create `.env`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/mern-ai-agent
JWT_SECRET=your-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

Start Redis:

```bash
docker-compose up -d
```

Start server (Terminal 1):

```bash
pnpm dev
```

Start worker (Terminal 2):

```bash
pnpm start:worker
```

### Frontend

```bash
cd frontend
pnpm install
```

Create `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

Start dev server:

```bash
pnpm dev
```

## API Endpoints

All endpoints prefixed with `/api/v1`.

### Authentication

- `POST /auth/register` - Register user (name, username, password)
- `POST /auth/login` - Login (username, password) → returns user + token
- `GET /auth/me` - Get current user (requires JWT)

### Content Generation

- `POST /generate-content` - Generate content (requires JWT)

  - Body: `{ prompt: string, contentType: "BLOG_POST_OUTLINE" | "PRODUCT_DESCRIPTION" | "SOCIAL_MEDIA_CAPTION" }`
  - Returns: `{ jobId: string }` (202 Accepted)

- `GET /content/:jobId/status` - Get job status

  - Returns: `{ jobId, state, progress, result?: { conversation } }`

- `GET /conversations` - Get all user conversations (requires JWT)
- `GET /conversations/:conversationId` - Get single conversation (requires JWT)

## Architecture

**Queue-Based Processing**: Bull/Redis queue handles async AI generation. Jobs enqueued immediately, processed by separate worker (concurrency: 5, retries: 3). Frontend polls status every 2s.

**State Management**: Redux Toolkit + Redux Saga for predictable state and complex async flows (polling, API calls).

**AI Model**: GPT-4o-mini for cost-effectiveness and speed. Temperature: 1. Custom system prompts per content type.

**TypeScript**: Full type safety across stack for better maintainability and IDE support.

**Backend**: routing-controllers with TypeDI for decorator-based APIs and dependency injection.

**Frontend**: Component-based architecture (PromptBox, ConversationsList) for reusability and separation of concerns.

**Polling vs WebSockets**: HTTP polling chosen for simplicity, statelessness, and reliability. 2s interval provides near real-time updates.

## Environment Variables

**Backend**: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`

**Frontend**: `VITE_API_BASE_URL` (default: `http://localhost:4000/api/v1`)

## Production

**Backend**: `pnpm build && pnpm start` (server) + `pnpm start:worker` (worker)

**Frontend**: `pnpm build && pnpm preview`

## Notes

- Worker must run separately from main server
- JWT tokens stored in localStorage
- Jobs have 60s delay before processing
- Max conversation messages: 5 (configurable in `backend/src/config/index.ts`)
