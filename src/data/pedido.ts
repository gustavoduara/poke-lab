import { etapas, precoBase } from './cardapio'
import { composicao, sushiPorId } from './sushi'

// Os ids escolhidos em cada etapa do montador.
export type Selecao = Record<string, string[]>

export type ItemCarrinho = {
  id: string
  selecao: Selecao // vazia quando o item é sushi
  sushi?: string // id do produto de sushi
  quantidade: number
}

export const MAXIMO_POR_ITEM = 20
export const TAXA_ENTREGA = 7

export type Recebimento = 'entrega' | 'retirada'
export type Pagamento = 'pix' | 'cartao' | 'dinheiro'

export type PedidoConfirmado = {
  numero: string
  nome: string
  recebimento: Recebimento
  pagamento: Pagamento
  troco: number
  itens: ItemCarrinho[]
  total: number
}

export const ingredientesDe = (selecao: Selecao) =>
  etapas.flatMap((etapa) =>
    etapa.opcoes.filter((opcao) => selecao[etapa.id]?.includes(opcao.id)),
  )

export const precoDoBowl = (selecao: Selecao) =>
  ingredientesDe(selecao).reduce((soma, item) => soma + item.preco, precoBase)

export const ehPoke = (item: ItemCarrinho) => !item.sushi

export const precoDoItem = (item: ItemCarrinho) =>
  item.sushi ? (sushiPorId(item.sushi)?.preco ?? 0) : precoDoBowl(item.selecao)

export const nomeDoItem = (item: ItemCarrinho) =>
  item.sushi ? (sushiPorId(item.sushi)?.nome ?? 'Sushi') : 'Poke'

export function descricaoDoItem(item: ItemCarrinho) {
  const sushi = item.sushi ? sushiPorId(item.sushi) : undefined
  if (sushi) return composicao(sushi)
  return ingredientesDe(item.selecao)
    .map((ingrediente) => ingrediente.nome)
    .join(', ')
}

export const totalDoCarrinho = (itens: ItemCarrinho[]) =>
  itens.reduce((soma, item) => soma + precoDoItem(item) * item.quantidade, 0)

// Um poke precisa de pelo menos uma base e uma proteína.
export const podeAdicionar = (selecao: Selecao) =>
  Boolean(selecao.base?.length && selecao.proteina?.length)

// Confere o que veio do navegador antes de usar.
export function itemValido(valor: unknown): valor is ItemCarrinho {
  const item = valor as ItemCarrinho | null
  return (
    typeof item?.id === 'string' &&
    Number.isInteger(item.quantidade) &&
    item.quantidade >= 1 &&
    item.quantidade <= MAXIMO_POR_ITEM &&
    typeof item.selecao === 'object' &&
    item.selecao !== null &&
    (item.sushi === undefined ? pokeValido(item.selecao) : !!sushiPorId(item.sushi))
  )
}

function pokeValido(selecao: Selecao) {
  return (
    Object.entries(selecao).every(([etapaId, ids]) => {
      const etapa = etapas.find((e) => e.id === etapaId)
      return (
        !!etapa &&
        Array.isArray(ids) &&
        ids.length <= etapa.maximo &&
        ids.every((id) => etapa.opcoes.some((opcao) => opcao.id === id))
      )
    }) && podeAdicionar(selecao)
  )
}
