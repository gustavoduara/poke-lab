import { lazy, Suspense, useEffect, useState } from 'react'
import type { Pedido } from './Bowl3D'

// O 3D é carregado à parte para o restante da página abrir antes.
const Bowl3D = lazy(() => import('./Bowl3D'))

type Props = { pedido: Pedido; descricao: string; fechado: boolean }

export default function PreviaBowl({ pedido, descricao, fechado }: Props) {
  const [pedidoSeparar, setPedidoSeparar] = useState(false)
  const temItens = Object.values(pedido).some((ids) => ids.length > 0)
  const separado = pedidoSeparar && temItens && !fechado

  function alternar() {
    if (temItens && !fechado) setPedidoSeparar((atual) => !atual)
  }

  // Com a tela cheia aberta, a página não rola e a tecla Esc fecha.
  useEffect(() => {
    if (!separado) return
    const fechar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setPedidoSeparar(false)
    }
    const rolagem = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', fechar)
    return () => {
      document.body.style.overflow = rolagem
      document.body.style.cursor = ''
      window.removeEventListener('keydown', fechar)
    }
  }, [separado])

  return (
    <>
      <div className="palco">
        <div
          className={separado ? 'bowl separado' : 'bowl'}
          role="group"
          aria-label={descricao}
        >
          <Suspense fallback={<p>Carregando bowl...</p>}>
            <Bowl3D
              pedido={pedido}
              separado={separado}
              fechado={fechado}
              aoClicar={alternar}
            />
          </Suspense>
          {separado && (
            <>
              <button type="button" className="botao juntar" onClick={alternar}>
                Montar de novo
              </button>
              <p className="instrucao">Segure e arraste para girar · Esc para voltar</p>
            </>
          )}
        </div>
      </div>
      <p className="dica">Segure e arraste para girar</p>
      <button
        type="button"
        className="botao secundario separar"
        disabled={!temItens || fechado}
        onClick={alternar}
      >
        Ver ingredientes separados
      </button>
    </>
  )
}
