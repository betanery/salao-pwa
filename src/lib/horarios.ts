export const gerarHorarios = (inicio = 8, fim = 19.5, passoMin = 30) => {
  const slots: string[] = []
  for (let minutos = inicio * 60; minutos <= fim * 60; minutos += passoMin) {
    const h = Math.floor(minutos / 60)
    const m = minutos % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
  }
  return slots
}

export const addDaysISO = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00`)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const weekDayLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' })

export const dayMonthLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
