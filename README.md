# Project Management App

A full-stack project management application similar to Jira/Trello, built with Next.js and Express.

## Tech Stack

**Frontend**
- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4 (dark mode support)
- Redux Toolkit + RTK Query
- AWS Amplify (authentication)
- react-dnd (drag & drop)
- Recharts (data visualization)

**Backend**
- Express 5
- TypeScript
- Prisma 7 ORM
- PostgreSQL

**Infrastructure**
- AWS Cognito (auth)
- AWS S3 (file storage)

## Features

- **Boards**: Kanban-style project boards with drag-and-drop task management
- **Sprints**: Sprint planning with timeline and table views
- **Tasks**: Full task lifecycle with status, priority, points, dates, subtasks
- **Comments**: Task discussions with @mentions and emoji reactions
- **Search**: Global search across projects, tasks, and users
- **Tags**: Customizable color-coded labels
- **Activity Tracking**: Task history and audit trail
- **Dark Mode**: Full dark theme support

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS account (for Cognito and S3)

### Environment Setup

**Client** (`client/.env.local`):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_USER_POOL_ID=your_pool_id
```

**Server** (`server/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
PORT=8000
```

### Installation

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Set up database
npx prisma migrate dev
npm run seed
```

### Running the App

```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm run dev
```

Client runs on `http://localhost:3000`, server on `http://localhost:8000`.

## Project Structure

```
├── client/
│   ├── app/              # Next.js pages and layouts
│   ├── components/       # Reusable UI components
│   ├── state/            # Redux store and RTK Query API
│   └── lib/              # Utility functions
│
└── server/
    ├── src/
    │   ├── controllers/  # Request handlers
    │   └── routes/       # API route definitions
    └── prisma/
        ├── schema.prisma # Database schema
        └── seedData/     # Seed data JSON files
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| POST | `/projects` | Create project |
| GET | `/tasks` | Get tasks (filter by projectId) |
| POST | `/tasks` | Create task |
| PATCH | `/tasks/:id` | Update task |
| PATCH | `/tasks/:id/status` | Update task status |
| GET | `/users` | List all users |
| GET | `/sprints` | List all sprints |
| GET | `/search` | Search across entities |

## Database Commands

```bash
# Run migrations
npx prisma migrate dev --name migration_name

# Generate Prisma client
npx prisma generate

# Reset and reseed database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## License

Private
