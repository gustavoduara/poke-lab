import { Link } from 'react-router'
import { precoBase } from '../data/cardapio'
import { moeda } from '../data/moeda'

const passos = [
  { titulo: 'Escolha', texto: 'Base, proteínas, complementos, molho e crocantes.' },
  { titulo: 'Veja em 3D', texto: 'Cada ingrediente cai no bowl assim que você seleciona.' },
  { titulo: 'Peça', texto: 'Adicione ao carrinho e informe como quer receber.' },
]

export default function Inicio() {
  return (
    <>
      <section className="destaque">
        <p className="marca">Poke feito do seu jeito</p>
        <h1>Veja seu poke ganhar forma antes de pedir</h1>
        <p>
          Monte cada camada e acompanhe o bowl em 3D. A partir de {moeda(precoBase)}.
        </p>
        <div className="acoes">
          <Link to="/montar" className="botao">
            Montar meu poke
          </Link>
          <Link to="/cardapio" className="botao secundario">
            Ver cardápio
          </Link>
        </div>
      </section>

      <section className="conteudo">
        <h2>Como funciona</h2>
        <ol className="grade">
          {passos.map((passo, i) => (
            <li key={passo.titulo} className="cartao">
              <span className="numero">{i + 1}</span>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
