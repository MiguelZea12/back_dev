# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the project files to the container
COPY . .

# Install project dependencies
RUN npm install

# Expose the port that the NestJS application uses
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:dev"]