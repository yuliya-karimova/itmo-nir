FROM node:18-alpine as build

WORKDIR /app

# Передаем переменную окружения во время сборки
ARG REACT_APP_BACKEND_URL=http://localhost:3001
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

