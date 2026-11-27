import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { etapas, type Etapa } from '../data/cardapio'
import { ingredientesDe, podeAdicionar, precoDoBowl } from '../data/pedido'
import { useCarrinho } from '../estado/carrinho'
import PreviaBowl from './PreviaBowl'
import { moeda } from '../data/moeda'

export default function Montador() {
  const { selecao, setSelecao, adicionar } = useCarrinho()
  const [adicionado, setAdicionado] = useState(false)
  // Enquanto a tampa fecha, guarda o que fazer depois.
  const [fechando, setFechando] = useState<'continuar' | 'finalizar' | null>(null)
  const navegar = useNavigate()

  // Dá tempo de ver a tampa fechar e depois libera um pote novo.
  // A limpeza também roda se a pessoa trocar de página no meio.
  useEffect(() => {
    if (!fechando) return
    const espera = setTimeout(() => {
      if (fechando === 'finalizar') navegar('/finalizar')
      setFechando(null)
    }, 2600)
    return () => {
      clearTimeout(espera)
      setSelecao({})
    }
  }, [fechando, navegar, setSelecao])

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

  function adicionarAoCarrinho(depois: 'continuar' | 'finalizar') {
    adicionar(selecao)
    setFechando(depois)
    setAdicionado(depois === 'continuar')
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
                    !!fechando ||
                    (!ativo && etapa.maximo > 1 && marcados.length >= etapa.maximo)
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
          fechado={!!fechando}
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
        <div className="botoes-pedido">
          <button
            type="button"
            className="botao"
            disabled={!completo || !!fechando}
            onClick={() => adicionarAoCarrinho('finalizar')}
          >
            Adicionar e finalizar
          </button>
          <button
            type="button"
            className="botao secundario"
            disabled={!completo || !!fechando}
            onClick={() => adicionarAoCarrinho('continuar')}
          >
            Adicionar e continuar pedindo
          </button>
        </div>
        <p className="dica" role="status">
          {fechando === 'finalizar' ? (
            'Fechando seu poke e abrindo a finalização...'
          ) : adicionado ? (
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
