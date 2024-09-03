# frontend/Dockerfile

# Use an official Node.js image as a base
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the app using nginx
FROM nginx:alpine

# Copy the build output to nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port nginx is running on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
