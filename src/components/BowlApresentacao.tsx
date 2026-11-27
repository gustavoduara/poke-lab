import { lazy, Suspense } from 'react'
import { useMontagem } from './useMontagem'
import { pokesProntos } from '../data/prontos'

const Bowl3D = lazy(() => import('./Bowl3D'))

const nada = () => {}

// O poke da abertura do site, que se monta sozinho.
export default function BowlApresentacao() {
  const { parcial } = useMontagem(pokesProntos[1].selecao, 650, 900)

  return (
    <div className="bowl apresentacao" role="img" aria-label="Um poke sendo montado em 3D">
      <Suspense fallback={<p>Preparando o bowl...</p>}>
        <Bowl3D pedido={parcial} separado={false} fechado={false} aoClicar={nada} />
      </Suspense>
    </div>
  )
}
