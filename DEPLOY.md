# 🚀 Guía de Despliegue en VPS con Coolify

Esta guía te ayudará a desplegar tu aplicación de finanzas personales en tu VPS usando Coolify.

## 📋 Requisitos

- ✅ VPS con Ubuntu (20.04/22.04)
- ✅ Acceso SSH al VPS
- ✅ Al menos 2GB RAM recomendado
- ✅ Repositorio en GitHub (opcional pero recomendado)

---

## 🎯 Opción 1: Despliegue con Coolify (RECOMENDADO)

Coolify es una plataforma open-source para gestionar despliegues Docker con una interfaz web muy intuitiva.

### Paso 1: Instalar Coolify en tu VPS

Ejecuta estos comandos en tu VPS vía SSH:

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker y Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Coolify (método rápido)
curl -fsSL https://cdn.coollabs.io/coolify/install.sh -o install-coolify.sh
sudo bash install-coolify.sh

# O instalar manualmente:
docker run -d \
  --name coolify \
  --restart unless-stopped \
  -p 80:80 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v coolify-db:/var/lib/coolify/db \
  coollabsio/coolify:latest
```

### Paso 2: Acceder a Coolify

1. Abre tu navegador
2. Ve a: `http://TU_IP_DEL_VPS`
3. Sigue el asistente de configuración inicial
4. Crea tu cuenta de administrador

### Paso 3: Crear el proyecto

1. En Coolify, haz clic en **"New Project"**
2. Elige **"Docker Compose"** o **"Dockerfile"**
3. Selecciona **"Dockerfile"** (tu app tiene un Dockerfile)

### Paso 4: Configurar la aplicación

**A. Nombre:**
- Project: `finanzas-personales`
- Service: `web`

**B. Repositorio:**

Opción 1 - Desde GitHub (recomendado):
- Click en **"Connect GitHub"**
- Autoriza Coolify
- Selecciona tu repositorio
- Rama: `main` o `master`

Opción 2 - Desde Docker Registry:
- Sube tu imagen a Docker Hub o GitHub Container Registry
- Configura: `tu-usuario/finanzas-personales:latest`

**C. Variables de entorno:**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATABASE_URL=file:./data/finanzas.db
```

**D. Configuración de red:**
- **Port Mapping:** `3000` (exponer puerto 3000)
- **Domain:** (opcional, puedes agregarlo después)

**E. Configuración de volúmenes:**
- **Mount Path:** `/app/data`
- **Host Path:** `/data` (o ruta que prefieras en el VPS)

### Paso 5: Desplegar

1. Clic en **"Deploy"**
2. Espera que termine el proceso
3. Verifica los logs si hay errores

### Paso 6: Acceder a tu aplicación

```
http://TU_IP_DEL_VPS:3000
```

---

## 🎯 Opción 2: Despliegue Manual con Docker

Si prefieres hacerlo manualmente sin Coolify:

### Paso 1: Copiar archivos al VPS

```bash
# Desde tu máquina local
scp -r . user@tu-vps-ip:/home/user/finanzas-personales/
```

### Paso 2: Configurar en el VPS

```bash
# Acceder al VPS
ssh user@tu-vps-ip

# Ir al directorio
cd finanzas-personales

# Crear directorio para datos
mkdir -p data

# Construir imagen
docker build -t finanzas-personales .

# Ejecutar contenedor
docker run -d \
  --name finanzas-personales \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  --restart unless-stopped \
  finanzas-personales
```

### Paso 3: Acceder

```
http://tu-vps-ip:3000
```

---

## 🔧 Troubleshooting

### Problema: SQLite no funciona en Docker

**Solución:** Asegúrate de configurar el volumen correctamente:
```yaml
volumes:
  - ./data:/app/data
```

### Problema: PWA no funciona

**Solución:** Agrega estas variables de entorno:
```
NEXT_PUBLIC_URL=http://tu-dominio-o-ip
```

### Problema: Errores de build

**Solución:** Verifica que no estás ignorando node_modules y que las dependencias están en package.json:
```bash
# En el VPS, antes de construir
npm ci --only=production
```

### Problema: Puerto 3000 no funciona

**Solución:** Asegúrate de mapear el puerto en Docker:
```bash
-p 3000:3000
```

### Problema: Base de datos vacía al reiniciar

**Solución:** El volumen debe estar montado correctamente. Verifica:
```bash
docker inspect finanzas-personales | grep -A 10 Mounts
```

---

## 🔐 Configurar SSL (Opcional)

Si quieres agregar un dominio más tarde con HTTPS:

### En Coolify:
1. Ve a tu proyecto
2. Settings → Domain
3. Agrega tu dominio
4. Coolify configurará SSL automáticamente con Let's Encrypt

### Manualmente con Certbot:
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado
sudo certbot certonly --standalone -d tu-dominio.com

# Configurar Nginx (requiere configuración adicional)
```

---

## 📊 Monitoreo

### Ver logs:
```bash
# Con Coolify: Interfaz web → Logs

# Manual:
docker logs -f finanzas-personales
```

### Ver estado:
```bash
docker ps -a | grep finanzas-personales
```

### Reiniciar:
```bash
docker restart finanzas-personales
```

---

## 🔄 Actualizar la aplicación

### Con Coolify:
1. Push a GitHub
2. Coolify detecta cambios
3. Clic en "Deploy"

### Manual:
```bash
# En el VPS
cd finanzas-personales
git pull
docker build -t finanzas-personales .
docker stop finanzas-personales
docker rm finanzas-personales
docker run -d \
  --name finanzas-personales \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  --restart unless-stopped \
  finanzas-personales
```

---

## 📝 Notas Importantes

- La base de datos SQLite está en el volumen `/app/data`, por lo que persiste entre despliegues
- Asegúrate de hacer backup regular de `finanzas.db`:
  ```bash
  cp /path/to/data/finanzas.db /backup/finanzas-$(date +%Y%m%d).db
  ```
- Coolify tiene interfaz web en el puerto 80
- Tu aplicación Next.js corre en el puerto 3000

---

## 🆘 Soporte

Si tienes problemas:
1. Verifica los logs de Coolify/Docker
2. Asegúrate de que el puerto 3000 esté abierto en el firewall:
   ```bash
   sudo ufw allow 3000
   ```
3. Verifica que Docker está corriendo:
   ```bash
   sudo systemctl status docker
   ```

¡Buena suerte con el despliegue! 🚀
