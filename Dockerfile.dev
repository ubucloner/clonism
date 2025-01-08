# Use an official Node.js runtime as the base image
FROM node:23

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npx playwright install
# Copy the backend and dist directories
COPY backend ./backend
COPY dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "backend/app.js"]
