# Usa a imagem base Node.js
FROM node:18-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Constrói o app para produção
RUN npm run build

# Usa Nginx para servir os arquivos
FROM nginx:stable-alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
