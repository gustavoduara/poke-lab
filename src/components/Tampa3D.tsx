import { useCallback, useMemo, useRef } from 'react'
import { BackSide, FrontSide, Group, LatheGeometry, Vector2 } from 'three'
import { criarPlastico } from './plastico'
import { useAnimacao } from './animacao'

// Perfil da tampa [raio, altura]: encaixe na borda, cúpula e topo achatado.
const perfil = [
  [1.89, 0.725], [1.9, 0.77], [1.8, 0.79], [1.74, 0.9], [1.62, 1.09],
  [1.44, 1.2], [1.18, 1.24], [1.08, 1.2], [0.4, 1.2], [0, 1.2],
].map(([x, y]) => new Vector2(x, y))

const frisos: [number, number, number][] = [
  [1.9, 0.765, 0.018],
  [1.79, 0.795, 0.01],
  [1.18, 1.238, 0.012],
]

const DURACAO = 1.1

export default function Tampa3D() {
  const grupo = useRef<Group>(null)
  const { geometria, fundo, frente, friso } = useMemo(
    () => ({
      geometria: new LatheGeometry(perfil, 128),
      fundo: criarPlastico(BackSide, 0.05),
      frente: criarPlastico(FrontSide, 0.05),
      friso: criarPlastico(FrontSide, 0.25),
    }),
    [],
  )

  const descer = useCallback((tempo: number) => {
    const p = Math.min(1, tempo / DURACAO)
    const y =
      p < 0.8
        ? 2.6 * (1 - (p / 0.8) ** 2)
        : 0.08 * Math.sin(((p - 0.8) / 0.2) * Math.PI) // quique do encaixe
    if (!grupo.current) return
    grupo.current.position.y = y
    grupo.current.rotation.z = 0.35 * (1 - Math.min(1, p / 0.8))
  }, [])
  useAnimacao(DURACAO, descer)

  return (
    <group ref={grupo}>
      <mesh geometry={geometria} material={fundo} renderOrder={4} />
      <mesh geometry={geometria} material={frente} renderOrder={5} />
      {frisos.map(([raio, altura, grossura]) => (
        <mesh
          key={raio}
          position-y={altura}
          rotation-x={Math.PI / 2}
          material={friso}
          renderOrder={6}
        >
          <torusGeometry args={[raio, grossura, 10, 128]} />
        </mesh>
      ))}
    </group>
  )
}
