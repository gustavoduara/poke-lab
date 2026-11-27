import { Canvas } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import { DoubleSide, Vector2 } from 'three'
import Base3D, { type TipoBase } from './Base3D'
import Porcao3D from './Porcao3D'
import Molho3D, { type TipoMolho } from './Molho3D'
import Crocante3D, { type TipoCrocante } from './Crocante3D'
import { receitas } from './receitas'
import { fatiasComplemento, fatiasProteina } from './terreno'
import { useFatiasFixas } from './fatias'

// Perfil do bowl (raio, altura), girado em torno do eixo vertical.
// Começa no centro do fundo, sobe por fora, contorna a borda e desce por dentro.
const pontos = (lista: [number, number][]) => lista.map(([x, y]) => new Vector2(x, y))

const perfilExterno = pontos([
  [0, -0.62], [0.68, -0.62], [0.76, -0.74], [0.9, -0.74], [0.95, -0.6],
  [1.3, -0.38], [1.6, -0.02], [1.76, 0.38], [1.82, 0.7],
])

const perfilBorda = pontos([
  [1.82, 0.7], [1.8, 0.75], [1.75, 0.77], [1.7, 0.75], [1.68, 0.7],
])

const perfilInterno = pontos([
  [1.68, 0.7], [1.62, 0.4], [1.46, 0.05], [1.17, -0.26], [0.75, -0.45],
  [0.35, -0.52], [0, -0.53],
])

function Parte({ perfil, cor }: { perfil: Vector2[]; cor: string }) {
  return (
    <mesh>
      <latheGeometry args={[perfil, 96]} />
      <meshStandardMaterial color={cor} roughness={0.35} metalness={0.05} side={DoubleSide} />
    </mesh>
  )
}

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export type Pedido = Record<string, string[]>

export default function Bowl3D({ pedido }: { pedido: Pedido }) {
  const base = pedido.base?.[0] as TipoBase | undefined
  const molho = pedido.molho?.[0] as TipoMolho | undefined
  const proteinas = useFatiasFixas(pedido.proteina ?? [], fatiasProteina)
  const complementos = useFatiasFixas(pedido.complementos ?? [], fatiasComplemento)
  const porcoes = [...proteinas, ...complementos]
  const fatiasOcupadas = porcoes.map((porcao) => porcao.fatia)

  return (
    <Canvas camera={{ position: [0, 3.7, 5.3], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 2]} intensity={2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffd9c7" />

      <Parte perfil={perfilExterno} cor="#2c4a4e" />
      <Parte perfil={perfilBorda} cor="#e9dfcc" />
      <Parte perfil={perfilInterno} cor="#efe7d6" />
      {base && <Base3D key={base} tipo={base} />}
      {porcoes.map(({ id, fatia }) => (
        <Porcao3D key={id} receita={receitas[id]} fatia={fatia} temBase={!!base} />
      ))}
      {molho && <Molho3D key={molho} tipo={molho} fatias={fatiasOcupadas} temBase={!!base} />}
      {pedido.crocante?.map((id, i) => (
        <Crocante3D
          key={id}
          tipo={id as TipoCrocante}
          ordem={i}
          fatias={fatiasOcupadas}
          temBase={!!base}
        />
      ))}

      <ContactShadows position={[0, -0.75, 0]} opacity={0.5} scale={6} blur={2.4} far={2} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!semAnimacao}
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 8}
        maxPolarAngle={Math.PI / 2.2}
      />
    </Canvas>
  )
}
