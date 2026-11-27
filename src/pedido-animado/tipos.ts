import { etapas } from '../data/cardapio'
import { ehPoke, type PedidoConfirmado, type Selecao } from '../data/pedido'

export type ItemResumo = {
  quantidade: number
  base: string
  proteinas: string[]
  acompanhamentos: string[]
  molho: string
  crocantes: string[]
}

export type OrderSummary = {
  numero: string
  itens: ItemResumo[] // só os pokes
  outrosItens?: number // unidades além do primeiro poke, incluindo sushi
  total: number
}

export type PropsAnimacao = {
  orderSummary: OrderSummary
  pokeImageUrl?: string // imagem do poke montado; sem ela, aparece o bowl da foto
}

export const DURACAO_EM_QUADROS = 90
export const QUADROS_POR_SEGUNDO = 30

// Dados de exemplo para testar a animação sem fazer um pedido.
export const defaultProps: PropsAnimacao = {
  orderSummary: {
    numero: '1024',
    itens: [
      {
        quantidade: 1,
        base: 'Arroz gohan',
        proteinas: ['Salmão', 'Atum'],
        acompanhamentos: ['Manga', 'Abacate', 'Pepino', 'Edamame'],
        molho: 'Tarê',
        crocantes: ['Gergelim'],
      },
    ],
    total: 51.9,
  },
  pokeImageUrl: undefined,
}

const nomes = (selecao: Selecao, etapaId: string) =>
  (selecao[etapaId] ?? []).map(
    (id) =>
      etapas.find((etapa) => etapa.id === etapaId)?.opcoes.find((o) => o.id === id)?.nome ?? id,
  )

export function resumirPedido(pedido: PedidoConfirmado): OrderSummary {
  return {
    numero: pedido.numero,
    total: pedido.total,
    outrosItens: pedido.itens.reduce((soma, item) => soma + item.quantidade, 0) - 1,
    itens: pedido.itens.filter(ehPoke).map((item) => ({
      quantidade: item.quantidade,
      base: nomes(item.selecao, 'base')[0] ?? '',
      proteinas: nomes(item.selecao, 'proteina'),
      acompanhamentos: nomes(item.selecao, 'complementos'),
      molho: nomes(item.selecao, 'molho')[0] ?? '',
      crocantes: nomes(item.selecao, 'crocante'),
    })),
  }
}
