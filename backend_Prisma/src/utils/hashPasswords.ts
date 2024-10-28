import argon2 from "argon2";

// Función para hashear la contraseña
export async function hashPassword(password: string) {
  // Hashear la contraseña utilizando argon2
  return await argon2.hash(password);
}

// Función para comparar la contraseña en texto plano con el hash
export async function compareWithHash(password: string, hash: string) {
  console.log(password, hash);
  const isMatch = await argon2.verify(hash, password);
  console.log(isMatch);
  return isMatch;
}
