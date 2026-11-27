import { useState } from 'react'
import { NeutralToneMapping } from 'three'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei'
import Pote3D from './Pote3D'
import Tampa3D from './Tampa3D'
import Base3D, { type TipoBase } from './Base3D'
import Porcao3D from './Porcao3D'
import Molho3D, { type TipoMolho } from './Molho3D'
import Crocante3D, { type TipoCrocante } from './Crocante3D'
import Camada3D, { type Destino } from './Camada3D'
import CameraGuiada, { POSICAO_INICIAL } from './CameraGuiada'
import { receitas } from './receitas'
import {
  RAIO_FATIA,
  apoio,
  centroFatia,
  fatiasComplemento,
  fatiasProteina,
} from './terreno'
import { useFatiasFixas } from './fatias'
import { ingredientesDe, type Selecao } from '../data/pedido'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const telaPequena = window.matchMedia('(max-width: 760px)').matches

// Medidas da coluna quando o bowl está separado.
const PASSO = 0.95
const FOLGA_POTE = 0.45
const INICIO = 1.45 // segundos reservados para o pote e a base saírem
const TANGENTE = Math.tan((20 * Math.PI) / 180) // metade do campo de visão da câmera

export type Pedido = Selecao

type Props = {
  pedido: Pedido
  separado: boolean
  fechado: boolean // tampa no lugar
  aoClicar: () => void
}

function Cena({ pedido, separado, fechado, aoClicar }: Props) {
  const { width, height } = useThree((estado) => estado.size)
  const [mexeu, setMexeu] = useState(false)
  const [arrastando, setArrastando] = useState(false)
  const [estadoAnterior, setEstadoAnterior] = useState(separado)

  // Ao separar ou juntar, o bowl volta a girar sozinho depois de montado.
  if (estadoAnterior !== separado) {
    setEstadoAnterior(separado)
    setMexeu(false)
  }

  const base = pedido.base?.[0] as TipoBase | undefined
  const molho = pedido.molho?.[0] as TipoMolho | undefined
  const crocantes = pedido.crocante ?? []
  const proteinas = useFatiasFixas(pedido.proteina ?? [], fatiasProteina)
  const complementos = useFatiasFixas(pedido.complementos ?? [], fatiasComplemento)
  const porcoes = [...proteinas, ...complementos]
  const fatiasOcupadas = porcoes.map((porcao) => porcao.fatia)

  // A coluna, de baixo para cima: pote, base, porções, molho e crocantes.
  const ordem = [
    'pote',
    ...(base ? [base] : []),
    ...porcoes.map((porcao) => porcao.id),
    ...(molho ? [molho] : []),
    ...crocantes,
  ]
  const alturaColuna = (ordem.length - 1) * PASSO + 1.7 + FOLGA_POTE * 2
  const distancia = Math.max(
    (alturaColuna / (2 * TANGENTE)) * 1.16,
    // Em telas estreitas, afasta o bastante para caber na largura.
    2.6 / (2 * TANGENTE * (width / height)),
    7,
  )
  const pixelsPorUnidade = height / (2 * distancia * TANGENTE)
  const afastamento = Math.min(170, Math.max(48, pixelsPorUnidade * 1.15))
  const nomes = new Map(ingredientesDe(pedido).map((item) => [item.id, item.nome]))

  function destino(id: string, escala: number): Destino | undefined {
    if (!separado) return undefined
    const i = ordem.indexOf(id)
    const ehPote = id === 'pote'
    const ehBase = id === base
    return {
      // O pote desce um pouco além do seu lugar na coluna para não encostar na base.
      altura: (i - (ordem.length - 1) / 2) * PASSO - (ehPote ? FOLGA_POTE : 0),
      escala,
      // Primeiro o pote desce, depois a base. Só então os ingredientes se
      // organizam, um de cada vez, começando pelo de cima.
      atraso: ehPote ? 0 : ehBase ? 0.75 : INICIO + (ordem.length - 1 - i) * 0.4,
      // Na volta, os ingredientes se juntam antes e o pote chega por último.
      atrasoVolta: ehPote ? 0.7 : ehBase ? 0.3 : 0,
      salto: ehPote || ehBase ? 0 : 0.3,
      numero: ordem.length - i,
      nome: id === 'pote' ? 'Pote' : (nomes.get(id) ?? id),
      afastamento,
    }
  }

  const topo = base ? 0.4 : -0.15

  function clicar(evento: ThreeEvent<MouseEvent>) {
    evento.stopPropagation()
    // Se o mouse andou, a pessoa estava girando, não clicando.
    if (evento.delta <= 6) aoClicar()
  }

  return (
    <>
      {/* Céu claro e chão quente: as partes de baixo ficam um pouco mais escuras. */}
      <hemisphereLight args={['#fdfbff', '#6b5442', 0.65]} />
      {/* Luz principal, a única que projeta sombras entre os ingredientes. */}
      <directionalLight
        position={[2.6, 5.5, 2.2]}
        intensity={2.3}
        color="#fff3e4"
        castShadow={!separado}
        shadow-mapSize={telaPequena ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-2.3}
        shadow-camera-right={2.3}
        shadow-camera-top={2.3}
        shadow-camera-bottom={-2.3}
        shadow-camera-near={2}
        shadow-camera-far={11}
        shadow-bias={-0.0004}
        shadow-normalBias={0.018}
        shadow-radius={3}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffd9c7" />
      {/* Luz de baixo, para o poke continuar visível quando girado ao contrário. */}
      <directionalLight position={[0, -5, 2]} intensity={0.5} />

      {/* Painéis de luz que aparecem refletidos no plástico, como em um estúdio. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[7, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 2, 1]} scale={[1, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1.5, 0]} scale={[0.5, 5, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[2, 3, 5]} scale={1.5} />
      </Environment>

      <group
        onClick={clicar}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <Camada3D centro={[0, 0, 0]} destino={destino('pote', 0.58)}>
          <Pote3D />
        </Camada3D>

        {base && (
          <Camada3D key={base} centro={[0, -0.1, 0]} destino={destino(base, 0.58)}>
            <Base3D tipo={base} />
          </Camada3D>
        )}

        {porcoes.map(({ id, fatia }) => {
          const [x, z] = centroFatia(fatia)
          return (
            <Camada3D
              key={id}
              centro={[x, apoio(RAIO_FATIA, !!base) + 0.12, z]}
              destino={destino(id, 1.15)}
            >
              <Porcao3D receita={receitas[id]} fatia={fatia} temBase={!!base} />
            </Camada3D>
          )
        })}

        {molho && (
          <Camada3D key={molho} centro={[0, topo, 0]} destino={destino(molho, 0.7)}>
            <Molho3D tipo={molho} fatias={fatiasOcupadas} temBase={!!base} />
          </Camada3D>
        )}

        {crocantes.map((id, i) => (
          <Camada3D key={id} centro={[0, topo, 0]} destino={destino(id, 0.72)}>
            <Crocante3D
              tipo={id as TipoCrocante}
              ordem={i}
              fatias={fatiasOcupadas}
              temBase={!!base}
            />
          </Camada3D>
        ))}
      </group>

      {fechado && <Tampa3D />}

      {!separado && (
        <ContactShadows position={[0, -0.59, 0]} opacity={0.3} scale={6} blur={2.4} far={2} />
      )}

      <CameraGuiada distancia={separado ? distancia : null} cancelada={arrastando} />

      {/* Segurando o botão do mouse, dá para girar para qualquer lado. */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        rotateSpeed={0.9}
        autoRotate={!semAnimacao && !separado && !mexeu}
        autoRotateSpeed={1.5}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        onStart={() => setArrastando(true)}
        onEnd={() => {
          setArrastando(false)
          setMexeu(true)
        }}
      />
    </>
  )
}

export default function Bowl3D(props: Props) {
  return (
    <Canvas
      shadows="percentage"
      camera={{ position: POSICAO_INICIAL, fov: 40 }}
      dpr={[1, 2]}
      // Mantém as cores dos alimentos mais fiéis, sem desbotar nos tons fortes.
      gl={{ toneMapping: NeutralToneMapping }}
    >
      <Cena {...props} />
    </Canvas>
  )
}
