# Сборка: Angular 22 требует Node.js ^22.22.3 или ^24.15.0
FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production


# Раздача статики и проксирование API
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/stack-check-frontend/browser /usr/share/nginx/html

EXPOSE 80
