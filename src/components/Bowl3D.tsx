import { useState } from 'react'
import { NeutralToneMapping } from 'three'
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import Luzes from './Luzes'
import Desempenho from './Desempenho'
import { useVigiarContexto } from './falha3d'
import { useEconomia } from './useEconomia'
import { useNivel } from '../qualidade'
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
  const leve = useNivel() === 'leve'
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
      <Luzes sombras={!separado} />

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

      {/* esta sombra no chão custa um desenho a mais por quadro */}
      {!separado && !leve && (
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
  const nivel = useNivel()
  const leve = nivel === 'leve'
  const vigiar = useVigiarContexto()
  // Qualquer mudança no pedido ou na vista acorda o desenho.
  const atividade = JSON.stringify([props.pedido, props.separado, props.fechado])
  const { frameloop, observar } = useEconomia(nivel, atividade)

  return (
    <Canvas
      // ao trocar de modo, a cena é recriada com as novas opções
      key={nivel}
      frameloop={frameloop}
      shadows={leve ? false : 'percentage'}
      camera={{ position: POSICAO_INICIAL, fov: 40 }}
      dpr={leve ? [1, 1.25] : [1, 2]}
      // Mantém as cores dos alimentos mais fiéis, sem desbotar nos tons fortes.
      gl={{ toneMapping: NeutralToneMapping }}
      onCreated={({ gl }) => {
        vigiar(gl)
        observar(gl.domElement)
      }}
    >
      <Cena {...props} />
      <Desempenho frameloop={frameloop} />
    </Canvas>
  )
}
