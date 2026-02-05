# Dockerfile pour Prisma CLI (Production)
# Utilise pour les migrations et la generation du client
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

RUN npm install -g pnpm@10.28.1

COPY package*.json ./

RUN pnpm install --prod

COPY prisma/ ./prisma/

RUN npx prisma generate

CMD ["sh"]
