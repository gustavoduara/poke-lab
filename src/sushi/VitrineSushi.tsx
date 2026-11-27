import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { moeda } from '../data/moeda'
import { composicao, temMacarico, totalDePecas, type SushiProduto } from '../data/sushi'
import { useCarrinho } from '../estado/carrinho'

// O 3D é carregado só quando alguém abre um sushi.
const CenaSushi3D = lazy(() => import('./CenaSushi3D'))

type Props = { sushi: SushiProduto; aoFechar: () => void }

export default function VitrineSushi({ sushi, aoFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null)
  const navegar = useNavigate()
  const { adicionarSushi } = useCarrinho()
  const [volta, setVolta] = useState(0) // muda para recriar a cena e ver de novo
  const [selado, setSelado] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const fogo = temMacarico(sushi)

  useEffect(() => {
    const elemento = janela.current
    if (elemento && !elemento.open) elemento.showModal()
    const rolagem = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = rolagem
    }
  }, [])

  const aoMacaricar = useCallback((terminou: boolean) => setSelado(terminou), [])

  function repetir() {
    setSelado(false)
    setVolta((atual) => atual + 1)
  }

  return (
    <dialog ref={janela} className="vitrine" aria-labelledby="titulo-sushi" onClose={aoFechar}>
      <button type="button" className="fechar" aria-label="Fechar" onClick={aoFechar}>
        ×
      </button>

      <div className="vitrine-corpo vitrine-sushi">
        <div className="vitrine-palco">
          <div className="palco-sushi" role="img" aria-label={`${sushi.nome} em 3D: ${composicao(sushi)}`}>
            <Suspense fallback={<p>Preparando o sushi...</p>}>
              <CenaSushi3D key={volta} sushi={sushi} aoMacaricar={aoMacaricar} />
            </Suspense>
          </div>
          <p className="dica">Arraste para girar</p>
          <button type="button" className="botao secundario separar" onClick={repetir}>
            {fogo ? 'Maçaricar de novo' : 'Montar de novo'}
          </button>
        </div>

        <div className="vitrine-texto">
          <p className="etiqueta">{sushi.etiqueta}</p>
          <h2 id="titulo-sushi">{sushi.nome}</h2>
          <p className="suave">{sushi.descricao}</p>
          {fogo && (
            <p className="fogo" role="status">
              {selado ? 'Selado na chama!' : 'O maçarico vai dourar o salmão.'}
            </p>
          )}
          <ul className="receita">
            {sushi.pecas.map((peca) => (
              <li key={peca.tipo} className="colocado">
                {composicao({ ...sushi, pecas: [peca] })}
              </li>
            ))}
          </ul>
          <p className="preco">
            {moeda(sushi.preco)} <small>{totalDePecas(sushi)} peças</small>
          </p>
          <div className="vitrine-acoes">
            <button
              type="button"
              className="botao"
              onClick={() => {
                adicionarSushi(sushi.id)
                navegar('/finalizar')
              }}
            >
              Adicionar e finalizar
            </button>
            <button
              type="button"
              className="botao secundario"
              onClick={() => {
                adicionarSushi(sushi.id)
                setAdicionado(true)
              }}
            >
              Adicionar e continuar pedindo
            </button>
          </div>
          <p className="dica" role="status">
            {adicionado && (
              <>
                Adicionado ao carrinho! <Link to="/carrinho">Ver carrinho</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </dialog>
  )
}
