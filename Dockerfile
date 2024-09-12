FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/.next ./
COPY --from=build /app/public ./public

RUN npm install --only=production

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
