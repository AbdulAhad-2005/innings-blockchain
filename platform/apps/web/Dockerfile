FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN mkdir -p .next/standalone/.next && \
    cp -r .next/static .next/standalone/.next/ && \
    cp -r public .next/standalone/ || true

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
