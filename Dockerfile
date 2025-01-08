# Use Node.js 20.18.1 as the base image
FROM node:20.18.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies without devDependencies for production
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Build the Vite frontend
RUN npm run build

# Expose the port your Express server listens on
EXPOSE 3000

# Start the backend server (Express)
CMD ["node", "backend/main.js"]
