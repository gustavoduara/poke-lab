import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  MAXIMO_POR_ITEM,
  itemValido,
  type ItemCarrinho,
  type PedidoConfirmado,
  type Recebimento,
  type Selecao,
} from '../data/pedido'
import { CarrinhoContext } from './carrinho'
import { novoId } from './novoId'

const CHAVE = 'pokelab:carrinho'

// O carrinho fica salvo no navegador. Se isso não for possível, o site funciona sem salvar.
function carregar(): ItemCarrinho[] {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(salvo) ? salvo.filter(itemValido) : []
  } catch {
    return []
  }
}

export default function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [selecao, setSelecao] = useState<Selecao>({})
  const [itens, setItens] = useState<ItemCarrinho[]>(carregar)
  const [recebimento, setRecebimento] = useState<Recebimento>('entrega')
  const [confirmado, setConfirmado] = useState<PedidoConfirmado | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens))
    } catch {
      // armazenamento indisponível
    }
  }, [itens])

  const adicionar = useCallback((nova: Selecao) => {
    const item = { id: novoId(), selecao: nova, quantidade: 1 }
    setItens((atual) => [...atual, item])
    setConfirmado(null)
  }, [])

  // O mesmo sushi pedido de novo só aumenta a quantidade.
  const adicionarSushi = useCallback((sushiId: string) => {
    setItens((atual) => {
      const existente = atual.find((item) => item.sushi === sushiId)
      if (!existente) {
        return [...atual, { id: novoId(), selecao: {}, sushi: sushiId, quantidade: 1 }]
      }
      return atual.map((item) =>
        item === existente
          ? { ...item, quantidade: Math.min(MAXIMO_POR_ITEM, item.quantidade + 1) }
          : item,
      )
    })
    setConfirmado(null)
  }, [])

  const mudarQuantidade = useCallback((id: string, quantidade: number) => {
    const limitada = Math.min(MAXIMO_POR_ITEM, Math.max(1, quantidade))
    setItens((atual) =>
      atual.map((item) => (item.id === id ? { ...item, quantidade: limitada } : item)),
    )
  }, [])

  const remover = useCallback((id: string) => {
    setItens((atual) => atual.filter((item) => item.id !== id))
  }, [])

  const concluir = useCallback((pedido: PedidoConfirmado) => {
    setConfirmado(pedido)
    setItens([])
  }, [])

  return (
    <CarrinhoContext.Provider
      value={{
        selecao,
        setSelecao,
        itens,
        recebimento,
        setRecebimento,
        adicionar,
        adicionarSushi,
        mudarQuantidade,
        remover,
        confirmado,
        concluir,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}
