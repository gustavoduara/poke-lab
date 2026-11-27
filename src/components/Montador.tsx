import { useState } from 'react'
import { Link } from 'react-router'
import { etapas, type Etapa } from '../data/cardapio'
import { ingredientesDe, podeAdicionar, precoDoBowl } from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'
import PreviaBowl from './PreviaBowl'
import { moeda } from '../data/moeda'

export default function Montador() {
  const { selecao, setSelecao, adicionar } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)

  function alternar(etapa: Etapa, id: string) {
    setAdicionado(false)
    setSelecao((atual) => {
      const marcados = atual[etapa.id] ?? []
      if (marcados.includes(id)) {
        return { ...atual, [etapa.id]: marcados.filter((item) => item !== id) }
      }
      if (etapa.maximo === 1) return { ...atual, [etapa.id]: [id] }
      if (marcados.length >= etapa.maximo) return atual
      return { ...atual, [etapa.id]: [...marcados, id] }
    })
  }

  const escolhidos = ingredientesDe(selecao)
  const total = precoDoBowl(selecao)
  const completo = podeAdicionar(selecao)

  function adicionarAoCarrinho() {
    adicionar(selecao)
    setSelecao({})
    setAdicionado(true)
  }

  return (
    <section className="montador">
      <h1>Monte seu poke</h1>
      <div className="etapas">
        {etapas.map((etapa) => {
          const marcados = selecao[etapa.id] ?? []
          return (
            <fieldset key={etapa.id}>
              <legend>
                {etapa.titulo} <small>até {etapa.maximo}</small>
              </legend>
              <div className="opcoes">
                {etapa.opcoes.map((opcao) => {
                  const ativo = marcados.includes(opcao.id)
                  const bloqueado =
                    !ativo && etapa.maximo > 1 && marcados.length >= etapa.maximo
                  return (
                    <button
                      key={opcao.id}
                      type="button"
                      className="opcao"
                      aria-pressed={ativo}
                      disabled={bloqueado}
                      onClick={() => alternar(etapa, opcao.id)}
                    >
                      <span className="amostra" style={{ background: opcao.cor }} />
                      {opcao.nome}
                      {opcao.preco > 0 && <small>+ {moeda(opcao.preco)}</small>}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )
        })}
      </div>

      <aside className="resumo">
        <PreviaBowl
          pedido={selecao}
          descricao={
            escolhidos.length
              ? `Bowl em 3D com ${escolhidos.map((item) => item.nome).join(', ')}`
              : 'Bowl em 3D vazio'
          }
        />
        <ul>
          {escolhidos.map((item) => (
            <li key={item.id}>{item.nome}</li>
          ))}
        </ul>
        <p className="total">
          Total <strong>{moeda(total)}</strong>
        </p>
        <button
          type="button"
          className="botao"
          disabled={!completo}
          onClick={adicionarAoCarrinho}
        >
          Adicionar ao carrinho
        </button>
        <p className="dica" role="status">
          {adicionado ? (
            <>
              Poke adicionado! <Link to="/carrinho">Ver carrinho</Link>
            </>
          ) : (
            !completo && 'Escolha uma base e pelo menos uma proteína.'
          )}
        </p>
      </aside>
    </section>
  )
}
