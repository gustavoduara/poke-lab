import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { moeda } from '../data/moeda'
import { TAXA_ENTREGA, totalDoCarrinho, type Pagamento } from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'

const pagamentos: { id: Pagamento; nome: string }[] = [
  { id: 'pix', nome: 'Pix' },
  { id: 'cartao', nome: 'Cartão' },
  { id: 'dinheiro', nome: 'Dinheiro' },
]

export default function Finalizar() {
  const { itens, confirmado, concluir, recebimento, setRecebimento } = useCarrinho()
  const [pagamento, setPagamento] = useState<Pagamento>('pix')
  const [erro, setErro] = useState('')

  if (itens.length === 0) {
    return <Navigate to={confirmado ? '/confirmacao' : '/carrinho'} replace />
  }

  const subtotal = totalDoCarrinho(itens)
  const taxa = recebimento === 'entrega' ? TAXA_ENTREGA : 0
  const total = subtotal + taxa

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    const dados = new FormData(evento.currentTarget)
    const texto = (campo: string) => String(dados.get(campo) ?? '').trim()

    const nome = texto('nome')
    const digitos = texto('telefone').replace(/\D/g, '')
    const troco = Number(texto('troco') || 0)

    if (!nome) return setErro('Informe seu nome.')
    if (digitos.length < 10 || digitos.length > 11) {
      return setErro('Informe o telefone com DDD.')
    }
    if (recebimento === 'entrega' && ['rua', 'numero', 'bairro'].some((c) => !texto(c))) {
      return setErro('Preencha rua, número e bairro.')
    }
    if (pagamento === 'dinheiro' && troco && troco < total) {
      return setErro(`O valor para troco precisa ser pelo menos ${moeda(total)}.`)
    }

    // Só o necessário para a confirmação. Telefone e endereço não são guardados.
    concluir({
      numero: String(Math.floor(1000 + Math.random() * 9000)),
      nome,
      recebimento,
      pagamento,
      troco: pagamento === 'dinheiro' && troco ? troco - total : 0,
      itens,
      total,
    })
  }

  return (
    <section className="conteudo texto">
      <h1>Finalizar pedido</h1>
      <p className="aviso">
        Esta é uma demonstração: nada é enviado nem cobrado. Use dados fictícios.
      </p>

      <form className="formulario" onSubmit={enviar} onChange={() => setErro('')} noValidate>
        <fieldset>
          <legend>Seus dados</legend>
          <label>
            Nome
            <input name="nome" maxLength={60} autoComplete="off" />
          </label>
          <label>
            Telefone com DDD
            <input name="telefone" type="tel" maxLength={20} autoComplete="off" />
          </label>
        </fieldset>

        <fieldset>
          <legend>Como quer receber?</legend>
          <div className="escolhas">
            <label>
              <input
                type="radio"
                name="recebimento"
                checked={recebimento === 'entrega'}
                onChange={() => setRecebimento('entrega')}
              />
              Entrega (+ {moeda(TAXA_ENTREGA)})
            </label>
            <label>
              <input
                type="radio"
                name="recebimento"
                checked={recebimento === 'retirada'}
                onChange={() => setRecebimento('retirada')}
              />
              Retirar no balcão
            </label>
          </div>
          {recebimento === 'entrega' && (
            <>
              <label>
                Rua
                <input name="rua" maxLength={100} autoComplete="off" />
              </label>
              <label>
                Número
                <input name="numero" maxLength={10} autoComplete="off" />
              </label>
              <label>
                Bairro
                <input name="bairro" maxLength={60} autoComplete="off" />
              </label>
              <label>
                Complemento (opcional)
                <input name="complemento" maxLength={60} autoComplete="off" />
              </label>
            </>
          )}
        </fieldset>

        <fieldset>
          <legend>Pagamento na {recebimento === 'entrega' ? 'entrega' : 'retirada'}</legend>
          <div className="escolhas">
            {pagamentos.map((opcao) => (
              <label key={opcao.id}>
                <input
                  type="radio"
                  name="pagamento"
                  checked={pagamento === opcao.id}
                  onChange={() => setPagamento(opcao.id)}
                />
                {opcao.nome}
              </label>
            ))}
          </div>
          {pagamento === 'dinheiro' && (
            <label>
              Troco para quanto? (opcional)
              <input name="troco" type="number" min="0" step="0.01" inputMode="decimal" />
            </label>
          )}
        </fieldset>

        <div>
          <p className="linha">
            Subtotal <span>{moeda(subtotal)}</span>
          </p>
          <p className="linha">
            Taxa de entrega <span>{moeda(taxa)}</span>
          </p>
          <p className="linha subtotal">
            Total <strong>{moeda(total)}</strong>
          </p>
        </div>

        <p className="erro" role="alert">
          {erro}
        </p>

        <div className="acoes">
          <Link to="/carrinho" className="botao secundario">
            Voltar ao carrinho
          </Link>
          <button type="submit" className="botao">
            Finalizar pedido
          </button>
        </div>
      </form>
    </section>
  )
}
