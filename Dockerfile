FROM node:20-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

RUN apk update && apk add --no-cache openssl

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
