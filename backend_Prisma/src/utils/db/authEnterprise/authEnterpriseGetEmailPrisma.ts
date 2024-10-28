import prisma from "../prisma";

export default async function usersEnterpriseGetEmailPrisma(email: string) {
  if (!email) return null;

  // Buscar el usuario en el modelo usersEnterprise por email sin incluir relaciones
  const user = await prisma.usersEnterprise.findUnique({
    where: { email },
  });

  return user;
}