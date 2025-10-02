# Configuración de MySQL para Esymbel Fitness Backend

## 📋 Prerrequisitos

1. **Instalar MySQL Server** (si no lo tienes):
   - Descargar desde: https://dev.mysql.com/downloads/mysql/
   - O usar XAMPP: https://www.apachefriends.org/

## 🔧 Configuración paso a paso

### 1. Configurar las variables de entorno

Edita el archivo `.env` con tus datos de MySQL:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_password_mysql
DB_NAME=esymbel_fitness
```

### 2. Crear la base de datos

**Opción A: Usando MySQL Workbench o phpMyAdmin**

```sql
CREATE DATABASE esymbel_fitness
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

**Opción B: Usando línea de comandos**

```bash
mysql -u root -p
CREATE DATABASE esymbel_fitness;
exit
```

**Opción C: Usar el script incluido**

```bash
mysql -u root -p < database/create-database.sql
```

### 3. Verificar la conexión

Ejecuta el servidor:

```bash
npm run start:dev
```

Si ves estos logs, la conexión es exitosa:

```
[TypeORM] - Database connection established
[TypeORM] - Table "users" created
```

## 🗄️ Estructura de la base de datos

### Tabla: `users`

| Campo       | Tipo                | Descripción                    |
| ----------- | ------------------- | ------------------------------ |
| `id`        | INT AUTO_INCREMENT  | ID único del usuario           |
| `email`     | VARCHAR(255) UNIQUE | Email del usuario              |
| `password`  | VARCHAR(255)        | Contraseña hasheada            |
| `name`      | VARCHAR(255)        | Nombre completo                |
| `roles`     | TEXT                | Roles del usuario (JSON array) |
| `createdAt` | DATETIME            | Fecha de creación              |
| `updatedAt` | DATETIME            | Fecha de última actualización  |

## 🧪 Probar la API con MySQL

### 1. Registrar un usuario:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@mysql.com",
    "password": "123456",
    "name": "MySQL Test User"
  }'
```

### 2. Verificar en la base de datos:

```sql
USE esymbel_fitness;
SELECT * FROM users;
```

### 3. Login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@mysql.com",
    "password": "123456"
  }'
```

## 🔍 Debugging

### Errores comunes:

**Error: "ECONNREFUSED"**

- ✅ Verifica que MySQL esté ejecutándose
- ✅ Verifica host y puerto en `.env`

**Error: "Access denied"**

- ✅ Verifica usuario y contraseña en `.env`
- ✅ Verifica permisos del usuario MySQL

**Error: "Unknown database"**

- ✅ Crea la base de datos con el script incluido

**Error: "ER_NOT_SUPPORTED_AUTH_MODE"**

- Ejecuta en MySQL:

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_password';
FLUSH PRIVILEGES;
```

### Logs útiles:

En desarrollo puedes ver las queries SQL que ejecuta TypeORM activando logging:

```typescript
// En app.module.ts
logging: true, // Ya está configurado
```

## 🚀 Siguiente paso: Producción

Para producción, cambia estas configuraciones:

```typescript
// En app.module.ts
synchronize: false, // ❌ NUNCA usar en producción
logging: false, // Solo para debugging
```

Y usa migraciones:

```bash
npm run typeorm migration:generate
npm run typeorm migration:run
```

## 📊 Datos de ejemplo

Si quieres datos de prueba, ejecuta:

```sql
INSERT INTO users (email, password, name, roles, createdAt, updatedAt) VALUES
('admin@esymbel.com', '$2a$10$example_hash', 'Admin Esymbel', 'admin,user', NOW(), NOW()),
('trainer@esymbel.com', '$2a$10$example_hash', 'Trainer Esymbel', 'trainer,user', NOW(), NOW());
```
