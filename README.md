# 📚 Documentación Base de Datos
### Sistema de Gestión de Autos — Inventario e Inversión

> Documento de referencia interna para el equipo de desarrollo.  
> Última actualización: Marzo 2026

---

## 📋 Descripción General

Este sistema permite administrar el ciclo completo de compra, reparación, inversión y venta de vehículos. Cubre los siguientes módulos:

| Módulo | Descripción |
|--------|-------------|
| 🚗 **Autos** | Control de inventario y estado de cada vehículo |
| 💸 **Movimientos** | Registro de gastos y entradas de dinero generales |
| 🔧 **Costos por vehículo** | Gastos directamente asociados a un auto específico |
| 👥 **Inversionistas** | Seguimiento del capital aportado por cada socio |
| 🔐 **Usuarios** | Administración de accesos al sistema |

> **Manejo de dinero:** Todos los montos se almacenan como `DECIMAL(10,2)` para garantizar precisión en operaciones financieras.  
> Ejemplo: `10000.50`, `350.00`

---

## 🌐 Endpoints del Backend

Todos los endpoints de escritura utilizan el método `POST`.

---

### 🔐 Autenticación

```
POST /api/v1/auth/login
```

Permite a los usuarios iniciar sesión en el sistema. Devuelve un token de sesión para autenticar las demás peticiones.

---

### 🚗 Autos

```
POST /api/v1/cars
```

Registra un nuevo vehículo en el inventario. Se debe proporcionar marca, modelo, año, color, precio de compra y fecha de adquisición.

---

### 💸 Movimientos

```
POST /api/v1/movements
```

Registra un gasto o movimiento de dinero general, no atado a un costo específico de vehículo. Ejemplos de uso: gasolina, refacciones, transporte, pagos varios.

---

### 👥 Inversionistas

```
POST /api/v1/investors
```

Registra el capital invertido por un usuario en el negocio. Cada registro queda vinculado al `user_id` del inversionista correspondiente.

---

### 🗂️ Categorías de movimientos

```
POST /api/v1/movements_category
```

Permite agregar nuevas categorías para clasificar los movimientos financieros (activos o pasivos). Ejemplos: Gasolina, Refacciones, Transporte, Herramientas.

> [!NOTE]
> Esta funcionalidad no está contemplada en el flujo principal de la primera versión, pero el endpoint queda preparado para futuras ampliaciones del sistema.

# 📥 Endpoints de Consulta (GET)

Estos endpoints se utilizan principalmente para llenar selects en el frontend.

## Usuarios

```
GET /api/v1/users
```

Obtiene usuarios registrados.

## Categorías de Movimientos

```
GET /api/v1/movements-category
```

Obtiene las categorías disponibles de movimientos.

## Modelos de Autos

```
GET /api/v1/cars/models
```

Devuelve modelos disponibles para el formulario de registro.

---

# 🗄️ Estructura de Base de Datos

## Tabla: `users`

Almacena los usuarios del sistema. Ejemplos: administradores, operadores, inversionistas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user_id` | CHAR(36) | Identificador UUID del usuario |
| `username` | VARCHAR(100) | Nombre de usuario único |
| `password_hash` | VARCHAR(255) | Contraseña encriptada |
| `full_name` | VARCHAR(200) | Nombre completo |
| `email` | VARCHAR(200) | Correo electrónico |
| `last_login` | DATETIME | Último acceso |
| `created` | DATETIME | Fecha de creación |
| `updated` | DATETIME | Fecha de actualización |

---

## Tabla: `cars`

Contiene todos los vehículos registrados en el sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `car_id` | CHAR(36) | UUID del vehículo |
| `brand` | VARCHAR(20) | Marca del auto |
| `model` | VARCHAR(50) | Modelo |
| `year_of_car` | INT | Año del vehículo |
| `color` | VARCHAR(15) | Color |
| `purchase_date` | DATE | Fecha de compra |
| `sale_date` | DATE | Fecha de venta |
| `status` | ENUM | Estado del vehículo |
| `purchase_price` | DECIMAL(10,2) | Precio de compra |
| `price_for_sale` | DECIMAL(10,2) | Precio de venta |
| `created` | DATETIME | Fecha de creación |
| `updated` | DATETIME | Fecha de actualización |

**Estados posibles:** `Vendido` · `Inventario` · `En espera` · `Reparacion`

---

## Tabla: `car_costs`

Almacena gastos específicos aplicados directamente a un vehículo. Estos costos están relacionados con reparaciones o mejoras del auto.

> ⚠️ **Importante:** Esta tabla fue solicitada al final de la reunión con el cliente, por lo que su implementación puede considerarse una fase posterior o actualización futura del sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `cost_id` | CHAR(36) | UUID del costo |
| `car_id` | CHAR(36) | Auto relacionado |
| `cost_type` | ENUM | Tipo de gasto |
| `amount` | DECIMAL(10,2) | Monto del gasto |
| `note` | VARCHAR(255) | Nota opcional |
| `created` | DATETIME | Fecha de registro |

**Tipos de costo:** `llantas` · `hojalateria` · `tapiceria` · `cielo` · `volante` · `funda` · `mecanico` · `tapones` · `multa` · `kit` · `sombrerera` · `rin_llaveta` · `aceite` · `tapon_facion` · `alineacion` · `manija` · `faros_calaveras`

**Relación:** `car_costs.car_id` → `cars.car_id`

---

## Tabla: `movements`

Registra movimientos financieros generales. Ejemplos: gasolina, refacciones, traslado, pagos varios.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `movements_id` | CHAR(36) | UUID del movimiento |
| `movements_category_id` | CHAR(36) | Categoría del movimiento |
| `car_id` | CHAR(36) | Auto relacionado |
| `type` | ENUM | Tipo de movimiento |
| `amount` | DECIMAL(10,2) | Monto |
| `description` | VARCHAR(120) | Descripción |
| `created` | DATETIME | Fecha creación |
| `updated` | DATETIME | Fecha actualización |

**Tipos:** `Compra` · `Gasto`

**Relaciones:**
- `movements.car_id` → `cars.car_id`
- `movements.movements_category_id` → `movements_category.category_id`

---

## Tabla: `investor`

Registra el dinero invertido por un usuario en el negocio.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `investor_id` | CHAR(36) | UUID del registro |
| `user_id` | CHAR(36) | Usuario inversionista |
| `investment_amount` | DECIMAL(10,2) | Cantidad invertida |
| `created` | DATETIME | Fecha registro |
| `updated` | DATETIME | Fecha actualización |

**Relación:** `investor.user_id` → `users.user_id`

---

## Tabla: `movements_category`

Catálogo de categorías para clasificar movimientos financieros. Ejemplos: Gasolina, Refacciones, Transporte, Herramientas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `category_id` | CHAR(36) | UUID |
| `name` | VARCHAR(50) | Nombre de la categoría |
| `type` | ENUM | Clasificación |

**Tipos:** `Activo` · `Pasivo`

---

# 🔗 Relaciones Principales del Sistema

```
users
  └── investor

cars
  ├── movements
  └── car_costs

movements_category
  └── movements
```

---

# 📌 Notas Técnicas

**UUID** — Todas las tablas usan `CHAR(36)` para almacenar UUIDs.

**Manejo de dinero** — Todos los montos usan `DECIMAL(10,2)` para evitar errores de precisión.

**Eliminación en cascada** — Cuando un auto se elimina, `car_costs` y `movements` también se eliminan automáticamente.

---

# 🚀 Posibles Mejoras Futuras

- API para editar autos
- API para editar movimientos
- Dashboard financiero
- Reportes de ganancias
- Control de utilidades por vehículo
- Historial de cambios
- Gestión avanzada de inversionistas









































