import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, OrbitControls } from '@react-three/drei'
import {
  Group,
  MathUtils,
  MeshStandardMaterial,
  NeutralToneMapping,
  PointLight,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import Luzes from '../components/Luzes'
import Desempenho from '../components/Desempenho'
import { useVigiarContexto } from '../components/falha3d'
import { useEconomia } from '../components/useEconomia'
import { useNivel } from '../qualidade'
import { useAnimacao } from '../components/animacao'
import type { SushiProduto } from '../data/sushi'
import Macarico3D from './Macarico3D'
import Peca from './Pecas'
import { organizar, type PecaNaTabua } from './organizar'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const ENTRE_PECAS = 0.13
const QUEDA = 0.55
const TOSTAR = 1.05 // segundos de chama em cada peça
const TROCA = 0.4 // segundos para o maçarico ir até a próxima

// Uma peça que cai na tábua na sua vez.
function PecaQueCai({ ordem, children }: { ordem: number; children: ReactNode }) {
  const grupo = useRef<Group>(null)
  const cair = useCallback(
    (tempo: number) => {
      if (!grupo.current) return
      const p = MathUtils.clamp((tempo - ordem * ENTRE_PECAS) / QUEDA, 0, 1)
      grupo.current.visible = p > 0
      grupo.current.position.y =
        p < 0.78 ? 2.4 * (1 - (p / 0.78) ** 2) : 0.06 * Math.sin(((p - 0.78) / 0.22) * Math.PI)
    },
    [ordem],
  )
  useAnimacao(ordem * ENTRE_PECAS + QUEDA, cair)
  return <group ref={grupo}>{children}</group>
}

type PropsMacarico = {
  alvos: PecaNaTabua[]
  marcas: React.RefObject<(MeshStandardMaterial | null)[]>
  inicio: number
  aoTerminar: () => void
}

// Leva o maçarico peça por peça, acende a chama e vai dourando o salmão.
function Roteiro({ alvos, marcas, inicio, aoTerminar }: PropsMacarico) {
  const macarico = useRef<Group>(null)
  const chama = useRef<Group>(null)
  const luz = useRef<PointLight>(null)
  const avisou = useRef(false)
  const duracao = inicio + alvos.length * (TOSTAR + TROCA) + 0.7

  const animar = useCallback(
    (tempo: number) => {
      alvos.forEach((_, i) => {
        const comeco = inicio + i * (TOSTAR + TROCA) + TROCA
        const material = marcas.current[i]
        if (material) material.opacity = MathUtils.clamp((tempo - comeco) / TOSTAR, 0, 1) * 0.96
      })

      if (tempo >= duracao && !avisou.current) {
        avisou.current = true
        aoTerminar()
      }

      const grupo = macarico.current
      if (!grupo || !chama.current || !luz.current) return
      const decorrido = tempo - inicio
      grupo.visible = decorrido > 0 && tempo < duracao
      if (!grupo.visible) return

      const volta = TOSTAR + TROCA
      const i = Math.min(alvos.length - 1, Math.floor(decorrido / volta))
      const dentro = decorrido - i * volta
      const queimando = dentro >= TROCA && dentro <= volta

      // Ponto em que o bico fica sobre a peça i; "avanco" percorre a fatia de ponta a ponta.
      const ponto = (indice: number, avanco: number) => {
        const { posicao, giro } = alvos[indice]
        const ao_longo = Math.sin(avanco * Math.PI * 3) * 0.34
        return new Vector3(
          posicao[0] + Math.cos(giro) * ao_longo + 0.3,
          0.87,
          posicao[1] - Math.sin(giro) * ao_longo,
        )
      }

      let destino: Vector3
      if (queimando) {
        destino = ponto(i, (dentro - TROCA) / TOSTAR)
      } else {
        const p = MathUtils.smootherstep(dentro / TROCA, 0, 1)
        const origem = i === 0 ? ponto(0, 0).add(new Vector3(1.6, 1.6, 0.6)) : ponto(i - 1, 1)
        destino = origem.lerp(ponto(i, 0), Math.min(1, p))
      }
      // Depois da última peça, o maçarico sobe e sai.
      const saida = MathUtils.clamp((decorrido - alvos.length * volta) / 0.7, 0, 1)
      destino.add(new Vector3(saida * 1.5, saida * 1.8, 0))
      grupo.position.copy(destino)

      const acesa = queimando && saida === 0
      chama.current.visible = acesa
      const tremor = 1 + Math.sin(tempo * 47) * 0.07 + Math.sin(tempo * 83) * 0.05
      chama.current.scale.set(1, tremor, 1)
      luz.current.intensity = acesa ? 4 * tremor : 0
    },
    [alvos, marcas, inicio, duracao, aoTerminar],
  )
  useAnimacao(duracao, animar)

  return <Macarico3D ref={macarico} chama={chama} luz={luz} />
}

function Tabua({ largura, profundidade }: { largura: number; profundidade: number }) {
  const forma = useMemo(
    () => new RoundedBoxGeometry(largura, 0.14, profundidade, 4, 0.06),
    [largura, profundidade],
  )
  return (
    <>
      <mesh geometry={forma} position-y={-0.07} receiveShadow castShadow>
        <meshStandardMaterial color="#232a2e" roughness={0.78} />
      </mesh>
      {/* wasabi e gengibre no canto da tábua */}
      <group position={[largura / 2 - 0.3, 0.02, profundidade / 2 - 0.3]}>
        <mesh scale={[1, 0.75, 1]} position-y={0.08} castShadow>
          <icosahedronGeometry args={[0.15, 2]} />
          <meshStandardMaterial color="#8db93f" roughness={0.8} flatShading />
        </mesh>
      </group>
      <group position={[largura / 2 - 0.32, 0.03, -profundidade / 2 + 0.34]}>
        {Array.from({ length: 6 }, (_, i) => (
          <mesh
            key={i}
            position={[Math.sin(i * 2.2) * 0.08, i * 0.022, Math.cos(i * 1.7) * 0.08]}
            rotation={[-Math.PI / 2 + Math.sin(i) * 0.25, 0, i * 1.3]}
            castShadow
          >
            <circleGeometry args={[0.14, 20, 0, Math.PI * 1.6]} />
            <meshStandardMaterial color={i % 2 ? '#f4b3a8' : '#f8c9bb'} roughness={0.45} side={2} />
          </mesh>
        ))}
      </group>
    </>
  )
}

// Afasta a câmera o necessário para a tábua inteira caber, em qualquer tela.
function Enquadrar({ largura, profundidade }: { largura: number; profundidade: number }) {
  const camera = useThree((estado) => estado.camera)
  const { width, height } = useThree((estado) => estado.size)
  const feito = useRef('')
  useFrame(() => {
    const chave = `${width}x${height}`
    if (feito.current === chave) return
    feito.current = chave
    const tangente = Math.tan((17 * Math.PI) / 180)
    const distancia = Math.max(
      (largura * 1.12) / (2 * tangente * (width / height)),
      (profundidade * 1.5) / (2 * tangente),
      5,
    )
    camera.position.set(0, distancia * 0.66, distancia * 0.75)
    camera.lookAt(0, 0.1, 0)
    camera.updateProjectionMatrix()
  })
  return null
}

type Props = { sushi: SushiProduto; aoMacaricar?: (terminou: boolean) => void }

export default function CenaSushi3D({ sushi, aoMacaricar }: Props) {
  const { pecas, largura, profundidade } = useMemo(() => organizar(sushi), [sushi])
  const alvos = useMemo(() => pecas.filter((peca) => peca.tipo === 'nigiriMacaricado'), [pecas])
  const marcas = useRef<(MeshStandardMaterial | null)[]>([])
  const [tostando, setTostando] = useState(alvos.length > 0 && !semAnimacao)
  const [mexeu, setMexeu] = useState(false)
  const nivel = useNivel()
  const leve = nivel === 'leve'
  const vigiar = useVigiarContexto()
  const { frameloop, observar } = useEconomia(nivel, tostando)
  const inicio = pecas.length * ENTRE_PECAS + QUEDA + 0.35

  const terminar = useCallback(() => {
    setTostando(false)
    aoMacaricar?.(true)
  }, [aoMacaricar])

  return (
    <Canvas
      key={nivel}
      frameloop={frameloop}
      shadows={leve ? false : 'percentage'}
      dpr={leve ? [1, 1.25] : [1, 2]}
      camera={{ fov: 34, position: [0, 5, 6] }}
      gl={{ toneMapping: NeutralToneMapping }}
      onCreated={({ gl }) => {
        vigiar(gl)
        observar(gl.domElement)
      }}
    >
      <Desempenho frameloop={frameloop} />
      <Enquadrar largura={largura} profundidade={profundidade} />
      <Luzes sombras alcance={Math.max(largura, profundidade) / 2 + 0.6} />
      <Tabua largura={largura} profundidade={profundidade} />

      {pecas.map((peca, ordem) => (
        <group key={peca.chave} position={[peca.posicao[0], 0, peca.posicao[1]]} rotation-y={peca.giro}>
          <PecaQueCai ordem={ordem}>
            <Peca
              tipo={peca.tipo}
              semente={peca.semente}
              tostado={
                peca.tipo === 'nigiriMacaricado'
                  ? (material: MeshStandardMaterial | null) => {
                      marcas.current[alvos.indexOf(peca)] = material
                    }
                  : undefined
              }
            />
          </PecaQueCai>
        </group>
      ))}

      {alvos.length > 0 && (
        <Roteiro alvos={alvos} marcas={marcas} inicio={inicio} aoTerminar={terminar} />
      )}

      {!leve && (
        <ContactShadows position={[0, -0.16, 0]} opacity={0.45} scale={largura + 2} blur={2.2} far={1.5} />
      )}
      <OrbitControls
        target={[0, 0.1, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        // Fica parado enquanto o maçarico trabalha, para dar para acompanhar.
        autoRotate={!semAnimacao && !tostando && !mexeu}
        autoRotateSpeed={0.9}
        maxPolarAngle={Math.PI / 2.15}
        onStart={() => setMexeu(true)}
      />
    </Canvas>
  )
}
