import { Accounts, AddAccountSchema, AddTransactionSchema, Transaction } from '@/types/lending'
import { apiv2Client } from '@/utils/client'

// Lending Accounts
export async function fetchLendingAccounts() {
  const { data } = await apiv2Client.get<Array<Accounts>>('/lending_accounts')
  return data
}

export async function fetchLendingAccountById(id: string) {
  const { data } = await apiv2Client.get<Accounts>(`/lending_accounts/${id}`)
  return data
}

export async function addLendingAccount(dto: AddAccountSchema) {
  const { data } = await apiv2Client.post<{ data: AddAccountSchema }>('/lending_accounts', dto)
  return data
}

export async function updateLendingAccount(id: string, dto: AddAccountSchema) {
  const { data } = await apiv2Client.put<{ data: AddAccountSchema }>(`/lending_accounts/${id}`, dto)
  return data
}

export async function deleteLendingAccount(id: number) {
  const { data } = await apiv2Client.delete(`/lending_accounts/${id}`)
  return data
}

// Lending Transactions
export async function fetchLendingTransaction() {
  const { data } = await apiv2Client.get<Array<Transaction>>('/lending_transactions')
  return data
}

export async function fetchLendingTransactionById(id: string) {
  const { data } = await apiv2Client.get<Array<Accounts>[]>(`/lending_transactions/${id}/`)
  return data
}

export async function addLendingTransaction(dto: Omit<AddTransactionSchema, 'type'>) {
  const { data } = await apiv2Client.post<{ data: AddTransactionSchema }>('/lending_transactions', dto)
  return data
}

export async function updateLendingTransaction(id: number, dto: Omit<AddTransactionSchema, 'type'>) {
  const { data } = await apiv2Client.put<{ data: AddTransactionSchema }>(`/lending_transactions/${id}`, dto)
  return data
}

export async function deleteLendingTransaction(id: number) {
  const { data } = await apiv2Client.delete(`/lending_transactions/${id}`)
  return data
}
