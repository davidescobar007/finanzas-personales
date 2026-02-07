# Dockerfile para Next.js con SQLite
FROM node:20-alpine AS base

# Instalar dependencias de sistema para compilar módulos nativos
RUN apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (se necesitan todas para el build, incluyendo devDependencies)
RUN NODE_ENV=development npm install --silent

# Copiar código fuente
COPY . .

# Configurar directorio de datos (antes del build para que la DB funcione)
RUN mkdir -p /app/data

# Construir la aplicación
RUN npm run build

# Variables de entorno para producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Exponer puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["npm", "start"]
