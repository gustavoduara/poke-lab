import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import BowlApresentacao from '../components/BowlApresentacao'
import Miniatura from '../components/Miniatura'
import VitrinePoke from '../components/VitrinePoke'
import { etapas, precoBase } from '../data/cardapio'
import { moeda } from '../data/moeda'
import { precoDoBowl } from '../data/pedido'
import { pokesProntos, type PokePronto } from '../data/prontos'
import { useCarrinho } from '../estado/carrinho'

const totalDeIngredientes = etapas.reduce((soma, etapa) => soma + etapa.opcoes.length, 0)

const passos = [
  { titulo: 'Escolha', texto: 'Pegue um poke pronto ou comece com o pote vazio.' },
  { titulo: 'Veja em 3D', texto: 'Cada ingrediente cai no pote. Gire e separe as camadas.' },
  { titulo: 'Peça', texto: 'Feche a tampa, envie ao carrinho e diga como quer receber.' },
]

export default function Inicio() {
  const [aberto, setAberto] = useState<PokePronto | null>(null)
  const { setSelecao } = useCarrinho()
  const navegar = useNavigate()

  function montarDoZero() {
    setSelecao({})
    navegar('/montar')
  }

  function irParaProntos() {
    document.getElementById('prontos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="abertura">
        <div className="abertura-texto">
          <p className="marca">Poke feito do seu jeito</p>
          <h1>
            Veja seu poke <em>ganhar forma</em> antes de pedir
          </h1>
          <p className="suave">
            No Poke Lab, você não escolhe só em uma lista. Cada ingrediente aparece no pote,
            em 3D, para você conferir o pedido camada por camada.
          </p>
          <div className="acoes">
            <button type="button" className="botao" onClick={irParaProntos}>
              Ver pokes prontos
            </button>
            <button type="button" className="botao secundario" onClick={montarDoZero}>
              Montar do zero
            </button>
          </div>
          <dl className="numeros">
            <div>
              <dt>ingredientes</dt>
              <dd>{totalDeIngredientes}</dd>
            </div>
            <div>
              <dt>pokes prontos</dt>
              <dd>{pokesProntos.length}</dd>
            </div>
            <div>
              <dt>a partir de</dt>
              <dd>{moeda(precoBase)}</dd>
            </div>
          </dl>
        </div>
        {/* Com a janela de um poke aberta, o 3D da abertura sai para aliviar o aparelho. */}
        <div className="abertura-bowl">{!aberto && <BowlApresentacao />}</div>
      </section>

      <section className="conteudo" id="prontos">
        <h2 className="titulo-secao">Pokes prontos</h2>
        <p className="intro">Toque em um deles para ver a montagem acontecer.</p>
        <ul className="vitrines">
          {pokesProntos.map((poke) => (
            <li key={poke.id}>
              <button type="button" className="cartao-poke" onClick={() => setAberto(poke)}>
                <Miniatura selecao={poke.selecao} />
                <span className="etiqueta">{poke.etiqueta}</span>
                <strong>{poke.nome}</strong>
                <span className="suave">{poke.descricao}</span>
                <span className="rodape-cartao">
                  <b>{moeda(precoDoBowl(poke.selecao))}</b>
                  <span>Ver montagem →</span>
                </span>
              </button>
            </li>
          ))}
          <li className="do-zero">
            <button type="button" className="cartao-poke" onClick={montarDoZero}>
              <span className="mais" aria-hidden="true">
                +
              </span>
              <strong>Monte do zero</strong>
              <span className="suave">
                Pote vazio, {totalDeIngredientes} ingredientes e a combinação que você quiser.
              </span>
              <span className="rodape-cartao">
                <b>a partir de {moeda(precoBase)}</b>
                <span>Começar →</span>
              </span>
            </button>
          </li>
        </ul>
      </section>

      <section className="conteudo">
        <h2 className="titulo-secao">Como funciona</h2>
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

      <section className="chamada">
        <h2>Não achou o seu?</h2>
        <p className="suave">Combine base, proteínas, complementos, molho e crocantes.</p>
        <div className="acoes">
          <button type="button" className="botao" onClick={montarDoZero}>
            Montar meu poke
          </button>
          <Link to="/cardapio" className="botao secundario">
            Ver cardápio
          </Link>
        </div>
      </section>

      {aberto && <VitrinePoke poke={aberto} aoFechar={() => setAberto(null)} />}
    </>
  )
}
