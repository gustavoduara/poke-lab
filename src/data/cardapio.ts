export type Ingrediente = {
  id: string
  nome: string
  cor: string
  preco: number
}

export type Etapa = {
  id: string
  titulo: string
  maximo: number
  opcoes: Ingrediente[]
}

export const precoBase = 24.9

export const etapas: Etapa[] = [
  {
    id: 'base',
    titulo: 'Base',
    maximo: 1,
    opcoes: [
      { id: 'gohan', nome: 'Arroz gohan', cor: '#f4efe2', preco: 0 },
      { id: 'integral', nome: 'Arroz integral', cor: '#c9a876', preco: 0 },
      { id: 'folhas', nome: 'Mix de folhas', cor: '#6fa84f', preco: 0 },
    ],
  },
  {
    id: 'proteina',
    titulo: 'Proteína',
    maximo: 2,
    opcoes: [
      { id: 'salmao', nome: 'Salmão', cor: '#fa8a5c', preco: 9 },
      { id: 'atum', nome: 'Atum', cor: '#b3344a', preco: 9 },
      { id: 'camarao', nome: 'Camarão', cor: '#f6a98b', preco: 8 },
      { id: 'tofu', nome: 'Tofu', cor: '#efe3b8', preco: 5 },
    ],
  },
  {
    id: 'complementos',
    titulo: 'Complementos',
    maximo: 4,
    opcoes: [
      { id: 'manga', nome: 'Manga', cor: '#ffb627', preco: 2 },
      { id: 'abacate', nome: 'Abacate', cor: '#a4c46c', preco: 3 },
      { id: 'pepino', nome: 'Pepino', cor: '#4c8c4a', preco: 1.5 },
      { id: 'edamame', nome: 'Edamame', cor: '#8cbf3f', preco: 2.5 },
      { id: 'cenoura', nome: 'Cenoura', cor: '#f2711c', preco: 1.5 },
      { id: 'repolho', nome: 'Repolho roxo', cor: '#7b3f8c', preco: 1.5 },
    ],
  },
  {
    id: 'molho',
    titulo: 'Molho',
    maximo: 1,
    opcoes: [
      { id: 'shoyu', nome: 'Shoyu', cor: '#4a2511', preco: 0 },
      { id: 'tare', nome: 'Tarê', cor: '#7a3b12', preco: 0 },
      { id: 'spicy', nome: 'Maionese spicy', cor: '#f08a4b', preco: 0 },
    ],
  },
  {
    id: 'crocante',
    titulo: 'Crocante',
    maximo: 2,
    opcoes: [
      { id: 'gergelim', nome: 'Gergelim', cor: '#e8d6a8', preco: 1 },
      { id: 'nori', nome: 'Nori', cor: '#1f3d2b', preco: 1.5 },
      { id: 'couve', nome: 'Couve crispy', cor: '#2f5d34', preco: 2 },
    ],
  },
]
