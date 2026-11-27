import { useCallback, useEffect, useMemo } from 'react'
import { CatmullRomCurve3, TubeGeometry, Vector3 } from 'three'
import { useAnimacao } from './animacao'
import { alturaSuperficie } from './terreno'

export type TipoMolho = 'shoyu' | 'tare' | 'spicy'

const estilos = {
  shoyu: { cor: '#3b1c0d', espessura: 0.022, aspereza: 0.12, opacidade: 0.9 },
  tare: { cor: '#6e320c', espessura: 0.032, aspereza: 0.15, opacidade: 1 },
  spicy: { cor: '#f08a4b', espessura: 0.042, aspereza: 0.35, opacidade: 1 },
}

const SEGMENTOS = 900
const LADOS = 8
const DURACAO = 1.6

type Props = { tipo: TipoMolho; fatias: number[]; temBase: boolean }

// Um fio de molho em zigue-zague, que sobe ao passar por cima dos ingredientes.
export default function Molho3D({ tipo, fatias, temBase }: Props) {
  const { cor, espessura, aspereza, opacidade } = estilos[tipo]

  const caminho = useMemo(() => {
    const voltas = 7
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
      const progresso = Math.min(1, tempo / DURACAO)
      // Cada trecho do tubo tem LADOS x 6 índices.
      geometria.setDrawRange(0, Math.floor(SEGMENTOS * progresso) * LADOS * 6)
    },
    [geometria],
  )
  useAnimacao(DURACAO, despejar)

  return (
    <mesh geometry={geometria}>
      <meshStandardMaterial
        color={cor}
        roughness={aspereza}
        transparent={opacidade < 1}
        opacity={opacidade}
      />
    </mesh>
  )
}
