FROM node:20-alpine

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy package files and install dependencies first
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run the build
RUN npm run build

# Check if dist exists (for debugging logs during build)
RUN ls -la dist

# Expose the port
EXPOSE 5173

# Start the preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]