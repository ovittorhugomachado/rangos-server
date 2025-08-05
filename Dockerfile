FROM node:21-bullseye

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsc

RUN mkdir -p dist/docs && cp src/docs/swagger.yaml dist/docs/swagger.yaml

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/server.js