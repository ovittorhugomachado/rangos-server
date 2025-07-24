FROM node:21-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/server.js"]