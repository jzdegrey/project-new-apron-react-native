FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start", "--", "--host", "0.0.0.0"]
