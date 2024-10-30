import prisma from "../prisma";
import { generateJobSlug } from "../../slugfy";

interface RequiredFields {
  name: string;
  price: number;
  description: string;
  img: string;
  company_name: string;
  id_cat: string;
  images: string[];
  location: string;
  requirements: string;
}

export default async function jobCreatePrisma(
  info: RequiredFields
) {
  const slug = generateJobSlug(info.name);
  const job = await prisma.jobs.create({
    data: {
      ...info,
      slug,
      published_at: new Date(),
      state: 'pending',
      v: 1, 
    },
  });
  return job;
}
