# Sistema de Autenticación con Roles (RBAC) - Documentación

## Roles disponibles

El sistema maneja los siguientes roles:

- **USER** - Usuario regular (rol por defecto)
- **ADMIN** - Administrador con acceso total
- **TRAINER** - Entrenador con permisos especiales
- **MODERATOR** - Moderador con permisos intermedios

## Endpoints disponibles

### 1. Registro de usuario

**POST** `/auth/register`

Body básico (se asigna rol USER por defecto):

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tuContraseña123",
  "name": "Tu Nombre"
}
```

Body con roles específicos:

```json
{
  "email": "admin@ejemplo.com",
  "password": "admin123",
  "name": "Admin User",
  "roles": ["admin", "user"]
}
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "usuario@ejemplo.com",
    "name": "Tu Nombre",
    "roles": ["user"]
  }
}
```

### 2. Login

**POST** `/auth/login`

Body:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tuContraseña123"
}
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "usuario@ejemplo.com",
    "name": "Tu Nombre",
    "roles": ["user", "admin"]
  }
}
```

### 3. Obtener perfil (Ruta protegida)

**GET** `/auth/profile`

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Respuesta:

```json
{
  "userId": "1234567890",
  "email": "usuario@ejemplo.com",
  "roles": ["user"]
}
```

### 4. Área de Admin (Solo ADMIN)

**GET** `/auth/admin-only`

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Requiere rol ADMIN**

Respuesta:

```json
{
  "message": "¡Bienvenido Admin!",
  "user": {
    "userId": "1234567890",
    "email": "admin@ejemplo.com",
    "roles": ["admin"]
  }
}
```

### 5. Área de Entrenadores (ADMIN o TRAINER)

**GET** `/auth/trainer-area`

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Requiere rol ADMIN o TRAINER**

Respuesta:

```json
{
  "message": "Área de entrenadores",
  "user": {
    "userId": "1234567890",
    "email": "trainer@ejemplo.com",
    "roles": ["trainer"]
  }
}
```

## Cómo usar Roles en tus propios endpoints

### Ejemplo 1: Proteger una ruta para ADMIN

```typescript
@Get('admin-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
adminDashboard(@CurrentUser() user) {
  return { message: 'Dashboard de Admin', user };
}
```

### Ejemplo 2: Múltiples roles permitidos

```typescript
@Post('create-workout')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.TRAINER)
createWorkout(@CurrentUser() user, @Body() workoutDto) {
  return { message: 'Rutina creada por', user };
}
```

### Ejemplo 3: Solo autenticación (sin restricción de rol)

```typescript
@Get('my-workouts')
@UseGuards(JwtAuthGuard)
getMyWorkouts(@CurrentUser() user) {
  return { message: 'Tus rutinas', user };
}
```

## Testing con diferentes roles

### 1. Crear un usuario regular:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@test.com",
    "password":"123456",
    "name":"Regular User"
  }'
```

### 2. Crear un admin:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"admin@test.com",
    "password":"admin123",
    "name":"Admin User",
    "roles":["admin","user"]
  }'
```

### 3. Crear un trainer:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"trainer@test.com",
    "password":"trainer123",
    "name":"Trainer User",
    "roles":["trainer","user"]
  }'
```

### 4. Probar rutas protegidas:

Login como admin:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

Acceder a ruta de admin:

```bash
curl -X GET http://localhost:3000/auth/admin-only \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Códigos de respuesta

- **200 OK** - Operación exitosa
- **201 Created** - Recurso creado exitosamente
- **401 Unauthorized** - No autenticado o token inválido
- **403 Forbidden** - Autenticado pero sin permisos suficientes
- **404 Not Found** - Recurso no encontrado

## Estructura de archivos

```
src/auth/
├── decorators/
│   ├── current-user.decorator.ts  # Obtener usuario actual
│   └── roles.decorator.ts         # Decorador @Roles()
├── dto/
│   ├── login.dto.ts              # DTO para login
│   └── register.dto.ts           # DTO para registro
├── enums/
│   └── role.enum.ts              # Enum de roles
├── guards/
│   ├── jwt-auth.guard.ts         # Guard de autenticación
│   └── roles.guard.ts            # Guard de autorización por roles
├── strategies/
│   └── jwt.strategy.ts           # Estrategia JWT de Passport
├── auth.controller.ts            # Controlador de rutas
├── auth.module.ts                # Módulo de autenticación
└── auth.service.ts               # Lógica de negocio
```

## Notas de seguridad

⚠️ **IMPORTANTE en Producción:**

1. Cambia el `JWT_SECRET` en `.env` por una clave segura
2. Usa una base de datos real (PostgreSQL, MongoDB, etc.)
3. Implementa refresh tokens para mayor seguridad
4. Agrega rate limiting para prevenir ataques
5. Implementa validación de DTOs con class-validator
6. Usa HTTPS en producción
7. Implementa logout y revocación de tokens

## Próximos pasos recomendados

1. **Integrar base de datos real** (TypeORM/Prisma)
2. **Validación de DTOs** con class-validator
3. **Refresh Tokens** para renovar tokens expirados
4. **Rate Limiting** para prevenir abuso
5. **Logging** de intentos de acceso
6. **2FA (Two-Factor Authentication)** para mayor seguridad
