import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { ItemCarrinho, PedidoConfirmado, Recebimento, Selecao } from '../data/pedido'

export type Estado = {
  // O poke que está sendo montado, mantido ao trocar de página.
  selecao: Selecao
  setSelecao: Dispatch<SetStateAction<Selecao>>
  itens: ItemCarrinho[]
  recebimento: Recebimento
  setRecebimento: (valor: Recebimento) => void
  adicionar: (selecao: Selecao) => void
  mudarQuantidade: (id: string, quantidade: number) => void
  remover: (id: string) => void
  // Último pedido finalizado. Fica só na memória, até recarregar a página.
  confirmado: PedidoConfirmado | null
  concluir: (pedido: PedidoConfirmado) => void
}

export const CarrinhoContext = createContext<Estado | null>(null)

export function useCarrinho() {
  const estado = useContext(CarrinhoContext)
  if (!estado) throw new Error('useCarrinho precisa estar dentro do CarrinhoProvider')
  return estado
}
