import { Link } from 'react-router'
import { moeda } from '../data/moeda'
import {
  MAXIMO_POR_ITEM,
  descricaoDoItem,
  nomeDoItem,
  precoDoItem,
  totalDoCarrinho,
} from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'

export default function Carrinho() {
  const { itens, mudarQuantidade, remover } = useCarrinho()

  if (itens.length === 0) {
    return (
      <section className="conteudo texto centro">
        <h1>Seu carrinho está vazio</h1>
        <p>Monte um poke ou escolha um sushi para começar o pedido.</p>
        <div className="acoes">
          <Link to="/montar" className="botao">
            Montar meu poke
          </Link>
          <Link to="/sushi" className="botao secundario">
            Ver sushis
          </Link>
        </div>
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
              <h2>{item.sushi ? nomeDoItem(item) : `Poke ${i + 1}`}</h2>
              <strong>{moeda(precoDoItem(item) * item.quantidade)}</strong>
            </div>
            <p>{descricaoDoItem(item)}</p>
            <div className="linha">
              <div className="quantidade">
                <button
                  type="button"
                  aria-label={`Diminuir a quantidade do item ${i + 1}`}
                  disabled={item.quantidade <= 1}
                  onClick={() => mudarQuantidade(item.id, item.quantidade - 1)}
                >
                  −
                </button>
                <output>{item.quantidade}</output>
                <button
                  type="button"
                  aria-label={`Aumentar a quantidade do item ${i + 1}`}
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
        <Link to="/sushi" className="botao secundario">
          Adicionar sushi
        </Link>
        <Link to="/finalizar" className="botao">
          Continuar pedido
        </Link>
      </div>
    </section>
  )
}
