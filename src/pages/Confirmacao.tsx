import { Link, Navigate } from 'react-router'
import { moeda } from '../data/moeda'
import { ingredientesDe } from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'

const nomesPagamento = { pix: 'Pix', cartao: 'cartão', dinheiro: 'dinheiro' }

export default function Confirmacao() {
  const { confirmado } = useCarrinho()
  if (!confirmado) return <Navigate to="/" replace />

  const entrega = confirmado.recebimento === 'entrega'

  return (
    <section className="conteudo texto centro">
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
            <strong>{item.quantidade}x poke</strong>
            <p>
              {ingredientesDe(item.selecao)
                .map((ingrediente) => ingrediente.nome)
                .join(', ')}
            </p>
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
