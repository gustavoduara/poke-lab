import { Link } from 'react-router'
import { etapas, precoBase } from '../data/cardapio'
import { moeda } from '../data/moeda'

export default function Cardapio() {
  return (
    <section className="conteudo">
      <h1>Cardápio</h1>
      <p className="intro">
        O bowl custa {moeda(precoBase)}. Alguns ingredientes têm um valor adicional.
      </p>
      <div className="grade">
        {etapas.map((etapa) => (
          <article key={etapa.id} className="cartao">
            <h2>{etapa.titulo}</h2>
            <small>Escolha até {etapa.maximo}</small>
            <ul className="itens">
              {etapa.opcoes.map((opcao) => (
                <li key={opcao.id}>
                  <span className="amostra" style={{ background: opcao.cor }} />
                  {opcao.nome}
                  <span className="valor">
                    {opcao.preco > 0 ? `+ ${moeda(opcao.preco)}` : 'incluso'}
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="acoes">
        <Link to="/montar" className="botao">
          Montar meu poke
        </Link>
      </div>
    </section>
  )
}
