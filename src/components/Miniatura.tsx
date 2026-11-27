import { useMemo, type ReactNode } from 'react'
import { etapas } from '../data/cardapio'
import type { Selecao } from '../data/pedido'
import { criarSorteio } from './terreno'

const corDe = (etapaId: string, id: string) =>
  etapas.find((etapa) => etapa.id === etapaId)?.opcoes.find((o) => o.id === id)?.cor ??
  'transparent'

type Sorteio = () => number

// Desenha um pedaço de ingrediente com o formato parecido com o do 3D.
function pedaco(id: string, cor: string, chave: string, sortear: Sorteio): ReactNode {
  const giro = Math.round(sortear() * 360)
  const contorno = { stroke: 'rgba(0,0,0,0.22)', strokeWidth: 0.8 }

  if (id === 'camarao' || id === 'repolho') {
    const grossura = id === 'camarao' ? 6 : 2.4
    return (
      <g key={chave} transform={`rotate(${giro})`} fill="none" strokeLinecap="round">
        <path d="M -7 3 A 8 8 0 1 1 6 5" stroke={cor} strokeWidth={grossura} />
        {id === 'camarao' && (
          <path d="M -5 -3 L -1 -1 M 1 -8 L 1 -3 M 7 -3 L 3 -1" stroke="#fff3ea" strokeWidth={1.4} />
        )}
      </g>
    )
  }
  if (id === 'abacate') {
    return (
      <path
        key={chave}
        transform={`rotate(${giro})`}
        d="M -11 2 Q 0 -12 11 2 Q 0 -4 -11 2 Z"
        fill={cor}
        stroke="#4f7a2a"
        strokeWidth={1.6}
      />
    )
  }
  if (id === 'pepino') {
    return (
      <g key={chave}>
        <circle r={7.5} fill="#d5ecb0" stroke="#3f7d3c" strokeWidth={2} />
        <circle r={2.8} fill="#b3d889" />
      </g>
    )
  }
  if (id === 'edamame') {
    return <ellipse key={chave} rx={5} ry={3.6} transform={`rotate(${giro})`} fill={cor} {...contorno} />
  }
  if (id === 'cenoura') {
    return <rect key={chave} x={-10} y={-1.4} width={20} height={2.8} rx={1} transform={`rotate(${giro})`} fill={cor} />
  }
  return (
    <g key={chave} transform={`rotate(${giro})`}>
      <rect x={-6.5} y={-6.5} width={13} height={13} rx={2.5} fill={cor} {...contorno} />
      {id === 'salmao' && (
        <path d="M -5 -2 L 1 -6 M -4 5 L 6 -2" stroke="#ffe0cf" strokeWidth={1.5} />
      )}
    </g>
  )
}

function desenhar(selecao: Selecao) {
  const sortear = criarSorteio(97)
  // Um ponto sorteado dentro de um círculo.
  const noCirculo = (raio: number, x = 0, y = 0) => {
    const distancia = Math.sqrt(sortear()) * raio
    const angulo = sortear() * Math.PI * 2
    return [x + Math.cos(angulo) * distancia, y + Math.sin(angulo) * distancia]
  }

  const base = selecao.base?.[0] ?? ''
  const ehFolha = base === 'folhas'
  const coresBase = ehFolha
    ? ['#8fd13f', '#4f8a38', '#6fb52f', '#6a3350']
    : base === 'integral'
      ? ['#d8b988', '#b08a57', '#e3c99c']
      : ['#ffffff', '#ece5d2', '#f8f3e6']

  const graos = Array.from({ length: ehFolha ? 90 : 230 }, (_, i) => {
    const [x, y] = noCirculo(66)
    return (
      <ellipse
        key={`g${i}`}
        rx={ehFolha ? 9 : 3.4}
        ry={ehFolha ? 5 : 1.6}
        transform={`translate(${x} ${y}) rotate(${sortear() * 180})`}
        fill={coresBase[i % coresBase.length]}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={0.5}
      />
    )
  })

  const coberturas = [
    ...(selecao.proteina ?? []).map((id) => ({ id, cor: corDe('proteina', id) })),
    ...(selecao.complementos ?? []).map((id) => ({ id, cor: corDe('complementos', id) })),
  ]
  const montes = coberturas.flatMap(({ id, cor }, i) => {
    const angulo = (i / coberturas.length) * Math.PI * 2 - Math.PI / 2
    const quantidade = id === 'cenoura' || id === 'repolho' || id === 'edamame' ? 16 : 9
    return Array.from({ length: quantidade }, (_, j) => {
      const [x, y] = noCirculo(17, Math.cos(angulo) * 40, Math.sin(angulo) * 40)
      return (
        <g key={`${id}${j}`} transform={`translate(${x} ${y})`}>
          {pedaco(id, cor, id, sortear)}
        </g>
      )
    })
  })

  const crocantes = (selecao.crocante ?? []).flatMap((id) =>
    Array.from({ length: 34 }, (_, j) => {
      const [x, y] = noCirculo(58)
      return (
        <ellipse
          key={`${id}${j}`}
          rx={id === 'gergelim' ? 2 : 3.6}
          ry={id === 'gergelim' ? 1.2 : 1.5}
          transform={`translate(${x} ${y}) rotate(${sortear() * 180})`}
          fill={id === 'gergelim' ? '#f3e3b5' : corDe('crocante', id)}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth={0.4}
        />
      )
    }),
  )

  return { fundo: corDe('base', base), graos, montes, crocantes }
}

// Desenho do poke visto de cima, em SVG. É leve o bastante para usar em vários cartões.
export default function Miniatura({ selecao }: { selecao: Selecao }) {
  const { fundo, graos, montes, crocantes } = useMemo(() => desenhar(selecao), [selecao])
  const molho = selecao.molho?.[0]

  return (
    <svg className="miniatura" viewBox="-80 -80 160 160" aria-hidden="true">
      <circle r={78} fill="rgba(220,235,240,0.14)" stroke="rgba(220,235,240,0.6)" strokeWidth={2} />
      <circle r={68} fill={fundo} />
      {graos}
      {montes}
      {molho && (
        <path
          d="M -46 -30 Q -20 -52 -8 -34 T 30 -44 Q 52 -30 22 -20 T -34 -6 Q -62 8 -26 12 T 44 0 Q 58 14 24 22 T -30 36 Q -34 50 -6 40 T 34 42"
          fill="none"
          stroke={corDe('molho', molho)}
          strokeWidth={molho === 'spicy' ? 4.5 : 3}
          strokeLinecap="round"
        />
      )}
      {crocantes}
      {/* brilho do pote */}
      <path d="M -62 -36 A 72 72 0 0 1 -14 -71" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.55} />
    </svg>
  )
}
