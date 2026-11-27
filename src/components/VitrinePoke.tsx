import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import PreviaBowl from './PreviaBowl'
import { useMontagem } from './useMontagem'
import { moeda } from '../data/moeda'
import { ingredientesDe, precoDoBowl } from '../data/pedido'
import type { PokePronto } from '../data/prontos'
import { useCarrinho } from '../estado/carrinho'

// Janela de um poke pronto: mostra a montagem e permite pedir ou personalizar.
export default function VitrinePoke({
  poke,
  aoFechar,
}: {
  poke: PokePronto
  aoFechar: () => void
}) {
  const janela = useRef<HTMLDialogElement>(null)
  const navegar = useNavigate()
  const { adicionar, setSelecao } = useCarrinho()
  const montagem = useMontagem(poke.selecao)
  const [volta, setVolta] = useState(0) // muda para recriar o 3D ao repetir
  const [pedido, setPedido] = useState<'livre' | 'fechando' | 'pronto'>('livre')
  const ingredientes = ingredientesDe(poke.selecao)
  const colocados = new Set(Object.values(montagem.parcial).flat())

  useEffect(() => {
    const elemento = janela.current
    if (elemento && !elemento.open) elemento.showModal()
    const rolagem = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = rolagem
    }
  }, [])

  // Espera a tampa fechar antes de confirmar.
  useEffect(() => {
    if (pedido !== 'fechando') return
    const espera = setTimeout(() => setPedido('pronto'), 2000)
    return () => clearTimeout(espera)
  }, [pedido])

  function pedir() {
    adicionar(poke.selecao)
    setPedido('fechando')
  }

  function personalizar() {
    setSelecao(structuredClone(poke.selecao))
    navegar('/montar')
  }

  function repetir() {
    montagem.reiniciar()
    setVolta((atual) => atual + 1)
    setPedido('livre')
  }

  return (
    <dialog
      ref={janela}
      className="vitrine"
      aria-labelledby="titulo-vitrine"
      onClose={aoFechar}
    >
      <button type="button" className="fechar" aria-label="Fechar" onClick={aoFechar}>
        ×
      </button>

      <div className="vitrine-corpo">
        <div className="vitrine-palco">
          <PreviaBowl
            key={volta}
            pedido={montagem.parcial}
            descricao={`Montagem do poke ${poke.nome}`}
            fechado={pedido !== 'livre'}
          />
        </div>

        <div className="vitrine-texto">
          <p className="etiqueta">{poke.etiqueta}</p>
          <h2 id="titulo-vitrine">{poke.nome}</h2>
          <p className="suave">{poke.descricao}</p>

          <div
            className="progresso"
            role="progressbar"
            aria-label="Montagem do poke"
            aria-valuemin={0}
            aria-valuemax={montagem.total}
            aria-valuenow={montagem.feitos}
          >
            <span style={{ width: `${(montagem.feitos / montagem.total) * 100}%` }} />
          </div>

          <ul className="receita">
            {ingredientes.map((item) => (
              <li key={item.id} className={colocados.has(item.id) ? 'colocado' : ''}>
                <span className="amostra" style={{ background: item.cor }} />
                {item.nome}
              </li>
            ))}
          </ul>

          <p className="preco">{moeda(precoDoBowl(poke.selecao))}</p>

          {pedido === 'pronto' ? (
            <div className="vitrine-acoes" role="status">
              <p>Adicionado ao carrinho!</p>
              <Link to="/carrinho" className="botao">
                Ver carrinho
              </Link>
              <button type="button" className="botao secundario" onClick={aoFechar}>
                Continuar olhando
              </button>
            </div>
          ) : (
            <div className="vitrine-acoes">
              <button
                type="button"
                className="botao"
                disabled={!montagem.completo || pedido === 'fechando'}
                onClick={pedir}
              >
                {montagem.completo ? 'Quero este' : 'Montando...'}
              </button>
              <button type="button" className="botao secundario" onClick={personalizar}>
                Personalizar
              </button>
              <button
                type="button"
                className="remover"
                disabled={pedido === 'fechando'}
                onClick={repetir}
              >
                Ver montagem de novo
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  )
}
