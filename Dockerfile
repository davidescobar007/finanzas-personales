# Dockerfile para Next.js con SQLite
FROM node:20-alpine AS base

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (se necesitan todas para el build)
RUN npm ci --silent

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Configurar directorio de datos
RUN mkdir -p /app/data

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Exponer puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
