FROM oven/bun:1 as base
WORKDIR /app

# Install OpenSSL 3.0 and other system dependencies
RUN apt-get update && apt-get install -y \
  openssl \
  libssl3 \
  libssl-dev \
  ca-certificates \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Copy root package.json and workspace configuration first
COPY package*.json bun.lockb* ./
COPY tsconfig*.json ./

# Copy all workspace package.json files to establish the workspace structure
COPY packages/types/package*.json ./packages/types/
COPY app/server/package*.json ./app/server/

# Install all dependencies (this will resolve workspace dependencies)
RUN bun install

# Copy all source code
COPY packages/ ./packages/
COPY app/ ./app/

# Generate Prisma client
RUN cd app/server && bun prisma generate

# Expose port
EXPOSE 3001

# Start the application
CMD ["bun", "--cwd", "app/server", "dev"]
