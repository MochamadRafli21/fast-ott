FROM oven/bun:1 as base
WORKDIR /

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

# Copy package files
COPY package*.json bun.lockb* ./
COPY app/server/package*.json app/server/bun.lockb* ./app/server/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client with correct binary target
RUN cd app/server && bun prisma generate

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "--cwd", "app/server", "dev"]
