import { useEffect, useMemo, useState } from 'react'
import { etapas } from '../data/cardapio'
import type { Selecao } from '../data/pedido'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Entrega um poke pronto aos poucos, um ingrediente de cada vez, para animar a montagem.
export function useMontagem(selecao: Selecao, intervalo = 750, inicio = 600) {
  const passos = useMemo(
    () =>
      etapas.flatMap((etapa) =>
        (selecao[etapa.id] ?? []).map((id) => ({ etapa: etapa.id, id })),
      ),
    [selecao],
  )
  const [feitos, setFeitos] = useState(semAnimacao ? passos.length : 0)

  useEffect(() => {
    if (feitos >= passos.length) return
    // Depois do molho, espera a bisnaga terminar antes do próximo ingrediente.
    const pausa = passos[feitos - 1]?.etapa === 'molho' ? 3200 : intervalo
    const espera = setTimeout(() => setFeitos(feitos + 1), feitos ? pausa : inicio)
    return () => clearTimeout(espera)
  }, [feitos, passos, intervalo, inicio])

  const parcial = useMemo(() => {
    const resultado: Selecao = {}
    for (const { etapa, id } of passos.slice(0, feitos)) {
      resultado[etapa] = [...(resultado[etapa] ?? []), id]
    }
    return resultado
  }, [passos, feitos])

  return {
    parcial,
    feitos,
    total: passos.length,
    completo: feitos >= passos.length,
    atual: passos[feitos - 1]?.id,
    reiniciar: () => setFeitos(0),
  }
}
