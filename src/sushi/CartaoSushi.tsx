import MiniaturaSushi from './MiniaturaSushi'
import { moeda } from '../data/moeda'
import { composicao, totalDePecas, type SushiProduto } from '../data/sushi'

type Props = { sushi: SushiProduto; aoAbrir: () => void }

export default function CartaoSushi({ sushi, aoAbrir }: Props) {
  const combinado = sushi.grupo === 'combinados'
  return (
    <button type="button" className="produto" onClick={aoAbrir}>
      <span className="produto-corpo">
        <span className="produto-texto">
          <strong>{sushi.nome}</strong>
          <span className="produto-descricao">
            {combinado ? composicao(sushi) : sushi.descricao}
          </span>
          <span className="produto-preco">
            <b>{moeda(sushi.preco)}</b> · ver em 3D
          </span>
        </span>
        <span className="produto-foto foto-sushi">
          <MiniaturaSushi sushi={sushi} />
        </span>
      </span>
      <span className="produto-faixa" style={{ background: sushi.cor }}>
        {combinado ? `${sushi.etiqueta} · ${totalDePecas(sushi)} peças` : sushi.etiqueta}
      </span>
    </button>
  )
}
