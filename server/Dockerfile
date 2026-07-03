# Base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Final production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built code and dependencies from builder stage
COPY --from=builder /app /app

# Expose server port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production

# Start command
CMD ["npm", "start"]
