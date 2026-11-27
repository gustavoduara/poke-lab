import Miniatura from './Miniatura'
import { moeda } from '../data/moeda'
import { ingredientesDe, precoDoBowl } from '../data/pedido'
import type { PokePronto } from '../data/prontos'

// Cartão de produto: texto à esquerda, ilustração à direita e faixa colorida embaixo.
export default function CartaoPoke({
  poke,
  aoAbrir,
}: {
  poke: PokePronto
  aoAbrir: () => void
}) {
  return (
    <button type="button" className="produto" onClick={aoAbrir}>
      <span className="produto-corpo">
        <span className="produto-texto">
          <strong>{poke.nome}</strong>
          <span className="produto-descricao">
            {ingredientesDe(poke.selecao)
              .map((item) => item.nome)
              .join(', ')}
          </span>
          <span className="produto-preco">
            <b>{moeda(precoDoBowl(poke.selecao))}</b> · ver montagem em 3D
          </span>
        </span>
        <span className="produto-foto" style={{ background: poke.fundo }}>
          <Miniatura selecao={poke.selecao} />
        </span>
      </span>
      <span className="produto-faixa" style={{ background: poke.cor }}>
        {poke.etiqueta}
      </span>
    </button>
  )
}
