# 1. Base image - Setup environment
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
  && corepack prepare pnpm@10.28.1 --activate
RUN apk add --no-cache openssl

# 2. Dependencies stage - Install everything (dev & prod)
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml .npmrc ./ 
RUN pnpm install --frozen-lockfile

# 3. Build stage - Generate Prisma and Compile NestJS
FROM base AS build
WORKDIR /app
# Copy installed dependencies
COPY --from=dependencies /app/node_modules ./node_modules
# Copy configuration files and source code to maximize Docker caching
COPY package.json pnpm-workspace.yaml prisma.config.ts tsconfig.json tsconfig.build.json nest-cli.json ./
COPY prisma ./prisma
COPY src ./src

# Generate client and build backend
RUN pnpm exec prisma generate
RUN pnpm run build
# Prune development dependencies to keep final image clean
RUN pnpm prune --prod

# 4. Migration helper image (retains devDependencies for Prisma CLI)
FROM base AS migration-runner
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package.json pnpm-workspace.yaml prisma.config.ts ./
# Default migration launch command
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]

# 5. Production image - The final lean container
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Install openssl for production runtime engines
RUN apk add --no-cache openssl

# Run as non-root user for security compliance
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nestjs

# Copy built files and production dependencies with owner assignment
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma 
COPY --chown=nestjs:nodejs package.json ./

# Create logs directory and assign permissions to the non-root user
RUN mkdir -p logs && chown -R nestjs:nodejs logs

USER nestjs

EXPOSE 3000

CMD ["node", "dist/src/main.js"]