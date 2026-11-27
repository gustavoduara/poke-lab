import { useRef } from 'react'

// Dá a cada ingrediente uma fatia do bowl, que ele mantém enquanto estiver no pedido.
export function useFatiasFixas(ids: string[], disponiveis: number[]) {
  const guardadas = useRef(new Map<string, number>())
  const mapa = guardadas.current

  for (const id of mapa.keys()) {
    if (!ids.includes(id)) mapa.delete(id)
  }
  for (const id of ids) {
    if (mapa.has(id)) continue
    const ocupadas = new Set(mapa.values())
    mapa.set(id, disponiveis.find((fatia) => !ocupadas.has(fatia))!)
  }

  return ids.map((id) => ({ id, fatia: mapa.get(id)! }))
}
