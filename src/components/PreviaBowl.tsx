import { lazy, Suspense } from 'react'

// O 3D é carregado à parte para o restante da página abrir antes.
const Bowl3D = lazy(() => import('./Bowl3D'))

export default function PreviaBowl() {
  return (
    <>
      <div className="bowl" role="img" aria-label="Bowl em 3D">
        <Suspense fallback={<p>Carregando bowl...</p>}>
          <Bowl3D />
        </Suspense>
      </div>
      <p className="dica">Arraste para girar</p>
    </>
  )
}
