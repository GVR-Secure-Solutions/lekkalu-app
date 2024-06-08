import { Accounts, AddAccountSchema, AddTransactionSchema } from '@/types/lending'
import { apiv2Client } from '@/utils/client'

// Lending Accounts
export async function fetchLendingAccounts() {
  const { data } = await apiv2Client.get<Array<Accounts>>('/lending_accounts')
  return data
}

export async function addLendingAccount(dto: AddAccountSchema) {
  const { data } = await apiv2Client.post<{ data: AddAccountSchema }>('/lending_accounts', dto)
  return data
}

export async function updateLendingAccount(id: number, dto: AddAccountSchema) {
  const { data } = await apiv2Client.put<{ data: AddAccountSchema }>(`/lending_accounts/${id}`, dto)
  return data
}

export async function deleteLendingAccount(id: number) {
  const { data } = await apiv2Client.delete(`/lending_accounts/${id}`)
  return data
}

// Lending Transactions
export async function fetchLendingTransaction() {
  const { data } = await apiv2Client.get<Array<AddTransactionSchema>>('/lending_transactions')
  return data
}

export async function fetchLendingTransactionById(id: number) {
  const { data } = await apiv2Client.get<Array<Accounts>[]>(`/lending_transactions/${id}/`)
  return data
}

export async function addLendingTransaction(dto: AddTransactionSchema) {
  const { data } = await apiv2Client.post<{ data: AddTransactionSchema }>('/lending_transactions', dto)
  return data
}

export async function updateLendingTransaction(id: number, dto: AddTransactionSchema) {
  const { data } = await apiv2Client.put<{ data: AddTransactionSchema }>(`/lending_transactions/${id}`, dto)
  return data
}

export async function deleteLendingTransaction(id: number) {
  const { data } = await apiv2Client.delete(`/lending_transactions/${id}`)
  return data
}
