import { z } from 'zod'

export const addPhysicalAssetSchema = z.object({
  name: z.string().min(1, 'Asset name is required!'),
  purchase_value: z.coerce.number().min(1, 'Purchase value is required!'),
  purchase_date: z.date(),
  sell_value: z.coerce.number().optional(),
  sell_date: z.date().optional(),
  depreciation_percent: z.coerce.number().min(1, 'Depreciation % is required!'),
  init_dep: z.coerce.number({ required_error: 'Initial depreciation is required!' }),
  market_value: z.coerce.number().optional(),
  type: z.coerce.number(),
  tags: z.array(z.string()),
  months: z.coerce.number(),
  years: z.coerce.number(),
  user: z.number(),
})

export type AddPhysicalAssetSchema = z.infer<typeof addPhysicalAssetSchema>

export const addLiabilitySchema = z.object({
  name: z.string({ required_error: 'Name is required!' }).min(1),
  balance: z.coerce.string({ required_error: 'Balance is required!' }).optional(),
  principal: z.coerce.number({ required_error: 'Principal is required!' }).min(1),
  disbursement_date: z.date({ required_error: 'Disbursement Date is required!' }),
  emi_day: z.coerce.string({ required_error: 'Emi day is required!' }).min(1).max(30).optional(),
  emi: z.coerce.string().optional(),
  tenure: z.coerce.number({ required_error: 'Tenure is required!' }).min(1),
  interest_rate: z.coerce.number({ required_error: 'Interest Rage is required!' }).min(1),
  closure_charges: z.coerce.string({ required_error: 'Closure Charges is required!' }),
})
export type AddLiabilitySchema = Omit<z.infer<typeof addLiabilitySchema>, 'disbursement_date'> & {
  disbursement_date: string
}

export const addPhysicalAssetSchemaForScenario = z.object({
  name: z.string().min(1, 'Asset name is required!'),
  purchase_value: z.coerce.number().min(1, 'Purchase value is required!'),
  purchase_date: z.date(),
  sell_value: z.coerce.number().optional(),
  sell_date: z.date().optional(),
  depreciation_percent: z.coerce.number().min(1, 'Depreciation % is required!'),
  init_dep: z.coerce.number({ required_error: 'Initial depreciation is required!' }).min(1),
  market_value: z.coerce.number().optional(),
  type: z.coerce.number(),
  tags: z.array(z.string()),
})

export type AddPhysicalAssetSchemaForScenario = Omit<
  z.infer<typeof addPhysicalAssetSchemaForScenario>,
  'purchase_date' | 'sell_date'
> & {
  purchase_date: string
  sell_date: string
}
