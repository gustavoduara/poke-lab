// Cardápio de sushi. Os preços são fictícios.

export type TipoPeca =
  | 'nigiriSalmao'
  | 'nigiriAtum'
  | 'nigiriCamarao'
  | 'nigiriMacaricado'
  | 'hossomaki'
  | 'uramaki'
  | 'joe'
  | 'sashimi'

export const nomesDasPecas: Record<TipoPeca, string> = {
  nigiriSalmao: 'Nigiri de salmão',
  nigiriAtum: 'Nigiri de atum',
  nigiriCamarao: 'Nigiri de camarão',
  nigiriMacaricado: 'Nigiri maçaricado',
  hossomaki: 'Hossomaki de salmão',
  uramaki: 'Uramaki Filadélfia',
  joe: 'Joe de salmão',
  sashimi: 'Sashimi de salmão',
}

export type SushiProduto = {
  id: string
  nome: string
  descricao: string
  preco: number
  grupo: 'combinados' | 'pecas'
  etiqueta: string
  cor: string // faixa do cartão
  pecas: { tipo: TipoPeca; quantidade: number }[]
}

export const sushis: SushiProduto[] = [
  {
    id: 'combinado-macaricado',
    nome: 'Combinado Maçaricado',
    descricao: 'O salmão é selado na hora pelo maçarico, com uramaki e joe.',
    preco: 54.9,
    grupo: 'combinados',
    etiqueta: 'Feito no fogo',
    cor: '#c2452b',
    pecas: [
      { tipo: 'nigiriMacaricado', quantidade: 4 },
      { tipo: 'uramaki', quantidade: 4 },
      { tipo: 'joe', quantidade: 4 },
    ],
  },
  {
    id: 'combinado-classico',
    nome: 'Combinado Clássico',
    descricao: 'Um pouco de cada: rolinhos e nigiris de salmão, atum e camarão.',
    preco: 56.9,
    grupo: 'combinados',
    etiqueta: 'Mais pedido',
    cor: '#a96f00',
    pecas: [
      { tipo: 'hossomaki', quantidade: 4 },
      { tipo: 'uramaki', quantidade: 4 },
      { tipo: 'nigiriSalmao', quantidade: 4 },
      { tipo: 'nigiriAtum', quantidade: 2 },
      { tipo: 'nigiriCamarao', quantidade: 2 },
    ],
  },
  {
    id: 'combinado-salmao',
    nome: 'Combinado Salmão',
    descricao: 'Para quem ama salmão: sashimi, joe, nigiri e uramaki.',
    preco: 62.9,
    grupo: 'combinados',
    etiqueta: 'Sugestão da casa',
    cor: '#6d4fd0',
    pecas: [
      { tipo: 'sashimi', quantidade: 4 },
      { tipo: 'joe', quantidade: 4 },
      { tipo: 'nigiriSalmao', quantidade: 4 },
      { tipo: 'uramaki', quantidade: 4 },
    ],
  },
  {
    id: 'nigiri-macaricado',
    nome: 'Nigiri maçaricado',
    descricao: 'Salmão sobre arroz, dourado pela chama.',
    preco: 24.9,
    grupo: 'pecas',
    etiqueta: '4 peças',
    cor: '#c2452b',
    pecas: [{ tipo: 'nigiriMacaricado', quantidade: 4 }],
  },
  {
    id: 'nigiri-salmao',
    nome: 'Nigiri de salmão',
    descricao: 'Fatia de salmão fresco sobre um bolinho de arroz.',
    preco: 19.9,
    grupo: 'pecas',
    etiqueta: '4 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'nigiriSalmao', quantidade: 4 }],
  },
  {
    id: 'nigiri-atum',
    nome: 'Nigiri de atum',
    descricao: 'Atum vermelho sobre arroz temperado.',
    preco: 22.9,
    grupo: 'pecas',
    etiqueta: '4 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'nigiriAtum', quantidade: 4 }],
  },
  {
    id: 'nigiri-camarao',
    nome: 'Nigiri de camarão',
    descricao: 'Camarão aberto sobre o arroz.',
    preco: 21.9,
    grupo: 'pecas',
    etiqueta: '4 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'nigiriCamarao', quantidade: 4 }],
  },
  {
    id: 'uramaki',
    nome: 'Uramaki Filadélfia',
    descricao: 'Arroz por fora com gergelim; salmão, cream cheese e abacate por dentro.',
    preco: 26.9,
    grupo: 'pecas',
    etiqueta: '8 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'uramaki', quantidade: 8 }],
  },
  {
    id: 'hossomaki',
    nome: 'Hossomaki de salmão',
    descricao: 'Rolinho fino envolto em alga nori.',
    preco: 19.9,
    grupo: 'pecas',
    etiqueta: '8 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'hossomaki', quantidade: 8 }],
  },
  {
    id: 'joe',
    nome: 'Joe de salmão',
    descricao: 'Salmão em volta do arroz, com cream cheese e cebolinha.',
    preco: 25.9,
    grupo: 'pecas',
    etiqueta: '4 peças',
    cor: '#28363c',
    pecas: [{ tipo: 'joe', quantidade: 4 }],
  },
  {
    id: 'sashimi',
    nome: 'Sashimi de salmão',
    descricao: 'Fatias de salmão puro, sem arroz.',
    preco: 27.9,
    grupo: 'pecas',
    etiqueta: '5 fatias',
    cor: '#28363c',
    pecas: [{ tipo: 'sashimi', quantidade: 5 }],
  },
]

export const sushiPorId = (id: string) => sushis.find((sushi) => sushi.id === id)

export const totalDePecas = (sushi: SushiProduto) =>
  sushi.pecas.reduce((soma, peca) => soma + peca.quantidade, 0)

export const composicao = (sushi: SushiProduto) =>
  sushi.pecas
    .map((peca) => `${peca.quantidade}x ${nomesDasPecas[peca.tipo]}`)
    .join(', ')

export const temMacarico = (sushi: SushiProduto) =>
  sushi.pecas.some((peca) => peca.tipo === 'nigiriMacaricado')
