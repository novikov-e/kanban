# Сборка: Angular 15 поддерживает Node.js до 18.x
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production


# Раздача статики и проксирование API
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/stack-check-frontend /usr/share/nginx/html

EXPOSE 80
