import { useCallback, useEffect, useMemo, useRef } from 'react'
import { CatmullRomCurve3, Group, MathUtils, Mesh, TubeGeometry, Vector3 } from 'three'
import Bisnaga3D, { type EstiloBisnaga } from './Bisnaga3D'
import { useAnimacao } from './animacao'
import { alturaSuperficie } from './terreno'

export type TipoMolho = 'shoyu' | 'tare' | 'spicy'

const estilos = {
  shoyu: { cor: '#3b1c0d', espessura: 0.022, aspereza: 0.12, opacidade: 0.9 },
  tare: { cor: '#6e320c', espessura: 0.032, aspereza: 0.15, opacidade: 1 },
  spicy: { cor: '#f08a4b', espessura: 0.042, aspereza: 0.35, opacidade: 1 },
}

const bisnagas: Record<TipoMolho, EstiloBisnaga> = {
  shoyu: { nome: 'SHOYU', corpo: '#2a140a', rotulo: '#f8fafc', letra: '#0f2942' },
  tare: { nome: 'TARÊ', corpo: '#1c0d07', rotulo: '#0f2942', letra: '#ffffff' },
  spicy: { nome: 'SPICY', corpo: '#e9763a', rotulo: '#fff4e4', letra: '#a8321a' },
}

const SEGMENTOS = 900
const LADOS = 8

// Tempos em segundos: a bisnaga chega, despeja e vai embora.
const ENTRADA = 0.55
const DESPEJO = 2.4
const SAIDA = 0.6
const TOTAL = ENTRADA + DESPEJO + SAIDA

const ALTURA_BICO = 0.36
const INCLINACAO = -0.62 // radianos: o corpo da bisnaga pende para o lado

type Props = { tipo: TipoMolho; fatias: number[]; temBase: boolean }

// Um fio de molho em zigue-zague, que sobe ao passar por cima dos ingredientes.
export default function Molho3D({ tipo, fatias, temBase }: Props) {
  const { cor, espessura, aspereza, opacidade } = estilos[tipo]
  const bisnaga = useRef<Group>(null)
  const filete = useRef<Mesh>(null)

  const caminho = useMemo(() => {
    const voltas = 6
    const passos = 24
    const pontos: Vector3[] = []
    for (let linha = 0; linha <= voltas; linha++) {
      const z = -1.05 + (2.1 * linha) / voltas
      const meiaLargura = Math.sqrt(Math.max(0, 1.28 ** 2 - z ** 2))
      for (let p = 0; p <= passos; p++) {
        // Cada linha vai no sentido contrário da anterior.
        const avanco = p / passos
        const x = (linha % 2 ? 1 - 2 * avanco : 2 * avanco - 1) * meiaLargura
        const desvio = z + (2.1 / voltas) * avanco * 0.8
        pontos.push(new Vector3(x, alturaSuperficie(x, desvio, fatias, temBase), desvio))
      }
    }
    return new CatmullRomCurve3(pontos)
  }, [fatias, temBase])

  const geometria = useMemo(
    () => new TubeGeometry(caminho, SEGMENTOS, espessura, LADOS, false),
    [caminho, espessura],
  )

  // Libera a memória quando o caminho muda ou o molho sai do pedido.
  useEffect(() => () => geometria.dispose(), [geometria])

  const despejar = useCallback(
    (tempo: number) => {
      const progresso = MathUtils.clamp((tempo - ENTRADA) / DESPEJO, 0, 1)
      // Cada trecho do tubo tem LADOS x 6 índices.
      geometria.setDrawRange(0, Math.floor(SEGMENTOS * progresso) * LADOS * 6)

      const grupo = bisnaga.current
      const fio = filete.current
      if (!grupo || !fio) return
      grupo.visible = tempo > 0 && tempo < TOTAL
      const despejando = tempo > ENTRADA && tempo < ENTRADA + DESPEJO
      fio.visible = despejando
      if (!grupo.visible) return

      const ponta = caminho.getPointAt(progresso)
      const chegada = MathUtils.smootherstep(tempo / ENTRADA, 0, 1)
      const partida = MathUtils.smootherstep((tempo - ENTRADA - DESPEJO) / SAIDA, 0, 1)
      // Chega vindo do alto e de lado; no fim, sobe e diminui até sumir.
      const longe = 1 - chegada + partida
      grupo.position.set(ponta.x + longe * 0.7, ponta.y + ALTURA_BICO + longe * 0.9, ponta.z)
      grupo.rotation.z = INCLINACAO - (1 - chegada) * 0.9 + partida * 0.5
      // Um pequeno aperto na bisnaga enquanto o molho sai.
      const aperto = despejando ? Math.sin(tempo * 14) * 0.015 : 0
      const escala = 0.82 * Math.min(1, 0.4 + chegada * 0.6) * (1 - partida * 0.75)
      grupo.scale.set(escala * (1 - aperto), escala * (1 + aperto), escala * (1 - aperto))

      fio.position.set(ponta.x, ponta.y + ALTURA_BICO / 2, ponta.z)
      fio.scale.set(espessura * 0.75, ALTURA_BICO, espessura * 0.75)
    },
    [geometria, caminho, espessura],
  )
  useAnimacao(TOTAL, despejar)

  return (
    <>
      <mesh geometry={geometria} castShadow receiveShadow>
        <meshStandardMaterial
          color={cor}
          roughness={aspereza}
          transparent={opacidade < 1}
          opacity={opacidade}
        />
      </mesh>
      <Bisnaga3D estilo={bisnagas[tipo]} ref={bisnaga} filete={filete} corMolho={cor} />
    </>
  )
}
