# Usar una imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --only=production

# Copiar el código fuente de la aplicación
COPY src/ ./src/

# Copiar el archivo .env (si existe)
COPY .env ./

# Exponer el puerto en el que corre la aplicación
EXPOSE 5000

# Variable de entorno para producción
ENV NODE_ENV=production

# Comando para ejecutar la aplicación
CMD ["npm", "start"]