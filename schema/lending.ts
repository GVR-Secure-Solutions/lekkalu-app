import z from 'zod'

// ** Lending Account Schema
export const addAccountSchema = z.object({
  type: z.string(),
  name: z.string(),
  principal: z.coerce.number(),
  started: z.date(),
  partner_email: z.string().email('Invalid Email Address!').optional(),
})
export const addTransactionSchema = z.object({
  amount: z.coerce.number(),
  time: z.date(),
  type: z.enum(['lend', 'borrow']),
})

// ** Lending Transaction Schema
export type AddTransactionSchema = {
  id?: number
  lending_account:
    | string
    | {
        id?: string
        name: string
        value: string
      }[]

  partner_email?: string
  time: Date
  amount: number | string | null
  note?: string
  payment_method?: string
  reference_no?: string
  type: 'lend' | 'borrow'
}
