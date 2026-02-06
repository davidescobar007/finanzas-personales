#!/bin/bash

# 🚀 Script de instalación automática para Finanzas Personales en Coolify

set -e

echo "🎯 Iniciando instalación de Finanzas Personales con Coolify..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar si es root
if [ "$EUID" -ne 0 ]; then 
    print_warning "Este script debe ejecutarse como root o con sudo"
    exit 1
fi

# 1. Actualizar sistema
echo "📦 Actualizando sistema..."
apt update && apt upgrade -y
print_success "Sistema actualizado"

# 2. Instalar dependencias necesarias
echo ""
echo "📦 Instalando dependencias..."
apt install -y curl wget git docker.io docker-compose

# 3. Instalar Docker si no está instalado
if ! command -v docker &> /dev/null; then
    echo "🐳 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    print_success "Docker instalado"
else
    print_success "Docker ya está instalado"
fi

# 4. Habilitar e iniciar Docker
systemctl enable docker
systemctl start docker
print_success "Docker habilitado e iniciado"

# 5. Crear directorio para la aplicación
echo ""
echo "📁 Creando directorio para la aplicación..."
mkdir -p /var/www/finanzas-personales
cd /var/www/finanzas-personales
print_success "Directorio creado en /var/www/finanzas-personales"

# 6. Clonar repositorio (opcional - cambiar URL)
echo ""
echo "📥 Clonando repositorio..."
# Descomenta y modifica esto si tienes el repositorio en GitHub
# git clone https://github.com/tu-usuario/finanzas-personales.git .
print_warning "Por ahora, necesitas copiar los archivos manualmente a /var/www/finanzas-personales"

# 7. Configurar firewall
echo ""
echo "🔥 Configurando firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw reload
    print_success "Firewall configurado (puertos 80, 443, 3000 abiertos)"
else
    print_warning "UFW no encontrado. Asegúrate de configurar el firewall manualmente."
fi

# 8. Instalar Coolify
echo ""
echo "🎨 Instalando Coolify..."
docker run -d \
  --name coolify \
  --restart unless-stopped \
  -p 80:80 \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v coolify-db:/var/lib/coolify/db \
  coollabsio/coolify:latest

print_success "Coolify instalado"

# 9. Esperar a que Coolify inicie
echo ""
echo "⏳ Esperando a que Coolify inicie (10 segundos)..."
sleep 10

# 10. Verificar que Coolify esté corriendo
if docker ps | grep -q coolify; then
    print_success "Coolify está corriendo correctamente"
else
    print_warning "Coolify no está corriendo. Verifica con: docker logs coolify"
fi

# 11. Mostrar información de acceso
echo ""
echo "========================================"
echo "  🎉 ¡Instalación completada!"
echo "========================================"
echo ""
echo "Accede a Coolify en:"
echo -e "${GREEN}http://$(hostname -I | awk '{print $1}')${NC}"
echo ""
echo "Sigue el asistente de configuración inicial para:"
echo "  1. Crear tu cuenta de administrador"
echo "  2. Crear un nuevo proyecto"
echo "  3. Conectar tu repositorio de GitHub"
echo "  4. Configurar la aplicación (ver DEPLOY.md para detalles)"
echo ""
echo "📝 Archivos necesarios para copiar a /var/www/finanzas-personales:"
echo "  - Dockerfile"
echo "  - package.json"
echo "  - package-lock.json"
echo "  - next.config.ts"
echo "  - tsconfig.json"
echo "  - tailwind.config.ts"
echo "  - postcss.config.mjs"
echo "  - app/ (directorio completo)"
echo "  - components/ (directorio completo)"
echo "  - lib/ (directorio completo)"
echo "  - public/ (directorio completo)"
echo ""
echo "📚 Consulta DEPLOY.md para instrucciones detalladas de despliegue"
echo ""
echo "🔥 Para detener Coolify:"
echo "  docker stop coolify"
echo ""
echo "🔄 Para reiniciar Coolify:"
echo "  docker restart coolify"
echo ""
echo "📊 Para ver logs de Coolify:"
echo "  docker logs -f coolify"
echo ""
