import z from 'zod'

const addScenarioSchemas = z.object({
  name: z.string(),
})

type AddScenarioSchemas = z.infer<typeof addScenarioSchemas>

export { AddScenarioSchemas, addScenarioSchemas }
