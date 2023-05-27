# Stage 1: Build the React app
FROM node:14 as build-stage

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Create a lightweight production image
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Copy the customized conf file
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
