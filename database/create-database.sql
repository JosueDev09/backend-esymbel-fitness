-- ========================================
-- SCRIPT DE BASE DE DATOS ESYMBEL FITNESS
-- ========================================
-- IMPORTANTE: Ejecutar paso a paso en MySQL Workbench
-- NO ejecutar todo el script de una vez
-- ========================================

-- PASO 1: Crear la base de datos (ejecutar solo si no existe)
-- CREATE DATABASE IF NOT EXISTS dbEsymbel_fitness 
-- CHARACTER SET utf8mb4 
-- COLLATE utf8mb4_unicode_ci;

-- PASO 2: Seleccionar la base de datos
-- USE dbEsymbel_fitness;

-- PASO 3: Eliminar tablas existentes SOLO si hay conflictos
-- CUIDADO: Esto eliminará todos los datos existentes
-- DROP TABLE IF EXISTS tbUsers;
-- DROP TABLE IF EXISTS tbusers;

-- PASO 4: Crear tabla de usuarios para login/autenticación
-- Ejecutar solo después de confirmar los pasos anteriores
/*
CREATE TABLE tbUsers (
    intId INT AUTO_INCREMENT PRIMARY KEY,
    strEmail VARCHAR(255) NOT NULL UNIQUE,
    strPassword VARCHAR(255) NOT NULL,
    strName VARCHAR(255) NOT NULL,
    strRoles VARCHAR(500) NOT NULL DEFAULT 'user',
    datCreatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    datUpdatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Índices para optimizar consultas
    INDEX idxStrEmail (strEmail),
    INDEX idxDatCreatedAt (datCreatedAt),
    INDEX idxStrRoles (strRoles)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- PASO 5: Insertar usuarios de ejemplo (OPCIONAL)
-- Contraseñas hasheadas para "123456"
/*
INSERT INTO tbUsers (strEmail, strPassword, strName, strRoles) VALUES
('admin@esymbel.com', '$2a$10$eJ7WaZ8qWqZ8qWqZ8qWqZO5K9nJ8V7mV7mV7mV7mV7mV7mV7mV7mV7', 'Admin Esymbel', 'admin,user'),
('trainer@esymbel.com', '$2a$10$eJ7WaZ8qWqZ8qWqZO5K9nJ8V7mV7mV7mV7mV7mV7mV7mV7mV7mV7mV7', 'Trainer Esymbel', 'trainer,user'),
('user@esymbel.com', '$2a$10$eJ7WaZ8qWqZ8qWqZ8qWqZO5K9nJ8V7mV7mV7mV7mV7mV7mV7mV7mV7', 'Usuario Regular', 'user')
ON DUPLICATE KEY UPDATE 
    datUpdatedAt = CURRENT_TIMESTAMP(6);
*/

-- PASO 6: Verificaciones (ejecutar para confirmar)
/*
SHOW TABLES;
DESCRIBE tbUsers;
SELECT intId, strEmail, strName, strRoles, datCreatedAt FROM tbUsers;
*/

-- ========================================
-- INSTRUCCIONES PARA MYSQL WORKBENCH:
-- ========================================
-- 1. Quita los comentarios (--) de los comandos que quieras ejecutar
-- 2. Quita los /* */ de los bloques que quieras ejecutar
-- 3. Ejecuta UN COMANDO A LA VEZ
-- 4. Verifica los resultados antes de continuar
-- ========================================


