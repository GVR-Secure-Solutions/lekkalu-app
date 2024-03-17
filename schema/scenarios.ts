import z from 'zod'

const addScenarioSchema = z.object({
  name: z.string(),
  assets: z.array(z.string()),
  liabilities: z.array(z.string()),
  income: z.array(z.string()),
})

type AddScenarioSchemaType = z.infer<typeof addScenarioSchema>

export { AddScenarioSchemaType, addScenarioSchema }
