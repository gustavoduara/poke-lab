import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Vector3 } from 'three'

export const POSICAO_INICIAL: [number, number, number] = [0, 3.7, 5.3]

type Props = {
  distancia: number | null // distância para ver a coluna inteira; null com o bowl montado
  cancelada: boolean // verdadeiro quando a pessoa assume o controle com o mouse
}

// Leva a câmera até o melhor ponto de vista ao separar ou montar o bowl.
export default function CameraGuiada({ distancia, cancelada }: Props) {
  const camera = useThree((estado) => estado.camera)
  const { width, height } = useThree((estado) => estado.size)
  const alvo = useRef<Vector3 | null>(null)
  const anterior = useRef(distancia)

  useEffect(() => {
    if (anterior.current === distancia) return
    anterior.current = distancia
    alvo.current =
      distancia === null
        ? new Vector3(...POSICAO_INICIAL)
        : new Vector3(0, 0.26, 0.966).multiplyScalar(distancia)
  }, [distancia])

  useEffect(() => {
    if (cancelada) alvo.current = null
  }, [cancelada])

  // Em telas estreitas, a coluna vai para a esquerda para sobrar espaço aos nomes.
  const deslocar = distancia !== null && width < 600
  useEffect(() => {
    if (!deslocar || !(camera instanceof PerspectiveCamera)) return
    camera.setViewOffset(width, height, width * 0.14, 0, width, height)
    return () => camera.clearViewOffset()
  }, [camera, deslocar, width, height])

  useFrame((_, delta) => {
    if (!alvo.current) return
    camera.position.lerp(alvo.current, 1 - Math.exp(-4 * Math.min(delta, 1 / 20)))
    camera.lookAt(0, 0, 0)
    if (camera.position.distanceTo(alvo.current) < 0.02) alvo.current = null
  })

  return null
}
