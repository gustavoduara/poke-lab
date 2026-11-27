import { Link } from 'react-router'
import { moeda } from '../data/moeda'
import {
  MAXIMO_POR_ITEM,
  ingredientesDe,
  precoDoBowl,
  totalDoCarrinho,
} from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'

export default function Carrinho() {
  const { itens, mudarQuantidade, remover } = useCarrinho()

  if (itens.length === 0) {
    return (
      <section className="conteudo texto centro">
        <h1>Seu carrinho está vazio</h1>
        <p>Monte um poke para começar o pedido.</p>
        <Link to="/montar" className="botao">
          Montar meu poke
        </Link>
      </section>
    )
  }

  return (
    <section className="conteudo texto">
      <h1>Carrinho</h1>
      <ul className="lista">
        {itens.map((item, i) => (
          <li key={item.id} className="cartao">
            <div className="linha">
              <h2>Poke {i + 1}</h2>
              <strong>{moeda(precoDoBowl(item.selecao) * item.quantidade)}</strong>
            </div>
            <p>
              {ingredientesDe(item.selecao)
                .map((ingrediente) => ingrediente.nome)
                .join(', ')}
            </p>
            <div className="linha">
              <div className="quantidade">
                <button
                  type="button"
                  aria-label={`Diminuir a quantidade do poke ${i + 1}`}
                  disabled={item.quantidade <= 1}
                  onClick={() => mudarQuantidade(item.id, item.quantidade - 1)}
                >
                  −
                </button>
                <output>{item.quantidade}</output>
                <button
                  type="button"
                  aria-label={`Aumentar a quantidade do poke ${i + 1}`}
                  disabled={item.quantidade >= MAXIMO_POR_ITEM}
                  onClick={() => mudarQuantidade(item.id, item.quantidade + 1)}
                >
                  +
                </button>
              </div>
              <button type="button" className="remover" onClick={() => remover(item.id)}>
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="linha subtotal">
        Subtotal <strong>{moeda(totalDoCarrinho(itens))}</strong>
      </p>
      <div className="acoes">
        <Link to="/montar" className="botao secundario">
          Montar outro poke
        </Link>
      </div>
    </section>
  )
}
