import prisma from "../prisma";

export default async function userCreatePrisma(
  username: string,
  email: string,
  password: string
) {
  const user = await prisma.usersEnterprise.create({
    data: { 
        username,
        email, 
        password,
        image: "https://static.productionready.io/images/smiley-cyrus.jpg",
        createdAt: new Date(), // Si no lo maneja automáticamente, puedes establecerlo manualmente
        updatedAt: new Date(), // Igual que arriba
        v: 0
    },
  });
  return user;
}