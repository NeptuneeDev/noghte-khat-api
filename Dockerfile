FROM node:18.12-alpine3.16 as common-build-stage

RUN npm config set registry http://registry.npmjs.org/
RUN  npm config set proxy http://fodev.org:8118
RUN  npm config set https-proxy http://fodev.org:8118

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY node_modules ./

RUN npm i

COPY . .


RUN npx prisma generate

EXPOSE 3000

# Development Build Stage
FROM common-build-stage AS development-build-stage

ENV NODE_ENV development

CMD ["npm", "run", "start:dev"]

# Production Build Stage
FROM common-build-stage AS production-build-stage

ENV NODE_ENV production

RUN npm run prebuild \
    npm run build

CMD ["npm", "run", "start:prod"]

