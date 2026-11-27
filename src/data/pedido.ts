import { etapas, precoBase } from './cardapio'

// Os ids escolhidos em cada etapa do montador.
export type Selecao = Record<string, string[]>

export type ItemCarrinho = {
  id: string
  selecao: Selecao
  quantidade: number
}

export const MAXIMO_POR_ITEM = 20

export const ingredientesDe = (selecao: Selecao) =>
  etapas.flatMap((etapa) =>
    etapa.opcoes.filter((opcao) => selecao[etapa.id]?.includes(opcao.id)),
  )

export const precoDoBowl = (selecao: Selecao) =>
  ingredientesDe(selecao).reduce((soma, item) => soma + item.preco, precoBase)

export const totalDoCarrinho = (itens: ItemCarrinho[]) =>
  itens.reduce((soma, item) => soma + precoDoBowl(item.selecao) * item.quantidade, 0)

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
    Object.entries(item.selecao).every(([etapaId, ids]) => {
      const etapa = etapas.find((e) => e.id === etapaId)
      return (
        !!etapa &&
        Array.isArray(ids) &&
        ids.length <= etapa.maximo &&
        ids.every((id) => etapa.opcoes.some((opcao) => opcao.id === id))
      )
    }) &&
    podeAdicionar(item.selecao)
  )
}
