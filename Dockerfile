# # Base image
# FROM node:22-alpine AS base

# # Setup pnpm
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# # Install dependencies
# FROM base AS dependencies
# WORKDIR /app
# COPY package.json pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# # Build the app
# FROM base AS build
# WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN pnpm run build
# RUN pnpm prune --prod

# # Production image
# FROM base AS production
# WORKDIR /app
# # Set environment variable to production
# ENV NODE_ENV=production

# # Copy only the necessary files for production
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# COPY package.json ./

# EXPOSE 3000

# CMD ["node", "dist/main.js"]



# # Base image
# FROM node:22-alpine AS base

# # Setup pnpm
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable

# # Install openssl for Prisma engines
# RUN apk add --no-cache openssl

# # Install dependencies
# FROM base AS dependencies
# WORKDIR /app
# # IMPORTANT: Copy .npmrc so allow-build permissions work
# COPY package.json pnpm-lock.yaml .npmrc ./ 
# RUN pnpm install --frozen-lockfile

# # Build the app
# FROM base AS build
# WORKDIR /app
# COPY . .
# # Generate prisma client before building the NestJS app
# RUN pnpm exec prisma generate
# RUN pnpm run build
# RUN pnpm prune --prod

# # Production image
# FROM base AS production
# WORKDIR /app
# ENV NODE_ENV=production

# # Copy only the necessary files
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# # Prisma needs the schema in prod to find the engine
# COPY --from=build /app/prisma ./prisma 
# COPY package.json ./

# EXPOSE 3000

# CMD ["node", "dist/main.js"]





# 1. Base image - Setup environment
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable \
  && corepack prepare pnpm@10.28.1 --activate
# Prisma needs openssl to run its engines
RUN apk add --no-cache openssl

# 2. Dependencies stage - Install everything
FROM base AS dependencies
WORKDIR /app
# Copy lockfile and npmrc to handle permissions/versions
COPY package.json pnpm-lock.yaml .npmrc ./ 
RUN pnpm install --frozen-lockfile

# 3. Build stage - Generate Prisma and Compile NestJS
FROM base AS build
WORKDIR /app
# Copy all source code
COPY . .
# CRITICAL: Copy the node_modules we just installed!
COPY --from=dependencies /app/node_modules ./node_modules

# Now these commands will actually find the binaries
RUN pnpm exec prisma generate
RUN pnpm run build
# Remove devDependencies to keep the image small
RUN pnpm prune --prod

# 4. Production image - The final lean container
FROM base AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy only what is strictly necessary to run the app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma 
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]