# Use Node.js 20.18.1 as the base image
FROM node:20.18.1

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the application files
COPY . .

# Expose the port your Express server uses
EXPOSE 3000

# Start the server
CMD ["node", "backend/main.js"]
