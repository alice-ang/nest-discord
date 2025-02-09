# Use Node.js 20.11.0 base image
FROM node:20.11.0

# Set working directory

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
