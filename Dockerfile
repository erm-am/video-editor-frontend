FROM node:20-slim AS base
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:1-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=base /app/dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
