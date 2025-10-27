FROM node:24-alpine AS deps
WORKDIR /web
COPY package*.json ./
RUN npm ci

FROM node:24-alpine AS dev
WORKDIR /web
COPY --from=deps /web/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS build
WORKDIR /web
COPY --from=deps /web/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS prod
RUN rm -f /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.conf /etc/nginx/conf.d/web.conf
COPY --from=build /web/dist/ /usr/share/nginx/html/
EXPOSE 80