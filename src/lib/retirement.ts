export type RetirementInputs = {
  age: number
  retireAge: number
  savings: number // today
  monthly: number // saved each month
  returnPct: number // expected yearly return, before inflation
  inflationPct: number
  goal: number // in today's money
}

export type ProjectionPoint = { age: number; value: number }

/**
 * Yearly projection in today's money: grows at the real return
 * (return minus inflation) with a year of monthly savings added each year.
 */
export function project(i: RetirementInputs): ProjectionPoint[] {
  const real = (1 + i.returnPct / 100) / (1 + i.inflationPct / 100) - 1
  const years = Math.max(0, Math.round(i.retireAge - i.age))
  const points: ProjectionPoint[] = [{ age: i.age, value: i.savings }]
  let v = i.savings
  for (let y = 1; y <= years; y++) {
    v = v * (1 + real) + i.monthly * 12
    points.push({ age: i.age + y, value: v })
  }
  return points
}

export function summarise(i: RetirementInputs) {
  const points = project(i)
  const atRetirement = points.at(-1)!.value
  const reached = points.find((p) => p.value >= i.goal)
  return {
    points,
    atRetirement,
    difference: atRetirement - i.goal,
    reachAge: reached?.age ?? null,
    progressToday: i.goal > 0 ? i.savings / i.goal : 0,
    gapToday: Math.max(0, i.goal - i.savings),
    years: Math.max(0, i.retireAge - i.age),
  }
}
