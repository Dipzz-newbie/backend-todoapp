# Database & API Spec for Taskflow Sparkle (PostgreSQL + Prisma)

## Database Schema (Prisma - PostgreSQL)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(uuid())
  email          String   @unique
  passwordHash   String
  displayName    String?
  avatarUrl      String?
  tasks          Task[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("users")
}

model Task {
  id          String   @id @default(uuid())
  text        String
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  category    String?
  userId      String

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("tasks")
}
```

---