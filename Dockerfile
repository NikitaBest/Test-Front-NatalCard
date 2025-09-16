FROM node:22.14
 
WORKDIR /app
 
COPY package*.json ./
 
RUN npm install
 
COPY . .
 
EXPOSE 3000

# Сборка для продакшена
RUN npm run build 

# Запуск preview сервера
CMD [ "npm", "run", "start:prod" ]