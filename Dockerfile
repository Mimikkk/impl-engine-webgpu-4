# Multi-stage Dockerfile for production
FROM denoland/deno:2.1.7 AS base

# Set working directory
WORKDIR /app

# Copy deno configuration files
COPY deno.json deno.lock ./

# Copy workspace configuration
COPY apps/preview/deno.json ./apps/preview/
COPY libs/engine/deno.json ./libs/engine/

# Cache dependencies
RUN deno cache --lock=deno.lock deno.json

# Development stage
FROM base AS development

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Start development server
CMD ["deno", "task", "dev:preview"]

# Build stage
FROM base AS builder

# Copy source code
COPY . .

# Build the application
RUN deno task build:preview

# Production stage
FROM nginx:alpine AS production

# Copy built files from builder stage
COPY --from=builder /app/apps/preview/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
