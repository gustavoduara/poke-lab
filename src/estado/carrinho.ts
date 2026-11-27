import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'
import type { ItemCarrinho, Selecao } from '../data/pedido'

export type Estado = {
  // O poke que está sendo montado, mantido ao trocar de página.
  selecao: Selecao
  setSelecao: Dispatch<SetStateAction<Selecao>>
  itens: ItemCarrinho[]
  adicionar: (selecao: Selecao) => void
  mudarQuantidade: (id: string, quantidade: number) => void
  remover: (id: string) => void
  esvaziar: () => void
}

export const CarrinhoContext = createContext<Estado | null>(null)

export function useCarrinho() {
  const estado = useContext(CarrinhoContext)
  if (!estado) throw new Error('useCarrinho precisa estar dentro do CarrinhoProvider')
  return estado
}
