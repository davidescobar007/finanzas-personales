# Dockerfile para Next.js con SQLite
FROM node:20-alpine AS base

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production --silent

# Copiar código fuente
COPY . .

# Configurar directorio de datos
RUN mkdir -p /app/data

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Exponer puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["node", "node_modules/next/dist/bin/next", "start"]
