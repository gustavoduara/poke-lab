import { lazy, Suspense } from 'react'
import type { Pedido } from './Bowl3D'

// O 3D é carregado à parte para o restante da página abrir antes.
const Bowl3D = lazy(() => import('./Bowl3D'))

type Props = { pedido: Pedido; descricao: string }

export default function PreviaBowl({ pedido, descricao }: Props) {
  return (
    <>
      <div className="bowl" role="img" aria-label={descricao}>
        <Suspense fallback={<p>Carregando bowl...</p>}>
          <Bowl3D pedido={pedido} />
        </Suspense>
      </div>
      <p className="dica">Arraste para girar</p>
    </>
  )
}
