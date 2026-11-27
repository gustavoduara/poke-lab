import { useLayoutEffect, useMemo, useRef, type Ref } from 'react'
import { DoubleSide, InstancedMesh, MeshStandardMaterial, SphereGeometry, Vector3 } from 'three'
import { cuboSalmao, texturaSalmao } from '../components/salmao'
import { texturaAtum, texturaCamarao } from '../components/proteinas'
import type { TipoPeca } from '../data/sushi'
import { useNivel } from '../qualidade'
import {
  blocoDeArroz,
  caudasDoNigiri,
  faixaDoJoe,
  fatiaCamarao,
  fatiaNigiri,
  fatiaSashimi,
  graosDaLateral,
  graosDoBloco,
  graosDoTopo,
  texturaNori,
  texturaTostado,
  type Grao,
} from './formas'

const formaGrao = new SphereGeometry(1, 7, 5)
const formaGraoLeve = new SphereGeometry(1, 5, 4)
const AUMENTO = new Vector3(1.45, 1.3, 1.45)

function Graos({ graos: todos }: { graos: Grao[] }) {
  const ref = useRef<InstancedMesh>(null)
  const leve = useNivel() === 'leve'
  // No modo leve ficam 2 de cada 5 grãos, um pouco maiores.
  const graos = useMemo(
    () =>
      leve
        ? todos
            .filter((_, i) => i % 5 < 2)
            .map((grao) => ({ ...grao, matriz: grao.matriz.clone().scale(AUMENTO) }))
        : todos,
    [todos, leve],
  )

  useLayoutEffect(() => {
    const malha = ref.current
    if (!malha) return
    graos.forEach((grao, i) => {
      malha.setMatrixAt(i, grao.matriz)
      malha.setColorAt(i, grao.cor)
    })
    malha.instanceMatrix.needsUpdate = true
    if (malha.instanceColor) malha.instanceColor.needsUpdate = true
    malha.computeBoundingSphere()
  }, [graos])

  return (
    <instancedMesh
      ref={ref}
      args={[leve ? formaGraoLeve : formaGrao, undefined, graos.length]}
      dispose={null}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial roughness={0.45} clearcoat={leve ? 0 : 0.35} />
    </instancedMesh>
  )
}

// Peixe com a textura da carne, relevo e um leve brilho interno.
function Peixe({ textura, translucido = 0.08 }: { textura: typeof texturaSalmao; translucido?: number }) {
  const leve = useNivel() === 'leve'
  return (
    <meshPhysicalMaterial
      map={textura}
      bumpMap={textura}
      bumpScale={1.2}
      emissive="#ffffff"
      emissiveMap={textura}
      emissiveIntensity={translucido}
      roughness={0.38}
      clearcoat={leve ? 0 : 0.75}
      clearcoatRoughness={0.22}
    />
  )
}

function Arroz({ semente }: { semente: number }) {
  const graos = useMemo(() => graosDoBloco(230, semente), [semente])
  return (
    <group position-y={0.13} scale={[1, 0.88, 1]}>
      <mesh geometry={blocoDeArroz} scale={0.96} castShadow receiveShadow dispose={null}>
        <meshStandardMaterial color="#f1ead9" roughness={0.7} />
      </mesh>
      <Graos graos={graos} />
    </group>
  )
}

function Cebolinha({ posicoes }: { posicoes: [number, number, number][] }) {
  return (
    <>
      {posicoes.map((posicao, i) => (
        <mesh key={i} position={posicao} rotation={[Math.PI / 2, 0, i * 1.9]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.035, 10]} />
          <meshStandardMaterial color={i % 2 ? '#4f9a2f' : '#8cc63f'} roughness={0.5} />
        </mesh>
      ))}
    </>
  )
}

type PropsPeca = {
  tipo: TipoPeca
  semente: number
  // Camada de marcas do maçarico, controlada de fora pela animação.
  tostado?: Ref<MeshStandardMaterial>
}

function Nigiri({ tipo, semente, tostado }: PropsPeca) {
  const camarao = tipo === 'nigiriCamarao'
  const forma = camarao ? fatiaCamarao : fatiaNigiri
  const textura = tipo === 'nigiriAtum' ? texturaAtum : camarao ? texturaCamarao : texturaSalmao

  return (
    <>
      <Arroz semente={semente} />
      <group position-y={0.36}>
        <mesh geometry={forma} castShadow receiveShadow dispose={null}>
          <Peixe textura={textura} />
        </mesh>
        {camarao &&
          caudasDoNigiri.map((cauda, k) => (
            <mesh key={k} geometry={cauda} castShadow dispose={null}>
              <meshPhysicalMaterial color="#ee5f22" roughness={0.4} clearcoat={0.6} />
            </mesh>
          ))}
        {tipo === 'nigiriMacaricado' && (
          <>
            {/* a mesma forma, um pouco acima, para as marcas ficarem sobre a carne */}
            <mesh
              geometry={forma}
              position-y={0.007}
              scale={[1.006, 1, 1.014]}
              renderOrder={2}
              dispose={null}
            >
              <meshStandardMaterial
                ref={tostado}
                map={texturaTostado}
                transparent
                opacity={0}
                roughness={0.28}
                depthWrite={false}
                polygonOffset
                polygonOffsetFactor={-4}
              />
            </mesh>
          </>
        )}
      </group>
    </>
  )
}

function Hossomaki({ semente }: { semente: number }) {
  const graos = useMemo(() => graosDoTopo(120, 0.1, 0.27, 0.17, semente), [semente])
  return (
    <group position-y={0.19}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.31, 0.31, 0.38, 40, 1, true]} />
        <meshStandardMaterial map={texturaNori} bumpMap={texturaNori} bumpScale={0.8} roughness={0.55} side={DoubleSide} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.165} receiveShadow>
        <circleGeometry args={[0.305, 40]} />
        <meshStandardMaterial color="#efe8d8" roughness={0.7} />
      </mesh>
      <Graos graos={graos} />
      <mesh geometry={cuboSalmao} position-y={0.18} scale={[0.19, 0.08, 0.18]} castShadow dispose={null}>
        <Peixe textura={texturaSalmao} />
      </mesh>
    </group>
  )
}

function Uramaki({ semente }: { semente: number }) {
  const graos = useMemo(
    () => [...graosDaLateral(230, 0.315, 0.34, semente), ...graosDoTopo(100, 0.19, 0.31, 0.18, semente + 5)],
    [semente],
  )
  const gergelim = useMemo(
    () =>
      graosDaLateral(46, 0.34, 0.3, semente + 11).map((grao) => ({
        ...grao,
        cor: grao.cor.clone().set(grao.matriz.elements[13] > 0 ? '#1d1712' : '#d9bf85'),
      })),
    [semente],
  )
  return (
    <group position-y={0.2}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.31, 0.31, 0.36, 40]} />
        <meshStandardMaterial color="#f1ead9" roughness={0.7} />
      </mesh>
      <Graos graos={graos} />
      <Graos graos={gergelim} />
      {/* anel de nori em volta do recheio */}
      <mesh position-y={0.192} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.18, 0.022, 10, 40]} />
        <meshStandardMaterial map={texturaNori} roughness={0.55} />
      </mesh>
      <mesh geometry={cuboSalmao} position={[-0.055, 0.19, -0.04]} scale={[0.14, 0.08, 0.15]} dispose={null} castShadow>
        <Peixe textura={texturaSalmao} />
      </mesh>
      <mesh position={[0.08, 0.2, -0.03]} rotation-y={0.5} castShadow>
        <boxGeometry args={[0.1, 0.07, 0.14]} />
        <meshStandardMaterial color="#b9d466" roughness={0.45} />
      </mesh>
      <mesh position={[0.01, 0.195, 0.09]} rotation-y={-0.3} castShadow>
        <boxGeometry args={[0.16, 0.065, 0.09]} />
        <meshStandardMaterial color="#fff8e8" roughness={0.35} />
      </mesh>
    </group>
  )
}

function Joe({ semente }: { semente: number }) {
  const graos = useMemo(() => graosDoTopo(90, 0, 0.25, 0.28, semente), [semente])
  return (
    <group>
      {/* a fatia de salmão abraça o arroz */}
      <mesh geometry={faixaDoJoe} position-y={0.21} castShadow receiveShadow dispose={null}>
        <meshPhysicalMaterial
          map={texturaSalmao}
          bumpMap={texturaSalmao}
          bumpScale={2}
          emissive="#ffffff"
          emissiveMap={texturaSalmao}
          emissiveIntensity={0.08}
          roughness={0.36}
          clearcoat={0.8}
          side={DoubleSide}
        />
      </mesh>
      <mesh position-y={0.17}>
        <cylinderGeometry args={[0.28, 0.28, 0.22, 32]} />
        <meshStandardMaterial color="#f1ead9" roughness={0.7} />
      </mesh>
      <Graos graos={graos} />
      <mesh position-y={0.31} scale={[1, 0.55, 1]} castShadow>
        <sphereGeometry args={[0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#fff3dc" roughness={0.3} clearcoat={0.6} />
      </mesh>
      {/* cubinhos de salmão sobre o cream cheese */}
      {[
        [-0.09, 0.39, -0.05, 0.4],
        [0.1, 0.38, 0.06, 1.3],
        [-0.02, 0.4, 0.1, 2.2],
      ].map(([x, y, z, giro]) => (
        <mesh
          key={giro}
          geometry={cuboSalmao}
          position={[x, y, z]}
          rotation={[0.2, giro, 0.15]}
          scale={0.095}
          castShadow
          dispose={null}
        >
          <Peixe textura={texturaSalmao} />
        </mesh>
      ))}
      <Cebolinha
        posicoes={[
          [0.03, 0.43, 0.02], [-0.07, 0.4, 0.04], [0.09, 0.39, -0.05],
          [-0.02, 0.41, -0.08], [0.04, 0.39, 0.1],
        ]}
      />
    </group>
  )
}

function Sashimi() {
  return (
    <mesh geometry={fatiaSashimi} position-y={0.17} rotation={[0, 0, 0.3]} castShadow receiveShadow dispose={null}>
      <Peixe textura={texturaSalmao} translucido={0.1} />
    </mesh>
  )
}

export default function Peca(props: PropsPeca) {
  switch (props.tipo) {
    case 'hossomaki':
      return <Hossomaki semente={props.semente} />
    case 'uramaki':
      return <Uramaki semente={props.semente} />
    case 'joe':
      return <Joe semente={props.semente} />
    case 'sashimi':
      return <Sashimi />
    default:
      return <Nigiri {...props} />
  }
}
