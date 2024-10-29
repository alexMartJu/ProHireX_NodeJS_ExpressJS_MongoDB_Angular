import prisma from "../prisma";

export default async function jobsListPrisma(companyName: string) {
    return await prisma.jobs.findMany({
        where: {
            company_name: companyName,
        },
    });
}