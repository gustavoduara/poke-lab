import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion'
import PalcoEmbalagem from './PalcoEmbalagem'
import ResumoLateral from './ResumoLateral'
import { DURACAO_EM_QUADROS, defaultProps, type PropsAnimacao } from './tipos'

// Barra ciano que acompanha o andamento da animação.
function Progresso() {
  const quadro = useCurrentFrame()
  const largura = interpolate(quadro, [0, DURACAO_EM_QUADROS - 8], [0, 100], {
    extrapolateRight: 'clamp',
  })
  return (
    <div style={{ position: 'absolute', left: 0, bottom: 0, height: 10, width: '100%', background: '#dbe9f0' }}>
      <div style={{ height: '100%', width: `${largura}%`, background: '#0096c7' }} />
    </div>
  )
}

// Composição 1280 x 720: embalagem à esquerda (55%) e resumo à direita (45%).
export default function AnimacaoPedido({
  orderSummary = defaultProps.orderSummary,
  pokeImageUrl,
}: PropsAnimacao) {
  return (
    <AbsoluteFill style={{ background: '#f8fafc', fontFamily: 'Lato, system-ui, sans-serif' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 704, height: 720, background: '#f9faf9' }}>
        <PalcoEmbalagem pokeImageUrl={pokeImageUrl} />
      </div>
      <div style={{ position: 'absolute', left: 704, top: 28, width: 548, height: 656 }}>
        <ResumoLateral orderSummary={orderSummary} />
      </div>
      <Progresso />
    </AbsoluteFill>
  )
}
