export const ASSET_MONTHS = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  label: `${index + 1}`,
}))

export const ASSET_YEARS = Array.from({ length: 41 }, (_, index) => ({
  id: index.toString(),
  label: index.toString(),
}))
