# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create output directory
RUN mkdir -p output

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "
    import('http').then(http => {
      const req = http.request('http://localhost:3000/health', res => {
        process.exit(res.statusCode === 200 ? 0 : 1);
      });
      req.on('error', () => process.exit(1));
      req.end();
    });
  "

# Start the application
CMD ["npm", "start"]