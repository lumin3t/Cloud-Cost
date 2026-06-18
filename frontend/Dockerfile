# build stage
FROM node:22 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:alpine
# Copy the built files
COPY --from=build /app/dist /usr/share/nginx/html
# COPY your custom config into Nginx
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]