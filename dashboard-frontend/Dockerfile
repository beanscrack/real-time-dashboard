# Use a lightweight Node.js image
FROM node:16

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install 'serve' globally so that the command is available
RUN npm install -g serve

# Copy all frontend source files
COPY . .

# Build the React app and list the build folder (for debugging)
RUN npm run build && ls -la build

# Expose the frontend port
EXPOSE 3000

# Serve the built React app using the globally installed 'serve'
CMD ["serve", "-s", "build"]
