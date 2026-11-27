import { lazy, Suspense, useEffect, useState } from 'react'
import type { Pedido } from './Bowl3D'
import Miniatura from './Miniatura'
import Protegido3D from './Protegido3D'
import { suporta3D } from '../qualidade'

// O 3D é carregado à parte para o restante da página abrir antes.
const Bowl3D = lazy(() => import('./Bowl3D'))

type Props = { pedido: Pedido; descricao: string; fechado: boolean }

export default function PreviaBowl({ pedido, descricao, fechado }: Props) {
  const [pedidoSeparar, setPedidoSeparar] = useState(false)
  const temItens = Object.values(pedido).some((ids) => ids.length > 0)
  const [semTresD, setSemTresD] = useState(!suporta3D())
  const separado = pedidoSeparar && temItens && !fechado && !semTresD

  function alternar() {
    if (temItens && !fechado) setPedidoSeparar((atual) => !atual)
  }

  // Com a tela cheia aberta, a página não rola e a tecla Esc fecha.
  useEffect(() => {
    if (!separado) return
    const fechar = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return
      evento.preventDefault()
      setPedidoSeparar(false)
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
          <Protegido3D reserva={<Miniatura selecao={pedido} />} aoMudar={setSemTresD}>
            <Suspense fallback={<p>Carregando bowl...</p>}>
              <Bowl3D
                pedido={pedido}
                separado={separado}
                fechado={fechado}
                aoClicar={alternar}
              />
            </Suspense>
          </Protegido3D>
          {separado && (
            <>
              <button type="button" className="botao juntar" onClick={alternar}>
                Montar de novo
              </button>
              <p className="instrucao">Arraste para girar<span className="so-teclado"> · Esc para voltar</span></p>
            </>
          )}
        </div>
      </div>
      {!semTresD && (
        <>
          <p className="dica">Arraste para girar · toque no pote para separar</p>
          <button
            type="button"
            className="botao secundario separar"
            disabled={!temItens || fechado}
            onClick={alternar}
          >
            Ver ingredientes separados
          </button>
        </>
      )}
    </>
  )
}
