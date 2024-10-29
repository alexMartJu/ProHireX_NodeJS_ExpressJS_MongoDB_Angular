import { jobs } from "@prisma/client";

export default function jobViewer(job: jobs) {
  return {
    id: job.id,
    title: job.name,                  
    company_name: job.company_name,    
    location: job.location,            
    price: job.price,                  
    published_at: job.published_at,     
    requirements: job.requirements,     
    img: job.img,                 
    slug: job.slug,                     
    state: job.state                    
  };
}
