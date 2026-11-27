import { lazy, Suspense, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { moeda } from '../data/moeda'
import { descricaoDoItem, ehPoke, nomeDoItem } from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'

// A animação só é baixada quando um pedido é finalizado.
const ModalPedido = lazy(() => import('../pedido-animado/ModalPedido'))

// Guarda os pedidos cuja animação já foi vista.
const jaVistos = new Set<string>()

const nomesPagamento = { pix: 'Pix', cartao: 'cartão', dinheiro: 'dinheiro' }

export default function Confirmacao() {
  const { confirmado } = useCarrinho()
  const [fechado, setFechado] = useState(false)
  if (!confirmado) return <Navigate to="/" replace />

  const entrega = confirmado.recebimento === 'entrega'
  // A animação mostra a embalagem do poke, então só aparece se houver um no pedido.
  const mostrarAnimacao =
    !fechado && !jaVistos.has(confirmado.numero) && confirmado.itens.some(ehPoke)

  function fecharAnimacao() {
    jaVistos.add(confirmado!.numero)
    setFechado(true)
  }

  return (
    <section className="conteudo texto centro">
      {mostrarAnimacao && (
        <Suspense fallback={null}>
          <ModalPedido pedido={confirmado} aoFechar={fecharAnimacao} />
        </Suspense>
      )}
      <p className="numero">Pedido #{confirmado.numero}</p>
      <h1>Tudo certo, {confirmado.nome}!</h1>
      <p>
        {entrega ? 'Entrega no endereço informado.' : 'Retirada no balcão.'} Pagamento em{' '}
        {nomesPagamento[confirmado.pagamento]} na {entrega ? 'entrega' : 'retirada'}.
        {confirmado.troco > 0 && ` Troco: ${moeda(confirmado.troco)}.`}
      </p>

      <ul className="lista">
        {confirmado.itens.map((item) => (
          <li key={item.id} className="cartao">
            <strong>
              {item.quantidade}x {nomeDoItem(item)}
            </strong>
            <p>{descricaoDoItem(item)}</p>
          </li>
        ))}
      </ul>

      <p className="subtotal">
        Total <strong>{moeda(confirmado.total)}</strong>
      </p>
      <p className="aviso">Pedido de demonstração: nada foi enviado nem cobrado.</p>
      <Link to="/" className="botao">
        Voltar ao início
      </Link>
    </section>
  )
}
