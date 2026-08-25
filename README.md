# Veltrex Backend (MES Operations Platform API)

Veltrex is an Enterprise Manufacturing Execution System (MES) designed specifically for CNC operations management. The backend is a robust REST API developed in NestJS, utilizing PostgreSQL and Prisma to deliver high-performance, multi-tenant database access and modular architectures.

---

## Architecture & Project Structure

The codebase is organized into modular services using **Clean Architecture** principles. Each domain module encapsulates its own controllers, services, repositories, and presentation assets.

```
veltrex-backend/
├── prisma/
│   ├── schema/           # Multi-file schema structure (base, auth, inventory, scheduling, etc.)
│   └── seed-lookups.js   # Seed script for initial lookup data
├── src/
│   ├── modules/          # Business logic domains
│   │   ├── auth/         # Multi-tenant Authentication & token management
│   │   ├── fixture/      # Fixtures management
│   │   ├── job/          # Machine jobs and task status tracking
│   │   ├── lookup/       # Configurable global lookup settings
│   │   ├── machine/      # Live CNC Machine status monitoring
│   │   ├── maintenance/  # Maintenance request tickets
│   │   ├── ncProgram/    # Version-controlled G-code program library
│   │   ├── notification/ # In-app and system logging notifications
│   │   ├── part/         # Part catalogue profiles
│   │   ├── payment/      # Razorpay payment & checkout handlers
│   │   ├── profile/      # User account settings
│   │   ├── raw-material/ # Raw material stock levels & logic
│   │   ├── shift/        # Operator shift templates & assignments
│   │   ├── subscription/ # Subscription layers & billing
│   │   ├── tenant/       # Multi-tenant isolation & subdomain routing
│   │   └── super-admin/  # Overall system administration
│   ├── shared/           # Common utilities, logger, Prisma integration, and interceptors
│   ├── main.ts           # Application bootstrapping
│   └── app.module.ts     # Core NestJS application module
```

### Key Architectural Patterns

- **Multi-Tenancy Isolation:** Standardized scopes applied to query contexts via the `TenantInterceptor`. Subdomain mappings are configured via a middleware system.
- **Prisma Modular Schemas:** Utilizes the multi-file schema feature (`prisma/schema/*.prisma`) for logical grouping of database structures.
- **Request Logging and Tracing:** Comprehensive logging via Winston, automatically attaching dynamic request identifiers to trace logs across operations.
- **Task Scheduling:** Automations and background cron flows powered by `@nestjs/schedule`.

---

## Features

1. **Multi-Tenant Authentication:** Dynamic role validation (`SUPER_ADMIN`, `ADMIN`, `MACHINIST`, and `MAINTENANCE`) tailored for corporate structure.
2. **Real-time Machine Monitoring:** Live state tracking (`IDLE`, `RUNNING`, `MAINTENANCE`) for shopfloor visibility.
3. **Production Scheduling & Shifts:** Manage user shift rotations and assign daily production tasks to operators.
4. **Maintenance Automation:** Automatically lock completing tasks if prerequisites fail, dispatch technician tickets, and track repair tasks.
5. **G-Code (NC Program) Repository:** Manage NC files with version tracking alongside S3-based binary uploads.
6. **Payment Integration:** Embedded Razorpay processing to handle SaaS subscriptions seamlessly.

---

## Tech Stack & Packages Used

### Core Frameworks

- **NestJS v11** - Server architecture & dependency injection.
- **TypeScript** - Strongly typed development flow.

### Database & Storage

- **Prisma ORM & PostgreSQL** - Relational database mapping with granular schema files.
- **AWS SDK S3** - NC G-code file uploads.
- **Cloudinary** - Visual asset optimizations and uploads.
- **Redis** - In-memory database store used for caching and state variables.

### Security & Utilities

- **Passport.js & JWT** - Token authentication and route protection.
- **Bcrypt** - Secure credential hashing.
- **class-validator & class-transformer** - DTO parsing and validation.
- **Nodemailer** - System notification emails.
- **Winston** - Customized logging formats and rotations.

---

## How to Install and Run

Make sure you have **Node.js (v18+)**, **pnpm**, **PostgreSQL**, and **Redis** installed locally.

### Step 1: Install Dependencies

Navigate to the backend directory and install:

```bash
pnpm install
```

### Step 2: Configure Environment

Copy `.env.example` as `.env` and fill out the details:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your PostgreSQL database credentials and `REDIS_HOST`/`PORT` are populated.

### Step 3: Run Database Migrations

Apply the migrations to setup your database schemas:

```bash
pnpm prisma migrate dev
```

### Step 4: Seed Initial Data

Seed required base lookup codes to populate lists and states:

```bash
pnpm seed
```

### Step 5: Start Server

Run the NestJS application in watch mode for development:

```bash
pnpm start:dev
```

The server will start listening at `http://localhost:3000`.

---

## Package Scripts Summary

| Command                  | Description                                 |
| :----------------------- | :------------------------------------------ |
| `pnpm start`             | Start production build directly             |
| `pnpm start:dev`         | Launch developer hot-reloading watch server |
| `pnpm start:prod`        | Run the compiled build from `dist/main`     |
| `pnpm build`             | Compile NestJS server code into JS assets   |
| `pnpm seed`              | Seed database lookup categories             |
| `pnpm lint` / `lint:fix` | Run formatting & syntax linter checks       |
| `pnpm test`              | Run application unit tests                  |
| `pnpm test:e2e`          | Run server end-to-end integration tests     |
