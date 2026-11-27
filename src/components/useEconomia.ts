import { useEffect, useState } from 'react'
import type { Nivel } from '../qualidade'

const DESCANSO = 25_000 // no modo leve, para de desenhar depois deste tempo parado

// Decide se o 3D precisa continuar desenhando: pausa fora da tela, com a aba escondida
// e, no modo leve, quando ninguém mexe. A última imagem continua visível.
export function useEconomia(nivel: Nivel, atividade: unknown) {
  const [elemento, setElemento] = useState<Element | null>(null)
  const [naTela, setNaTela] = useState(true)
  const [abaVisivel, setAbaVisivel] = useState(!document.hidden)
  const [parado, setParado] = useState(false)
  const [toques, setToques] = useState(0)

  useEffect(() => {
    if (!elemento) return
    const observador = new IntersectionObserver(([entrada]) => setNaTela(entrada.isIntersecting))
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [elemento])

  useEffect(() => {
    const mudou = () => setAbaVisivel(!document.hidden)
    document.addEventListener('visibilitychange', mudou)
    return () => document.removeEventListener('visibilitychange', mudou)
  }, [])

  // Um toque, o mouse ou uma mudança de tamanho acordam o 3D.
  useEffect(() => {
    const acordar = () => {
      setParado(false)
      setToques((atual) => atual + 1)
    }
    const acordarSeParado = () => {
      if (parado) acordar()
    }
    elemento?.addEventListener('pointerdown', acordar)
    elemento?.addEventListener('pointermove', acordarSeParado)
    window.addEventListener('resize', acordar)
    return () => {
      elemento?.removeEventListener('pointerdown', acordar)
      elemento?.removeEventListener('pointermove', acordarSeParado)
      window.removeEventListener('resize', acordar)
    }
  }, [elemento, parado])

  const [anterior, setAnterior] = useState(atividade)
  if (anterior !== atividade) {
    setAnterior(atividade)
    setParado(false)
  }

  useEffect(() => {
    if (nivel !== 'leve') return
    const espera = setTimeout(() => setParado(true), DESCANSO)
    return () => clearTimeout(espera)
  }, [nivel, atividade, toques])

  const desenhando = naTela && abaVisivel && !(nivel === 'leve' && parado)
  return { frameloop: desenhando ? ('always' as const) : ('never' as const), observar: setElemento }
}
