import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Matrix4 } from 'three'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Chama "desenhar" a cada quadro com o tempo decorrido, até chegar na duração total.
// Quando o desenho muda depois de pronto, ele é refeito já no estado final.
export function useAnimacao(total: number, desenhar: (tempo: number) => void) {
  const tempo = useRef(semAnimacao ? Infinity : 0)

  useLayoutEffect(() => {
    desenhar(tempo.current)
  }, [desenhar])

  useFrame((_, delta) => {
    if (tempo.current >= total) return
    // O limite evita que a animação pule se a aba ficar parada.
    tempo.current += Math.min(delta, 1 / 30)
    desenhar(tempo.current)
  })
}

const ALTURA_QUEDA = 2.2
const DURACAO_QUEDA = 0.55

// Quanto o pedaço ainda está acima do lugar final (progresso de 0 a 1).
function alturaNaQueda(progresso: number) {
  // Cai acelerando e depois dá um pequeno quique.
  if (progresso < 0.78) return ALTURA_QUEDA * (1 - (progresso / 0.78) ** 2)
  return 0.07 * Math.sin(((progresso - 0.78) / 0.22) * Math.PI)
}

const invisivel = new Matrix4().makeScale(0, 0, 0)

// Faz as cópias de uma malha caírem uma depois da outra.
export function useQueda(
  ref: RefObject<InstancedMesh | null>,
  matrizes: Matrix4[],
  { atraso = 0, espalhamento = 0.5 } = {},
) {
  const desenhar = useCallback(
    (tempo: number) => {
      const malha = ref.current
      if (!malha) return
      const matriz = new Matrix4()
      matrizes.forEach((final, i) => {
        const inicio = atraso + (i / matrizes.length) * espalhamento
        const progresso = Math.min(1, (tempo - inicio) / DURACAO_QUEDA)
        if (progresso < 0) {
          malha.setMatrixAt(i, invisivel)
          return
        }
        matriz.copy(final)
        if (progresso < 1) matriz.elements[13] += alturaNaQueda(progresso) // posição vertical
        malha.setMatrixAt(i, matriz)
      })
      malha.instanceMatrix.needsUpdate = true
    },
    [ref, matrizes, atraso, espalhamento],
  )

  useAnimacao(atraso + espalhamento + DURACAO_QUEDA, desenhar)
}
