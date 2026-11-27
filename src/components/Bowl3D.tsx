import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import Pote3D from './Pote3D'
import Base3D, { type TipoBase } from './Base3D'
import Porcao3D from './Porcao3D'
import Molho3D, { type TipoMolho } from './Molho3D'
import Crocante3D, { type TipoCrocante } from './Crocante3D'
import { receitas } from './receitas'
import { fatiasComplemento, fatiasProteina } from './terreno'
import { useFatiasFixas } from './fatias'

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
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 2]} intensity={1.7} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#ffd9c7" />

      {/* Painéis de luz que aparecem refletidos no plástico, como em um estúdio. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[7, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 2, 1]} scale={[1, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1.5, 0]} scale={[0.5, 5, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[2, 3, 5]} scale={1.5} />
      </Environment>

      <Pote3D />
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

      <ContactShadows position={[0, -0.59, 0]} opacity={0.3} scale={6} blur={2.4} far={2} />

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
