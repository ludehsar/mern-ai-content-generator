# MERN AI Agent

A full-stack AI-powered content generation application built with the MERN stack (MongoDB, Express, React, Node.js). This application enables users to generate various types of content using OpenAI's GPT-4o-mini model, including blog post outlines, product descriptions, and social media captions.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Architectural Decisions](#architectural-decisions)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

## Project Overview

MERN AI Agent is a web application that leverages artificial intelligence to help users generate high-quality content. The application uses a queue-based architecture to handle AI content generation asynchronously, ensuring a responsive user experience even during long-running AI operations.

### Key Features

- **User Authentication**: Secure JWT-based authentication system
- **AI Content Generation**: Generate content using OpenAI's GPT-4o-mini model
- **Multiple Content Types**: Support for blog post outlines, product descriptions, and social media captions
- **Real-time Status Updates**: Poll-based job status tracking for content generation
- **Conversation Management**: View and manage all generated conversations
- **Markdown Rendering**: Beautiful markdown rendering for generated content

## Tech Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB (via Mongoose 9.0.0)
- **Queue System**: Bull 4.16.5 with Redis (ioredis 5.8.2)
- **Authentication**: JWT (jsonwebtoken 9.0.2) with Passport.js
- **AI Integration**: OpenAI API (openai 6.9.1)
- **Dependency Injection**: TypeDI 0.10.0
- **Validation**: class-validator 0.14.3
- **API Framework**: routing-controllers 0.11.3

### Frontend

- **Framework**: React 19.2.0 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit 2.11.0 with Redux Saga 1.4.2
- **Routing**: React Router 7.9.6
- **UI Components**: Radix UI with Tailwind CSS 4.1.17
- **HTTP Client**: Axios 1.13.2
- **Markdown Rendering**: react-markdown 10.1.0
- **Form Handling**: React Hook Form 7.66.1 with Zod 4.1.13

### Infrastructure

- **Queue Broker**: Redis
- **Package Manager**: pnpm 10.15.1
- **Containerization**: Docker Compose (for Redis)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v10.15.1 or higher)
- **MongoDB** (running locally or connection string)
- **Redis** (running locally or via Docker)
- **OpenAI API Key** (from [OpenAI Platform](https://platform.openai.com/))

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory with the following variables:

   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/mern-ai-agent
   JWT_SECRET=your-secret-jwt-key-here
   OPENAI_API_KEY=your-openai-api-key-here
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=your-redis-password-here
   ```

4. **Start Redis (using Docker Compose):**

   ```bash
   docker-compose up -d
   ```

   Or start Redis manually if you have it installed locally.

5. **Start the backend server:**

   ```bash
   pnpm dev
   ```

   The server will start on `http://localhost:4000`

6. **Start the worker process (in a separate terminal):**
   ```bash
   pnpm start:worker
   ```
   This process handles the queue jobs for content generation.

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_API_BASE_URL=http://localhost:4000/api/v1
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```
   The frontend will start on `http://localhost:5173` (or another port if 5173 is occupied)

## API Documentation

All API endpoints are prefixed with `/api/v1`.

### Authentication Endpoints

#### Register User

- **Endpoint**: `POST /api/v1/auth/register`
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "...",
        "name": "John Doe",
        "username": "johndoe"
      },
      "token": "jwt-token-here"
    }
  }
  ```

#### Login

- **Endpoint**: `POST /api/v1/auth/login`
- **Authentication**: Not required
- **Request Body**:
  ```json
  {
    "username": "johndoe",
    "password": "securepassword123"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "...",
        "name": "John Doe",
        "username": "johndoe"
      },
      "token": "jwt-token-here"
    }
  }
  ```

#### Get Current User

- **Endpoint**: `GET /api/v1/auth/me`
- **Authentication**: Required (JWT Bearer token)
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "...",
        "name": "John Doe",
        "username": "johndoe"
      }
    }
  }
  ```

### Content Generation Endpoints

#### Generate Content

- **Endpoint**: `POST /api/v1/generate-content`
- **Authentication**: Required (JWT Bearer token)
- **Request Body**:
  ```json
  {
    "prompt": "Write about SOLID principles",
    "contentType": "BLOG_POST_OUTLINE"
  }
  ```
- **Content Types**: `BLOG_POST_OUTLINE`, `PRODUCT_DESCRIPTION`, `SOCIAL_MEDIA_CAPTION`
- **Response** (202 Accepted):
  ```json
  {
    "status": "success",
    "statusCode": 202,
    "data": {
      "jobId": "123"
    }
  }
  ```

#### Get Job Status

- **Endpoint**: `GET /api/v1/content/:jobId/status`
- **Authentication**: Not required
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "jobId": "123",
      "state": "completed",
      "progress": 100,
      "data": {
        "userId": "...",
        "prompt": "Write about SOLID principles",
        "contentType": "BLOG_POST_OUTLINE"
      },
      "result": {
        "conversation": {
          "_id": "...",
          "userId": "...",
          "title": "Untitled Conversation",
          "contentType": "BLOG_POST_OUTLINE",
          "messages": [...]
        }
      }
    }
  }
  ```

#### Get All Conversations

- **Endpoint**: `GET /api/v1/conversations`
- **Authentication**: Required (JWT Bearer token)
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "conversations": [
        {
          "_id": "...",
          "userId": "...",
          "title": "Untitled Conversation",
          "contentType": "BLOG_POST_OUTLINE",
          "messages": [...],
          "createdAt": "...",
          "updatedAt": "..."
        }
      ]
    }
  }
  ```

#### Get Single Conversation

- **Endpoint**: `GET /api/v1/conversations/:conversationId`
- **Authentication**: Required (JWT Bearer token)
- **Response**:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "data": {
      "conversation": {
        "_id": "...",
        "userId": "...",
        "title": "Untitled Conversation",
        "contentType": "BLOG_POST_OUTLINE",
        "messages": [...],
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
  }
  ```

## Architectural Decisions

### 1. Queue-Based Architecture for AI Content Generation

**Decision**: Implemented a queue-based system using Bull and Redis for handling AI content generation.

**Rationale**:

- **Asynchronous Processing**: AI content generation can take several seconds. Using a queue prevents blocking the main API thread and provides better scalability.
- **Reliability**: Queue systems provide job retry mechanisms, failure handling, and job persistence.
- **Scalability**: Multiple worker processes can process jobs concurrently, allowing horizontal scaling.
- **User Experience**: Users receive immediate feedback (job ID) and can poll for status, rather than waiting for the entire generation process.

**Implementation**:

- Jobs are enqueued immediately when requested
- A separate worker process handles job execution
- Frontend polls the status endpoint every 2 seconds until completion
- Jobs are processed with a concurrency of 5 and retry up to 3 times on failure

### 2. Redux Toolkit with Redux Saga

**Decision**: Used Redux Toolkit for state management with Redux Saga for side effects.

**Rationale**:

- **Predictable State Management**: Redux provides a single source of truth and predictable state updates.
- **Complex Async Logic**: Redux Saga's generator functions make complex async flows (like polling) more readable and testable.
- **Separation of Concerns**: Sagas handle all API calls and side effects, keeping components clean.
- **Middleware Pattern**: Saga's middleware pattern allows for centralized error handling and request cancellation.

**Implementation**:

- Auth saga handles login, registration, and user fetching
- Conversation saga handles content generation, polling, and conversation fetching
- Polling is implemented using saga's `delay` and `call` effects

### 3. OpenAI GPT-4o-mini Model

**Decision**: Selected GPT-4o-mini as the AI model for content generation.

**Rationale**:

- **Cost-Effectiveness**: GPT-4o-mini provides excellent performance at a fraction of the cost of GPT-4.
- **Speed**: Faster response times compared to larger models, improving user experience.
- **Quality**: Sufficient quality for content generation tasks like outlines, descriptions, and captions.
- **Temperature Setting**: Set to 1 for creative and varied outputs while maintaining coherence.

**Implementation**:

- System prompts are customized for each content type (blog outlines, product descriptions, social media captions)
- Messages are structured with system, user, and assistant roles
- Responses are stored in MongoDB for future reference

### 4. TypeScript Throughout the Stack

**Decision**: Use TypeScript for both frontend and backend.

**Rationale**:

- **Type Safety**: Catches errors at compile time, reducing runtime bugs.
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation.
- **Self-Documenting Code**: Types serve as inline documentation.
- **Maintainability**: Easier to maintain and scale large codebases.

### 5. Routing Controllers Framework

**Decision**: Used routing-controllers for backend API structure.

**Rationale**:

- **Decorator-Based**: Clean, declarative API definitions using decorators.
- **Dependency Injection**: Integrated with TypeDI for clean dependency management.
- **Validation**: Built-in class-validator integration for request validation.
- **Type Safety**: Full TypeScript support with decorators.

### 6. Component-Based UI Architecture

**Decision**: Separated dashboard into reusable components (PromptBox, ConversationsList).

**Rationale**:

- **Reusability**: Components can be reused across different parts of the application.
- **Maintainability**: Easier to maintain and test individual components.
- **Separation of Concerns**: Each component has a single responsibility.
- **Clean Code**: Keeps the main DashboardPage component clean and focused.

### 7. HTTP Polling Instead of WebSockets

**Decision**: Implemented HTTP polling for job status updates instead of WebSockets.

**Rationale**:

- **Simplicity**: Easier to implement and debug compared to WebSocket connections.
- **Stateless**: No need to maintain persistent connections, reducing server load.
- **Reliability**: HTTP requests are more reliable and easier to handle errors.
- **Scalability**: No connection state management required on the server.
- **Polling Interval**: 2-second intervals provide near real-time updates without excessive server load.

**Trade-offs**:

- Slightly higher network overhead compared to WebSockets
- Small delay in status updates (up to 2 seconds)

## Project Structure

```
mern-ai-agent/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── constants/        # Error codes and exceptions
│   │   ├── middlewares/      # Express middlewares
│   │   ├── models/           # Data models and DTOs
│   │   ├── queue/            # Queue system implementation
│   │   │   ├── BaseQueue.ts
│   │   │   ├── ContentGenerationQueue.ts
│   │   │   ├── ContentGenerationProcessor.ts
│   │   │   └── QueueService.ts
│   │   ├── server/
│   │   │   ├── auth/         # Authentication controllers and services
│   │   │   └── contents/     # Content generation controllers and services
│   │   ├── strategies/       # Passport strategies
│   │   ├── App.ts            # Express app setup
│   │   ├── index.ts          # Entry point
│   │   └── worker.ts         # Queue worker process
│   ├── docker-compose.yml    # Redis setup
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/              # API client functions
    │   ├── components/       # React components
    │   │   ├── dashboard/    # Dashboard-specific components
    │   │   ├── forms/        # Form components
    │   │   └── ui/           # Reusable UI components
    │   ├── lib/              # Utility functions
    │   ├── pages/            # Page components
    │   ├── store/            # Redux store
    │   │   ├── sagas/        # Redux sagas
    │   │   └── slices/       # Redux slices
    │   ├── types/            # TypeScript type definitions
    │   └── App.tsx           # Main app component
    └── package.json
```

## Environment Variables

### Backend (.env)

| Variable         | Description               | Default     | Required |
| ---------------- | ------------------------- | ----------- | -------- |
| `PORT`           | Server port               | `4000`      | No       |
| `MONGODB_URI`    | MongoDB connection string | -           | Yes      |
| `JWT_SECRET`     | Secret key for JWT tokens | -           | Yes      |
| `OPENAI_API_KEY` | OpenAI API key            | -           | Yes      |
| `REDIS_HOST`     | Redis host                | `localhost` | No       |
| `REDIS_PORT`     | Redis port                | `6379`      | No       |
| `REDIS_PASSWORD` | Redis password            | -           | Yes      |

### Frontend (.env)

| Variable            | Description          | Default                        | Required |
| ------------------- | -------------------- | ------------------------------ | -------- |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:4000/api/v1` | No       |

## Running the Application

### Development Mode

1. **Start Redis:**

   ```bash
   cd backend
   docker-compose up -d
   ```

2. **Start Backend (Terminal 1):**

   ```bash
   cd backend
   pnpm dev
   ```

3. **Start Worker (Terminal 2):**

   ```bash
   cd backend
   pnpm start:worker
   ```

4. **Start Frontend (Terminal 3):**
   ```bash
   cd frontend
   pnpm dev
   ```

### Production Mode

1. **Build Backend:**

   ```bash
   cd backend
   pnpm build
   ```

2. **Start Backend:**

   ```bash
   pnpm start
   ```

3. **Start Worker:**

   ```bash
   pnpm start:worker
   ```

4. **Build Frontend:**

   ```bash
   cd frontend
   pnpm build
   ```

5. **Preview Frontend:**
   ```bash
   pnpm preview
   ```

## Additional Notes

- The worker process must be running separately from the main server to process queue jobs.
- Ensure MongoDB and Redis are running before starting the application.
- The application uses JWT tokens stored in localStorage for authentication.
- Content generation jobs have a default delay of 60 seconds before processing.
- Maximum conversation message limit is set to 5 (configurable in `backend/src/config/index.ts`).

## License

ISC
