import { Link } from 'react-router'
import Menu from './Menu'
import Miniatura from './Miniatura'
import logo from '../assets/logo-simbolo.png'
import { moeda } from '../data/moeda'
import { TAXA_ENTREGA, type Recebimento } from '../data/pedido'
import { pokesProntos } from '../data/prontos'
import { useCarrinho } from '../estado/carrinho'

// Topo da página inicial: foto de capa ilustrada, identificação da loja e forma de entrega.
export default function Capa() {
  const { recebimento, setRecebimento } = useCarrinho()
  const entrega = recebimento === 'entrega'

  return (
    <>
      <header className="capa">
        <div className="capa-arte" aria-hidden="true">
          {[...pokesProntos, ...pokesProntos.slice(0, 2)].map((poke, i) => (
            <Miniatura key={i} selecao={poke.selecao} />
          ))}
        </div>

        <div className="faixa-central capa-conteudo">
          <div className="capa-menu">
            <Menu />
          </div>

          <div className="loja">
            <img className="loja-logo" src={logo} alt="" width={76} height={76} />
            <div className="loja-dados">
              <h1>Poke Lab</h1>
              <p>Rua dos Exemplos, 100 · Centro (endereço fictício)</p>
              <p className="situacao">Aberto para pedidos de demonstração</p>
            </div>
            <Link to="/sobre" className="loja-link">
              Conheça o projeto
            </Link>
          </div>
        </div>
      </header>

      <div className="barra">
        <div className="faixa-central barra-conteudo">
          <label className="modo">
            <svg viewBox="0 0 32 24" width="32" height="24" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="17" r="4" />
                <circle cx="25" cy="17" r="4" />
                <path d="M7 17h10l4-8h3M21 9l4 8M10 9h7" />
              </g>
            </svg>
            <span className="somente-leitor">Como você quer receber</span>
            <select
              value={recebimento}
              onChange={(evento) => setRecebimento(evento.target.value as Recebimento)}
            >
              <option value="entrega">ENTREGA</option>
              <option value="retirada">RETIRADA</option>
            </select>
          </label>
          <p className="prazo" aria-live="polite">
            <span>
              {entrega
                ? `Entrega em até 45 min · Taxa de ${moeda(TAXA_ENTREGA)}`
                : 'Pronto em cerca de 20 min · Sem taxa'}
            </span>
            <strong>
              {entrega ? 'O endereço é informado ao finalizar' : 'Retirada no balcão'}
            </strong>
          </p>
        </div>
      </div>
    </>
  )
}
