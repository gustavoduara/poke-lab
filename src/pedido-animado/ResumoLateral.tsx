import type { CSSProperties, ReactNode } from 'react'
import { spring, useCurrentFrame, useVideoConfig } from 'remotion'
import type { OrderSummary } from './tipos'

const INICIO = 15
const PASSO = 3 // quadros entre um bloco e o próximo

// Cada bloco do resumo entra pouco depois do anterior.
function Entrada({
  ordem,
  children,
  style,
}: {
  ordem: number
  children: ReactNode
  style?: CSSProperties
}) {
  const quadro = useCurrentFrame()
  const { fps } = useVideoConfig()
  const p = spring({
    frame: quadro - INICIO - ordem * PASSO,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  })
  return (
    <div style={{ ...style, opacity: p, translate: `${(1 - p) * 56}px 0px` }}>{children}</div>
  )
}

export default function ResumoLateral({ orderSummary }: { orderSummary: OrderSummary }) {
  const [primeiro] = orderSummary.itens
  const outros = orderSummary.itens.reduce((soma, item) => soma + item.quantidade, 0) - 1
  const linhas = [
    { rotulo: 'Base', valor: primeiro.base },
    { rotulo: 'Proteína', valor: primeiro.proteinas.join(' + ') },
    { rotulo: 'Acompanhamentos', valor: primeiro.acompanhamentos.join(', ') },
    { rotulo: 'Molho', valor: primeiro.molho },
    { rotulo: 'Crocantes', valor: primeiro.crocantes.join(', ') },
  ].filter((linha) => linha.valor)

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 40px',
        borderRadius: 32,
        background: '#fff',
        boxShadow: '0 18px 50px rgba(15, 41, 66, 0.12)',
      }}
    >
      <Entrada ordem={0}>
        <span
          style={{
            display: 'inline-block',
            padding: '10px 18px',
            borderRadius: 999,
            background: '#00b4d8',
            color: '#0f2942',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          FÓRMULA CONFIRMADA • POKE LAB
        </span>
      </Entrada>

      <Entrada ordem={1}>
        <h2 style={{ margin: '18px 0 6px', fontSize: 44, lineHeight: 1.08, color: '#0f2942' }}>
          Seu Poke já vai para o preparo!
        </h2>
        <p style={{ margin: 0, fontSize: 20, color: '#5b7185' }}>
          Pedido #{orderSummary.numero}
          {outros > 0 && ` · este e mais ${outros} poke${outros > 1 ? 's' : ''}`}
        </p>
      </Entrada>

      <div style={{ marginTop: 16 }}>
        {linhas.map((linha, i) => (
          <Entrada
            key={linha.rotulo}
            ordem={i + 2}
            style={{ padding: '11px 0', borderTop: '2px solid #e6eef4' }}
          >
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: '#0096c7',
                textTransform: 'uppercase',
              }}
            >
              {linha.rotulo}
            </div>
            <div style={{ fontSize: 25, fontWeight: 700, lineHeight: 1.25, color: '#0f2942' }}>
              {linha.valor}
            </div>
          </Entrada>
        ))}
      </div>
    </div>
  )
}
