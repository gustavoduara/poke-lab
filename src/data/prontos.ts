import type { Selecao } from './pedido'

export type PokePronto = {
  id: string
  nome: string
  etiqueta: string
  descricao: string
  selecao: Selecao
}

export const pokesProntos: PokePronto[] = [
  {
    id: 'havai',
    nome: 'Havaí Clássico',
    etiqueta: 'O favorito',
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
    etiqueta: 'Mais proteína',
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
