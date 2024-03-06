// Import utilities from 'astro:content'
import { z, defineCollection } from "astro:content"

//Define a 'type' and 'scheme' for each collection
const experience = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        role: z.string(),
        desc: z.string().max(180),
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        type: z.enum(["work", "school", "certificate"]),
    }),
})

const projects = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            shortDesc: z.string(),
            githubLink: z.string(),
            livedemoLink: z.string().optional(),
            banner: z
                .object({
                    image: image(),
                    alt: z.string(),
                })
                .optional(),
            showOnFrontpage: z.boolean(),
            date: z.coerce.date(),
            tags: z.array(z.string()),
        }),
})

const socials = defineCollection({
    type: "data",
    schema: z.object({
        link: z.string(),
        name: z.string(),
        icon: z.string(),
    }),
})

const skills = defineCollection({
    type: "content",
    schema: z.object({
        name: z.string(),
    }),
})

export const collections = { experience, projects, socials, skills }
