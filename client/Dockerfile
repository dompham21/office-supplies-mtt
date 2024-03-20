# Use an official Node runtime as a parent image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the current directory contents into the container at /app
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]