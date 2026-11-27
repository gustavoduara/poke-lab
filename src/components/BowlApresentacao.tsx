import { lazy, Suspense } from 'react'
import { useMontagem } from './useMontagem'
import Miniatura from './Miniatura'
import Protegido3D from './Protegido3D'
import { pokesProntos } from '../data/prontos'

const Bowl3D = lazy(() => import('./Bowl3D'))

const nada = () => {}

// O poke da abertura do site, que se monta sozinho.
export default function BowlApresentacao() {
  const { parcial } = useMontagem(pokesProntos[1].selecao, 650, 900)

  return (
    <div className="bowl apresentacao" role="img" aria-label="Um poke sendo montado em 3D">
      <Protegido3D reserva={<Miniatura selecao={pokesProntos[1].selecao} />}>
        <Suspense fallback={<p>Preparando o bowl...</p>}>
          <Bowl3D pedido={parcial} separado={false} fechado={false} aoClicar={nada} />
        </Suspense>
      </Protegido3D>
    </div>
  )
}
