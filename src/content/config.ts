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

export const collections = { experience }
