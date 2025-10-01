# API de Autenticación - Documentación

## Endpoints disponibles

### 1. Registro de usuario

**POST** `/auth/register`

Body:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tuContraseña123",
  "name": "Tu Nombre"
}
```

Respuesta:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "usuario@ejemplo.com",
    "name": "Tu Nombre"
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
    "name": "Tu Nombre"
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
  "email": "usuario@ejemplo.com"
}
```

## Cómo probar la API

### Usando Thunder Client / Postman / Insomnia:

1. **Registrar un usuario:**
   - Method: POST
   - URL: `http://localhost:3000/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "test@test.com",
       "password": "123456",
       "name": "Test User"
     }
     ```

2. **Login:**
   - Method: POST
   - URL: `http://localhost:3000/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@test.com",
       "password": "123456"
     }
     ```
   - Copia el `access_token` de la respuesta

3. **Acceder al perfil (ruta protegida):**
   - Method: GET
   - URL: `http://localhost:3000/auth/profile`
   - Headers:
     - Key: `Authorization`
     - Value: `Bearer TU_ACCESS_TOKEN_AQUI`

## Usando cURL:

```bash
# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Perfil (usa el token que obtuviste del login)
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## Seguridad

- Las contraseñas se hashean con bcrypt antes de guardarse
- Los tokens JWT expiran en 24 horas
- Cambia el `JWT_SECRET` en el archivo `.env` para producción

## Notas importantes

⚠️ **IMPORTANTE**: Esta implementación usa un array en memoria para almacenar usuarios (solo para desarrollo/demostración). En producción debes usar una base de datos real como PostgreSQL, MySQL o MongoDB con TypeORM o Prisma.
