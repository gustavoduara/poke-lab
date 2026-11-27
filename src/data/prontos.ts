import type { Selecao } from './pedido'

export type PokePronto = {
  id: string
  nome: string
  etiqueta: string
  cor: string // faixa do cartão
  fundo: string // fundo da ilustração
  descricao: string
  selecao: Selecao
}

export const pokesProntos: PokePronto[] = [
  {
    id: 'havai',
    nome: 'Havaí Clássico',
    etiqueta: 'Mais pedido',
    cor: '#a96f00',
    fundo: '#f3c64a',
    descricao: 'Salmão fresco com manga e shoyu. Um bom primeiro poke.',
    selecao: {
      base: ['gohan'],
      proteina: ['salmao'],
      complementos: ['manga', 'pepino', 'edamame'],
      molho: ['shoyu'],
      crocante: ['gergelim'],
    },
  },
  {
    id: 'duo',
    nome: 'Duo do Mar',
    etiqueta: 'Sugestão da casa',
    cor: '#6d4fd0',
    fundo: '#2f6fb5',
    descricao: 'Salmão e atum lado a lado, com tarê e nori.',
    selecao: {
      base: ['gohan'],
      proteina: ['salmao', 'atum'],
      complementos: ['abacate', 'pepino', 'edamame', 'cenoura'],
      molho: ['tare'],
      crocante: ['gergelim', 'nori'],
    },
  },
  {
    id: 'tropical',
    nome: 'Tropical Spicy',
    etiqueta: 'Apimentado',
    cor: '#c2452b',
    fundo: '#e8795a',
    descricao: 'Camarão, manga e maionese spicy sobre arroz integral.',
    selecao: {
      base: ['integral'],
      proteina: ['camarao'],
      complementos: ['manga', 'abacate', 'repolho'],
      molho: ['spicy'],
      crocante: ['gergelim'],
    },
  },
  {
    id: 'verde',
    nome: 'Jardim Verde',
    etiqueta: 'Sem peixe',
    cor: '#34793f',
    fundo: '#8a6bbd',
    descricao: 'Tofu e muitos vegetais em uma base de folhas.',
    selecao: {
      base: ['folhas'],
      proteina: ['tofu'],
      complementos: ['abacate', 'edamame', 'cenoura', 'repolho'],
      molho: ['shoyu'],
      crocante: ['couve', 'gergelim'],
    },
  },
]
