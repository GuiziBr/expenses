export const formatAmount = (valueInCents: number = 0): string => Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(valueInCents / 100)
