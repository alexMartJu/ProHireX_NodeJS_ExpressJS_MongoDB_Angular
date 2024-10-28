import prisma from "../prisma";

export default async function userGetPrisma(username: string) {
  if (!username) return null;
  const user = await prisma.usersEnterprise.findUnique({
    where: { username },
  });
  return user;
}