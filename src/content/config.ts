// Import utilities from 'astro:content'
import { z, defineCollection } from "astro:content"

//Define a 'type' and 'scheme' for each collection
const experience = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        role: z.string(),
        desc: z.string(),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
    }),
})

const projects = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        githubLink: z.string(),
        showOnFrontpage: z.boolean(),
        demoLink: z.string().optional(),
        image: z.object({
            src: z.string(),
            alt: z.string(),
        }).optional(),
        tags: z.array(z.string()),
    }),
})

export const collections = { experience, projects }
