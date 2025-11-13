# Database & API Spec for Taskflow Sparkle (MySQL + Prisma)

## Database Schema (Prisma - MySQL)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id             String   @id @default(uuid()) @db.Char(36)
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
  id          String   @id @default(uuid()) @db.Char(36)
  text        String
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  category    String?
  userId      String   @db.Char(36)

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@map("tasks")
}


```

---