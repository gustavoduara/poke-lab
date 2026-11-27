import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { MAXIMO_POR_ITEM, itemValido, type ItemCarrinho, type Selecao } from '../data/pedido'
import { CarrinhoContext } from './carrinho'

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

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(itens))
    } catch {
      // armazenamento indisponível
    }
  }, [itens])

  const adicionar = useCallback((nova: Selecao) => {
    const item = { id: crypto.randomUUID(), selecao: nova, quantidade: 1 }
    setItens((atual) => [...atual, item])
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

  const esvaziar = useCallback(() => setItens([]), [])

  return (
    <CarrinhoContext.Provider
      value={{ selecao, setSelecao, itens, adicionar, mudarQuantidade, remover, esvaziar }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}
