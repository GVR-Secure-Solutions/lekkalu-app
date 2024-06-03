import z from 'zod'

const addScenarioSchemas = z.object({
  name: z.string(),
  access: z.enum(['Private', 'Public']).optional(),
})

type AddScenarioSchemas = z.infer<typeof addScenarioSchemas>

export { AddScenarioSchemas, addScenarioSchemas }
