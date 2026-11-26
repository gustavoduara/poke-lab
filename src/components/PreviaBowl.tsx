import type { Ingrediente } from '../data/cardapio'

// Prévia provisória em 2D. Será substituída pela cena 3D.
export default function PreviaBowl({ itens }: { itens: Ingrediente[] }) {
  return (
    <div className="bowl" role="img" aria-label={`Bowl com ${itens.length} itens`}>
      {itens.length === 0 && <p>Escolha os ingredientes</p>}
      {itens.map((item) => (
        <span key={item.id} className="porcao" style={{ background: item.cor }} />
      ))}
    </div>
  )
}
