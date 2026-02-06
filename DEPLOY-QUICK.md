# 🚀 Despliegue Rápido en VPS con Coolify

Esta guía es para desplegar tu aplicación en un VPS Ubuntu usando Coolify.

## 📋 Preparación (5 minutos)

### 1. Preparar archivos locales

En tu máquina local, asegúrate de tener estos archivos:

✅ `Dockerfile` - Creado para tu app
✅ `docker-compose.yml` - Para despliegue local
✅ `package.json` - Con todas las dependencias
✅ `next.config.ts` - Configuración de Next.js
✅ `install-coolify.sh` - Script de instalación automática
✅ `DEPLOY.md` - Guía completa de despliegue

### 2. Preparar repositorio (opcional pero recomendado)

```bash
# En tu máquina local
git init
git add .
git commit -m "Inicializar proyecto de finanzas personales"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/tu-usuario/finanzas-personales.git
git branch -M main
git push -u origin main
```

---

## 🚀 Instalación en VPS (10 minutos)

### Opción A: Instalación Automática (Recomendada)

1. **Subir archivos al VPS:**
```bash
scp install-coolify.sh user@tu-vps-ip:~/
```

2. **Ejecutar script en el VPS:**
```bash
ssh user@tu-vps-ip
sudo bash ~/install-coolify.sh
```

3. **Seguir instrucciones del script**

### Opción B: Instalación Manual

```bash
# 1. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Instalar Coolify
docker run -d \
  --name coolify \
  --restart unless-stopped \
  -p 80:80 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v coolify-db:/var/lib/coolify/db \
  coollabsio/coolify:latest

# 3. Acceder a Coolify
# Abre http://tu-vps-ip en tu navegador
```

---

## 🎯 Configurar Coolify (5 minutos)

1. **Acceder a Coolify:**
   - Abre: `http://tu-vps-ip`
   - Sigue el asistente de configuración

2. **Crear proyecto:**
   - Click en "New Project"
   - Nombre: `finanzas-personales`

3. **Crear servicio:**
   - Click en "New Service"
   - Tipo: "Dockerfile"

4. **Conectar repositorio:**
   - Click en "Connect GitHub"
   - Autoriza y selecciona tu repositorio
   - Rama: `main`

5. **Configurar variables de entorno:**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
DATABASE_URL=file:./data/finanzas.db
```

6. **Configurar volúmenes:**
   - Mount Path: `/app/data`
   - Host Path: `/var/www/finanzas-personales/data`

7. **Desplegar:**
   - Click en "Deploy"

---

## ✅ Verificar Despliegue

1. **Acceder a tu app:**
   ```
   http://tu-vps-ip:3000
   ```

2. **Verificar funcionalidad:**
   - Agrega una transacción
   - Verifica que se guarde en la base de datos
   - Recarga la página y verifica que los datos persistan

---

## 🔧 Problemas Comunes

### Problema: "No puedo acceder a Coolify en puerto 80"

**Solución:**
```bash
# Verificar firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
```

### Problema: "La base de datos se reinicia al actualizar"

**Solución:**
Verifica que el volumen esté configurado correctamente en Coolify:
- Mount Path: `/app/data`
- Host Path: `/var/www/finanzas-personales/data`

### Problema: "PWA no funciona"

**Solución:**
Agrega esta variable de entorno en Coolify:
```
NEXT_PUBLIC_URL=http://tu-vps-ip:3000
```

---

## 📱 Agregar Dominio (Opcional)

Si tienes un dominio, puedes configurarlo en Coolify:

1. En tu proveedor de dominio, configura DNS:
   - A Record: `@` → `tu-vps-ip`
   - A Record: `www` → `tu-vps-ip`

2. En Coolify:
   - Ve a tu proyecto → Settings → Domains
   - Agrega tu dominio
   - Coolify configurará SSL automáticamente

---

## 🔄 Actualizar Aplicación

### Automático (desde GitHub):
1. Push a GitHub
2. Coolify detecta cambios
3. Click en "Deploy"

### Manual:
1. En Coolify, click en "Re-deploy"
2. O ejecuta el botón de deploy manual

---

## 💾 Backup

Para hacer backup de tu base de datos:

```bash
# En el VPS
docker exec finanzas-personales ls -la /app/data/
docker cp finanzas-personales:/app/data/finanzas.db ~/backup-finanzas-$(date +%Y%m%d).db
```

Para restaurar:
```bash
docker cp ~/backup-finanzas.db finanzas-personales:/app/data/finanzas.db
```

---

## 📚 Recursos

- **Coolify:** https://coolify.io
- **Documentación completa:** DEPLOY.md
- **Docker:** https://docs.docker.com
- **Next.js:** https://nextjs.org/docs

---

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs en Coolify (interfaz web → Logs)
2. Verifica que el contenedor esté corriendo: `docker ps`
3. Verifica logs de Docker: `docker logs finanzas-personales`
4. Revisa firewall: `sudo ufw status`

---

¡Buena suerte con tu despliegue! 🎉
