import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Player } from '@remotion/player'
import AnimacaoPedido from './AnimacaoPedido'
import FotoDoPoke from './FotoDoPoke'
import { DURACAO_EM_QUADROS, QUADROS_POR_SEGUNDO, resumirPedido } from './tipos'
import embalagem from '../assets/embalagem.jpg'
import { moeda } from '../data/moeda'
import { ingredientesDe, type PedidoConfirmado } from '../data/pedido'

const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Props = { pedido: PedidoConfirmado; aoFechar: () => void }

export default function ModalPedido({ pedido, aoFechar }: Props) {
  const janela = useRef<HTMLDialogElement>(null)
  const [caixaCarregada, setCaixaCarregada] = useState(false)
  // undefined: ainda fotografando. null: não deu, então usa o bowl da foto.
  const [foto, setFoto] = useState<string | null | undefined>(undefined)

  const orderSummary = useMemo(() => resumirPedido(pedido), [pedido])
  const inputProps = useMemo(
    () => ({ orderSummary, pokeImageUrl: foto ?? undefined }),
    [orderSummary, foto],
  )
  const fotografar = useCallback((imagem: string) => setFoto(imagem), [])
  const pronto = caixaCarregada && foto !== undefined

  useEffect(() => {
    const elemento = janela.current
    if (elemento && !elemento.open) elemento.showModal()
    const rolagem = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = rolagem
    }
  }, [])

  useEffect(() => {
    const imagem = new Image()
    imagem.onload = imagem.onerror = () => setCaixaCarregada(true)
    imagem.src = embalagem
    // Se a foto do poke demorar demais, a animação começa sem ela.
    const limite = setTimeout(() => setFoto((atual) => (atual === undefined ? null : atual)), 8000)
    return () => clearTimeout(limite)
  }, [])

  return (
    <dialog
      ref={janela}
      className="modal-pedido"
      aria-label={`Pedido ${pedido.numero} confirmado`}
      onClose={aoFechar}
    >
      {foto === undefined && (
        <FotoDoPoke selecao={pedido.itens[0].selecao} aoFotografar={fotografar} />
      )}

      <div className="tela-animacao">
        {pronto ? (
          <Player
            component={AnimacaoPedido}
            inputProps={inputProps}
            durationInFrames={DURACAO_EM_QUADROS}
            fps={QUADROS_POR_SEGUNDO}
            compositionWidth={1280}
            compositionHeight={720}
            autoPlay={!semAnimacao}
            initialFrame={semAnimacao ? DURACAO_EM_QUADROS - 1 : 0}
            loop={false}
            controls={false}
            clickToPlay={false}
            // Ao terminar, fica no último quadro em vez de voltar ao começo.
            moveToBeginningWhenEnded={false}
            style={{ width: '100%' }}
          />
        ) : (
          <p role="status">Preparando sua embalagem...</p>
        )}
      </div>

      {/* Em telas pequenas o texto do vídeo fica miúdo, então o resumo se repete aqui. */}
      <ul className="resumo-celular">
        {pedido.itens.map((item) => (
          <li key={item.id}>
            <strong>{item.quantidade}x poke:</strong>{' '}
            {ingredientesDe(item.selecao)
              .map((ingrediente) => ingrediente.nome)
              .join(', ')}
          </li>
        ))}
      </ul>

      <div className="rodape-modal">
        <p>
          Total do pedido <strong>{moeda(pedido.total)}</strong>
          <small>Demonstração: nada foi enviado nem cobrado.</small>
        </p>
        <button type="button" className="botao-lab" onClick={aoFechar}>
          Acompanhar pedido
        </button>
      </div>
    </dialog>
  )
}
