import type { ReactNode } from 'react'
import type { SushiProduto, TipoPeca } from '../data/sushi'

// Uma peça vista de cima, desenhada em SVG, com o centro na origem.
function desenho(tipo: TipoPeca): ReactNode {
  if (tipo.startsWith('nigiri')) {
    const cor = tipo === 'nigiriAtum' ? '#b3203a' : tipo === 'nigiriCamarao' ? '#f7a374' : '#f57f45'
    return (
      <g transform="rotate(-28)">
        <rect x={-8} y={-13} width={16} height={26} rx={7} fill="#f4efe2" />
        <rect x={-7} y={-14} width={14} height={27} rx={6} fill={cor} />
        <path d="M -6 -8 L 6 -3 M -6 -1 L 6 4 M -6 6 L 5 10" stroke="#ffe3d0" strokeWidth={1.2} opacity={0.8} />
        {tipo === 'nigiriMacaricado' && (
          <g fill="#6b2604" opacity={0.85}>
            <circle cx={-2} cy={-7} r={3} />
            <circle cx={3} cy={1} r={2.4} />
            <circle cx={-3} cy={7} r={2} />
          </g>
        )}
      </g>
    )
  }
  if (tipo === 'sashimi') {
    return (
      <g transform="rotate(-35)">
        <rect x={-6} y={-13} width={13} height={26} rx={4} fill="#f57f45" />
        <path d="M -5 -7 L 6 -3 M -5 0 L 6 4 M -5 7 L 6 11" stroke="#ffe3d0" strokeWidth={1.4} />
      </g>
    )
  }
  if (tipo === 'joe') {
    return (
      <g>
        <circle r={11} fill="#f57f45" />
        <circle r={7} fill="#fff6e2" />
        <g fill="#4f9a2f">
          <circle cx={-2} cy={-1} r={1.6} />
          <circle cx={3} cy={2} r={1.6} />
          <circle cx={1} cy={-4} r={1.4} />
        </g>
      </g>
    )
  }
  const uramaki = tipo === 'uramaki'
  return (
    <g>
      <circle r={11} fill={uramaki ? '#f4efe2' : '#102518'} />
      <circle r={uramaki ? 6.5 : 8.5} fill={uramaki ? '#102518' : '#f4efe2'} />
      <circle r={uramaki ? 5 : 3.6} fill="#f57f45" />
      {uramaki && (
        <>
          <path d="M 0 0 L 5 -1 A 5 5 0 0 1 1 5 Z" fill="#b9d466" />
          <g fill="#241a12">
            <circle cx={-9} cy={-2} r={0.9} />
            <circle cx={7} cy={-6} r={0.9} />
            <circle cx={2} cy={9} r={0.9} />
          </g>
        </>
      )}
    </g>
  )
}

export default function MiniaturaSushi({ sushi }: { sushi: SushiProduto }) {
  // Mostra no máximo nove peças, alternando os tipos do produto.
  const filas = sushi.pecas.map(({ tipo, quantidade }) => Array<TipoPeca>(quantidade).fill(tipo))
  const pecas: TipoPeca[] = []
  while (pecas.length < 9 && filas.some((fila) => fila.length)) {
    for (const fila of filas) {
      const tipo = fila.pop()
      if (tipo && pecas.length < 9) pecas.push(tipo)
    }
  }
  const colunas = pecas.length <= 4 ? 2 : 3
  const linhas = Math.ceil(pecas.length / colunas)

  return (
    <svg className="miniatura" viewBox="-50 -50 100 100" aria-hidden="true">
      <rect x={-46} y={-40} width={92} height={80} rx={9} fill="#232a2e" />
      {pecas.map((tipo, i) => {
        const x = ((i % colunas) - (colunas - 1) / 2) * 28
        const y = (Math.floor(i / colunas) - (linhas - 1) / 2) * 25
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {desenho(tipo)}
          </g>
        )
      })}
    </svg>
  )
}
