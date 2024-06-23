export type Scenario = {
  id: number
  name: string
  imag_password: string
  imag_username: string
  access: 'Private' | 'Public'
}

export type Comparison = {
  access: 'Private' | 'Public'
  id: number
  name: string
  scenarios: Array<string>
  scemarios_objects: Array<Scenario>
}
