const bcrypt = require('bcryptjs');

// Función para generar hash de contraseña
async function generatePasswordHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`\n🔐 Contraseña: ${password}`);
  console.log(`🔒 Hash: ${hash}\n`);
  return hash;
}

// Función para verificar contraseña
async function verifyPassword(password, hash) {
  const isValid = await bcrypt.compare(password, hash);
  console.log(`\n✅ ¿"${password}" coincide? ${isValid ? 'SÍ' : 'NO'}\n`);
  return isValid;
}

// Ejemplos de uso
async function main() {
  console.log('🚀 Generador de contraseñas hasheadas\n');

  // Generar hashes para diferentes contraseñas
  await generatePasswordHash('admin123');

  // Verificar la contraseña actual
  const currentHash =
    '$2b$10$zWNjcb860CmVQyIEq7N3HuPk1u8J74tOSi9vQVSSrMSzBusD4xzCu';
  await verifyPassword('admin123', currentHash);
}

main().catch(console.error);
