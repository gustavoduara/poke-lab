import { useState } from 'react'
import { useNavigate } from 'react-router'
import BowlApresentacao from '../components/BowlApresentacao'
import Capa from '../components/Capa'
import CartaoPoke from '../components/CartaoPoke'
import VitrinePoke from '../components/VitrinePoke'
import { etapas, precoBase } from '../data/cardapio'
import { moeda } from '../data/moeda'
import { ingredientesDe } from '../data/pedido'
import { pokesProntos, type PokePronto } from '../data/prontos'
import { useCarrinho } from '../estado/carrinho'

const totalDeIngredientes = etapas.reduce((soma, etapa) => soma + etapa.opcoes.length, 0)

type Categoria = 'todos' | 'peixe' | 'sem-peixe'

const semPeixe = (poke: PokePronto) => poke.selecao.proteina?.every((id) => id === 'tofu')

// Compara textos sem diferenciar maiúsculas nem acentos.
const simplificar = (texto: string) =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

export default function Inicio() {
  const [aberto, setAberto] = useState<PokePronto | null>(null)
  const [categoria, setCategoria] = useState<Categoria>('todos')
  const [busca, setBusca] = useState('')
  const { setSelecao } = useCarrinho()
  const navegar = useNavigate()

  function montarDoZero() {
    setSelecao({})
    navegar('/montar')
  }

  const termo = simplificar(busca.trim())
  const filtrando = categoria !== 'todos' || termo !== ''
  const encontrados = pokesProntos.filter((poke) => {
    if (categoria === 'sem-peixe' && !semPeixe(poke)) return false
    if (categoria === 'peixe' && semPeixe(poke)) return false
    const texto = [poke.nome, ...ingredientesDe(poke.selecao).map((item) => item.nome)]
    return simplificar(texto.join(' ')).includes(termo)
  })

  const secoes = filtrando
    ? [{ titulo: 'Resultados', pokes: encontrados }]
    : [
        { titulo: 'Destaques', pokes: pokesProntos.slice(0, 2) },
        { titulo: 'Mais sabores', pokes: pokesProntos.slice(2) },
      ]

  return (
    <>
      <Capa />

      <div className="faixa-central">
        <section className="chamadas" aria-label="Monte seu poke em 3D">
          <button type="button" className="promo" onClick={montarDoZero}>
            <span>
              <small>Monte do seu jeito e</small>
              <strong>veja seu poke em 3D</strong>
              <em>Começar com o pote vazio →</em>
            </span>
            <span className="promo-icone" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="56" height="56">
                <g fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 32h48c0 13-10 22-24 22S8 45 8 32Z" />
                  <path d="M16 24c4-7 9-7 13 0M32 24c4-9 11-9 16 0M32 8v7" />
                </g>
              </svg>
            </span>
          </button>
          {/* Com a janela de um poke aberta, este 3D sai para aliviar o aparelho. */}
          <div className="cena">{!aberto && <BowlApresentacao />}</div>
        </section>

        <div className="filtros">
          <label>
            <span className="somente-leitor">Categorias</span>
            <select
              value={categoria}
              onChange={(evento) => setCategoria(evento.target.value as Categoria)}
            >
              <option value="todos">CATEGORIAS</option>
              <option value="peixe">Peixes e frutos do mar</option>
              <option value="sem-peixe">Sem peixe</option>
            </select>
          </label>
          <label className="busca">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="somente-leitor">Buscar por nome ou ingrediente</span>
            <input
              type="search"
              placeholder="Busque por nome ou ingrediente"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
            />
          </label>
        </div>

        {secoes.map((secao) => (
          <section key={secao.titulo} className="secao">
            <h2>{secao.titulo}</h2>
            {secao.pokes.length === 0 ? (
              <p className="suave">Nenhum poke pronto com esse filtro. Que tal montar o seu?</p>
            ) : (
              <ul className="produtos">
                {secao.pokes.map((poke) => (
                  <li key={poke.id}>
                    <CartaoPoke poke={poke} aoAbrir={() => setAberto(poke)} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="secao">
          <h2>Do seu jeito</h2>
          <ul className="produtos">
            <li>
              <button type="button" className="produto" onClick={montarDoZero}>
                <span className="produto-corpo">
                  <span className="produto-texto">
                    <strong>Monte do zero</strong>
                    <span className="produto-descricao">
                      Pote vazio, {totalDeIngredientes} ingredientes e a combinação que você
                      quiser, aparecendo em 3D.
                    </span>
                    <span className="produto-preco">
                      A partir de <b>{moeda(precoBase)}</b>
                    </span>
                  </span>
                  <span className="produto-foto vazio" aria-hidden="true">
                    +
                  </span>
                </span>
                <span className="produto-faixa escura">Começar a montar</span>
              </button>
            </li>
          </ul>
        </section>
      </div>

      {aberto && <VitrinePoke poke={aberto} aoFechar={() => setAberto(null)} />}
    </>
  )
}
