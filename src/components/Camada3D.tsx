import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { Group, MathUtils } from 'three'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export type Destino = {
  altura: number // onde a camada para quando o bowl está separado
  escala: number
  atraso: number // segundos até começar a se mover
  numero: number
  nome: string
  afastamento: number // distância do nome até o centro, em pixels
}

type Props = {
  centro: [number, number, number] // centro da camada com o bowl montado
  destino?: Destino // sem destino, a camada fica no lugar
  children: ReactNode
}

// Move uma parte do bowl entre o lugar original e a sua posição na coluna.
export default function Camada3D({ centro, destino, children }: Props) {
  const movel = useRef<Group>(null)
  const interno = useRef<Group>(null)
  const rotulo = useRef<HTMLDivElement>(null)
  const estado = useRef({ avanco: 0, espera: 0, giro: 0 })
  // Guarda o último destino para a camada conseguir voltar suavemente.
  const ultimo = useRef(destino)
  if (destino) ultimo.current = destino

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 20)
    const e = estado.current

    if (destino) {
      e.espera += dt
      if (semAnimacao) e.avanco = 1
      else if (e.espera >= destino.atraso) e.avanco = Math.min(1, e.avanco + dt / 0.8)
      if (!semAnimacao) e.giro += dt * 0.9 * e.avanco
    } else {
      e.espera = 0
      e.avanco = semAnimacao ? 0 : Math.max(0, e.avanco - dt / 0.6)
      // Reduz o giro a menos de meia volta, para voltar pelo caminho mais curto.
      e.giro = MathUtils.euclideanModulo(e.giro + Math.PI, Math.PI * 2) - Math.PI
    }

    const alvo = ultimo.current
    const p = MathUtils.smootherstep(e.avanco, 0, 1)
    const [x, y, z] = centro
    movel.current?.position.set(
      MathUtils.lerp(x, 0, p),
      // Um pequeno arco faz a camada "saltar" para fora do pote.
      MathUtils.lerp(y, alvo?.altura ?? y, p) + Math.sin(p * Math.PI) * 0.35,
      MathUtils.lerp(z, 0, p),
    )
    movel.current?.scale.setScalar(MathUtils.lerp(1, alvo?.escala ?? 1, p))
    if (movel.current) movel.current.rotation.y = e.giro * p
    interno.current?.position.set(-x, -y, -z)

    if (rotulo.current) {
      rotulo.current.classList.toggle('visivel', !!destino && e.avanco > 0.85)
    }
  })

  return (
    <>
      <group ref={movel} position={centro}>
        <group ref={interno} position={[-centro[0], -centro[1], -centro[2]]}>
          {children}
        </group>
      </group>
      {destino && (
        <Html position={[0, destino.altura, 0]} zIndexRange={[60, 51]} style={{ pointerEvents: 'none' }}>
          <div
            ref={rotulo}
            className="rotulo"
            style={{ marginLeft: destino.afastamento }}
          >
            <span>{destino.numero}</span>
            {destino.nome}
          </div>
        </Html>
      )}
    </>
  )
}
