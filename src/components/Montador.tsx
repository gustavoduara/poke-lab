import { useState } from 'react'
import { etapas, precoBase, type Etapa } from '../data/cardapio'
import PreviaBowl from './PreviaBowl'

const moeda = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Montador() {
  const [selecao, setSelecao] = useState<Record<string, string[]>>({})

  function alternar(etapa: Etapa, id: string) {
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

  const escolhidos = etapas.flatMap((etapa) =>
    etapa.opcoes.filter((opcao) => selecao[etapa.id]?.includes(opcao.id)),
  )
  const total = escolhidos.reduce((soma, item) => soma + item.preco, precoBase)

  return (
    <section className="montador" id="montar">
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
      </aside>
    </section>
  )
}
