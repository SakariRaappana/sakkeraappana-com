import { defineCollection, z } from 'astro:content';

const seikkailut = defineCollection({
  type: 'content',
  schema: z.object({
    nimi: z.string(),
    paikka: z.string(),
    vuosi: z.number(),
    kesto: z.string(),
    km: z.number().optional(),
    tiivistelma: z.string(),
    kuva: z.string().optional(),
    elokuva: z.string().url().optional(),
    videot: z.array(z.object({
      url: z.string().url(),
      nimi: z.string().optional(),
    })).optional(),
    osallistujat: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    kaynnissa: z.boolean().default(false),
    vuodenaika: z.string().optional(),
    olosuhteet: z.string().optional(),
    nousu: z.string().optional(),
    koordinaatit: z.string().optional(),
    omavaraisuus: z.string().optional(),
    lahtopaikka: z.string().optional(),
    energiansaanti: z.string().optional(),
    painonmuutos: z.string().optional(),
  }),
});

export const collections = { seikkailut };
