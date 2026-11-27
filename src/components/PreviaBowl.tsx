import { lazy, Suspense } from 'react'
import type { TipoBase } from './Base3D'
import type { Ingrediente } from '../data/cardapio'

// O 3D é carregado à parte para o restante da página abrir antes.
const Bowl3D = lazy(() => import('./Bowl3D'))

export default function PreviaBowl({ base }: { base?: Ingrediente }) {
  return (
    <>
      <div className="bowl" role="img" aria-label={base ? `Bowl em 3D com ${base.nome}` : 'Bowl em 3D vazio'}>
        <Suspense fallback={<p>Carregando bowl...</p>}>
          <Bowl3D base={base?.id as TipoBase | undefined} />
        </Suspense>
      </div>
      <p className="dica">Arraste para girar</p>
    </>
  )
}
