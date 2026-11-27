import { useMemo } from 'react'
import { BackSide, FrontSide, LatheGeometry, Vector2 } from 'three'
import { criarPlastico } from './plastico'

// Perfil do pote [raio, altura], girado em torno do eixo vertical: centro levemente
// elevado, anel de apoio, parede curva, um degrau e a aba da borda.
const perfil = [
  [0, -0.5], [0.5, -0.5], [0.58, -0.515], [0.64, -0.565], [0.9, -0.57],
  [0.98, -0.545], [1.08, -0.52], [1.3, -0.38], [1.49, -0.13], [1.6, 0.16],
  [1.66, 0.45], [1.675, 0.55], [1.73, 0.575], [1.745, 0.6], [1.765, 0.72],
  [1.785, 0.745], [1.86, 0.75], [1.885, 0.735], [1.89, 0.71],
].map(([x, y]) => new Vector2(x, y))

// Frisos que pegam a luz, como as dobras de um pote de verdade: [raio, altura, grossura].
const frisos: [number, number, number][] = [
  [1.885, 0.735, 0.018],
  [1.765, 0.725, 0.01],
  [1.71, 0.57, 0.011],
  [0.9, -0.567, 0.012],
  [0.6, -0.53, 0.009],
]

export default function Pote3D() {
  const { parede, fundo, frente, friso } = useMemo(
    () => ({
      parede: new LatheGeometry(perfil, 128),
      // A parede de trás é desenhada antes da parede da frente.
      fundo: criarPlastico(BackSide, 0.05),
      frente: criarPlastico(FrontSide, 0.05),
      friso: criarPlastico(FrontSide, 0.22),
    }),
    [],
  )

  return (
    <group>
      <mesh geometry={parede} material={fundo} renderOrder={1} />
      <mesh geometry={parede} material={frente} renderOrder={2} />
      {frisos.map(([raio, altura, grossura]) => (
        <mesh
          key={`${raio}-${altura}`}
          position-y={altura}
          rotation-x={Math.PI / 2}
          material={friso}
          renderOrder={3}
        >
          <torusGeometry args={[raio, grossura, 10, 128]} />
        </mesh>
      ))}
    </group>
  )
}
