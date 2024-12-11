# Frontend Project
PRISM is a multi-tenant DevOps and observability tool designed to capture metrics from multiple real-time cloud containers and display them on a user-friendly interface. It features an alerting system, log analysis capabilities, and high security through OAuth integration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Docker](#docker)
- [App Photos](#app-photos)

## Prerequisites

- [Docker](https://www.docker.com/) (>= 20.x)
- [Docker Compose](https://docs.docker.com/compose/) (>= 2.x)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/prism-o11y/prism-client-ui.git
   cd prism-client-ui/prism
   ```

2. Start the application using Docker Compose:

   ```bash
   docker compose up --build
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Docker

### Docker Compose Configuration

Below is the `docker-compose.yml` configuration used for the project:

```yaml
services:
  prism:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

### Dockerfile

Below is the `Dockerfile` used to build the application:

```Dockerfile
# Use an official Node runtime as the base image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
```
## App Photos

### Dashboard 
![Dashboard](/assets/dashboard.jpeg)

### Logs
![Logs](/assets/logs.jpeg)

### Alerts
![Alerts](/assets/alerts.jpeg)

### Applications
![Applications](/assets/application.jpeg)

### User Profile
![User_Profile](/assets/user_profile.jpeg)