# Use Node.js 20.18.1 as the base image
FROM node:20.18.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite frontend
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --omit=dev

# Expose the port your Express server listens on
EXPOSE 3000

# Start the backend server (Express)
CMD ["node", "backend/main.js"]
