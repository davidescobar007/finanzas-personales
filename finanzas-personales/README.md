# 💰 Mis Finanzas - App de Finanzas Personales

Una aplicación web moderna, bonita y fácil de usar para organizar tus finanzas personales y gestionar tus ahorros.

## ✨ Características

### Gestión de Gastos
- 📊 **Dashboard interactivo** - Visualiza tus gastos de forma clara
- 🎯 **Categorización** - Organiza tus gastos por categorías con iconos
- 💳 **Métodos de pago** - Registra cómo pagaste (efectivo, tarjeta, transferencia, etc.)
- 💡 **Gráficos visuales** - Análisis de gastos por categoría
- 🔍 **Búsqueda** - Encuentra gastos rápidamente
- ✏️ **CRUD completo** - Crea, edita y elimina gastos

### Fondos de Ahorro (Anticipos)
- 🎁 **Fondos personalizados** - Crea fondos para navidad, coche, vacaciones, etc.
- 📈 **Seguimiento de progreso** - Visualiza cuánto has ahorrado de tu objetivo
- 💰 **Aportes mensuales** - Registra tus aportes a cada fondo
- 🎯 **Metas con fecha límite** - Establece fechas objetivo para tus ahorros
- 📊 **Tarjetas visuales** - Muestra el progreso de cada fondo de forma atractiva

### General
- 📱 **PWA (Progressive Web App)** - Instalable en tu dispositivo móvil
- 📱 **Responsive** - Funciona perfectamente en móvil y escritorio
- 🎨 **Diseño moderno** - Interfaz bonita con gradientes y animaciones

## 🚀 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Ejecutar en desarrollo**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## 📱 Instalación como PWA

En Chrome/Safari móvil:
1. Abre la app en tu navegador
2. Toca el botón "Compartir"
3. Selecciona "Agregar a pantalla de inicio"

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Estilos**: TailwindCSS
- **Componentes**: shadcn/ui
- **Iconos**: Lucide React
- **Gráficos**: Recharts
- **Base de datos**: SQLite con better-sqlite3
- **PWA**: next-pwa
- **Fechas**: date-fns

## 📁 Estructura del proyecto

```
finanzas-personales/
├── app/
│   ├── api/                  # Rutas de la API
│   │   ├── expenses/         # Gastos
│   │   ├── categories/       # Categorías
│   │   ├── payment-methods/  # Métodos de pago
│   │   ├── funds/            # Fondos de ahorro
│   │   └── contributions/    # Aportes a fondos
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Página principal
│   └── globals.css           # Estilos globales
├── components/
│   ├── ui/                   # Componentes base
│   ├── expense-card.tsx      # Tarjeta de gasto
│   ├── expense-form.tsx      # Formulario de gasto
│   ├── fund-card.tsx         # Tarjeta de fondo
│   ├── fund-form.tsx         # Formulario de fondo
│   ├── contribution-form.tsx  # Formulario de aporte
│   ├── contributions-list.tsx # Lista de aportes
│   ├── summary-cards.tsx     # Tarjetas de resumen
│   └── category-breakdown.tsx # Gráfico de categorías
├── lib/
│   ├── db.ts                 # Base de datos SQLite
│   └── utils.ts              # Utilidades
└── public/                   # Archivos estáticos e iconos PWA
```

## 💾 Base de datos

La app usa SQLite localmente. La base de datos se crea automáticamente en `finanzas.db` con:

### Gastos
- **expenses**: Almacena todos los gastos (con método de pago)
- **categories**: Categorías predefinidas con iconos y colores
- **paymentMethods**: Métodos de pago predefinidos con iconos

### Fondos de Ahorro
- **funds**: Almacena los fondos/anticipos creados
- **contributions**: Aportes realizados a cada fondo

## 📝 Categorías predefinidas

- 🍕 Comida
- 🚗 Transporte
- 🏠 Vivienda
- 🎮 Entretenimiento
- 💊 Salud
- 🛍️ Compras
- 💡 Servicios
- 📦 Otros

## 💳 Métodos de pago predefinidos

- 💵 Efectivo
- 💳 Tarjeta Crédito
- 🏧 Tarjeta Débito
- 📱 Transferencia
- 📝 Cheque
- 🅿️ PayPal
- ❓ Otros

## 🎁 Fondos de ahorro predefinidos

- 🎁 Regalos Navidad (€500)
- 🚗 Impuestos Coche (€800)
- 🔧 Mantenimiento Coche (€400)
- ✈️ Vacaciones (€2000)

## 🎨 Personalización

Puedes personalizar:
- **Categorías**: Edita el array `defaultCategories` en `lib/db.ts`
- **Métodos de pago**: Edita el array `defaultPaymentMethods` en `lib/db.ts`
- **Fondos predefinidos**: Edita el array `defaultFunds` en `lib/db.ts`

## 🚀 Build para producción

```bash
npm run build
npm start
```

## 🔧 Scripts disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Crea build de producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Ejecuta ESLint

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal.

---

## 📖 Cómo usar

### Agregar un gasto
1. Haz clic en el botón "Nuevo gasto"
2. Completa el título, monto, categoría, método de pago y fecha
3. Agrega notas opcionales si lo deseas
4. Haz clic en "Agregar gasto"

### Crear un fondo de ahorro
1. Haz clic en el botón "Nuevo fondo"
2. Ingresa el nombre del fondo (ej: "Regalos Navidad")
3. Establece el monto objetivo
4. Selecciona un icono y color personalizados
5. Opcionalmente, establece una fecha límite
6. Haz clic en "Crear fondo"

### Agregar un aporte a un fondo
1. Busca el fondo al que quieres aportar en la sección "Mis Fondos de Ahorro"
2. Haz clic en el icono "+" en la tarjeta del fondo
3. Selecciona el fondo (si no está preseleccionado)
4. Ingresa el monto del aporte
5. Agrega notas opcionales
6. Haz clic en "Agregar aporte"

### Ver el progreso de ahorro
- Cada fondo muestra una barra de progreso visual
- Puedes ver el monto ahorrado, el objetivo y el porcentaje completado
- Si el fondo está completo, verás un mensaje de celebración
- Los fondos cercanos a su fecha límite mostrarán los días restantes

---

¡Disfruta organizando tus finanzas y ahorrando para tus metas! 💰✨
