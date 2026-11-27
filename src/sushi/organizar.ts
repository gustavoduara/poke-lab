import type { SushiProduto, TipoPeca } from '../data/sushi'

export type PecaNaTabua = {
  chave: string
  tipo: TipoPeca
  semente: number
  posicao: [number, number]
  giro: number
}

type Grupo = { tipo: TipoPeca; quantidade: number }

const ehLonga = (tipo: TipoPeca) => tipo.startsWith('nigiri') || tipo === 'sashimi'
const larguraDe = (tipo: TipoPeca) => (ehLonga(tipo) ? 0.66 : 0.76)

// Nigiris e sashimis ficam atravessados, por isso a fileira deles é mais funda.
const medirFileira = (fileira: Grupo[]) => ({
  largura: fileira.reduce((soma, g) => soma + g.quantidade * larguraDe(g.tipo), 0),
  profundidade: fileira.some((g) => ehLonga(g.tipo)) ? 1.18 : 0.9,
})

// Todas as formas de dividir os tipos, na ordem, em fileiras (no máximo três).
function divisoes(grupos: Grupo[], restantes = 3): Grupo[][][] {
  const opcoes: Grupo[][][] = [[grupos]]
  if (restantes === 1) return opcoes
  for (let corte = 1; corte < grupos.length; corte++) {
    for (const resto of divisoes(grupos.slice(corte), restantes - 1)) {
      opcoes.push([grupos.slice(0, corte), ...resto])
    }
  }
  return opcoes
}

// Escolhe a divisão em que a tábua fica com um formato bom de ver (mais larga que funda).
function melhorDivisao(grupos: Grupo[]) {
  const nota = (fileiras: Grupo[][]) => {
    const medidas = fileiras.map(medirFileira)
    const largura = Math.max(...medidas.map((m) => m.largura))
    const profundidade = medidas.reduce((soma, m) => soma + m.profundidade, 0)
    return Math.abs(Math.log(largura / profundidade / 1.45))
  }
  return divisoes(grupos).reduce((melhor, atual) => (nota(atual) < nota(melhor) ? atual : melhor))
}

// Arruma as peças em fileiras: cada tipo fica junto, como em um combinado de verdade.
export function organizar(sushi: SushiProduto) {
  // Um produto de um só tipo, com muitas peças, é repartido em duas fileiras.
  const [unico] = sushi.pecas
  const grupos =
    sushi.pecas.length === 1 && unico.quantidade > 5
      ? [
          { tipo: unico.tipo, quantidade: Math.ceil(unico.quantidade / 2) },
          { tipo: unico.tipo, quantidade: Math.floor(unico.quantidade / 2) },
        ]
      : sushi.pecas

  const fileiras = melhorDivisao(grupos)
  const medidas = fileiras.map(medirFileira)
  const profundidade = medidas.reduce((soma, m) => soma + m.profundidade, 0)
  const largura = Math.max(...medidas.map((m) => m.largura))

  const pecas: PecaNaTabua[] = []
  let z = -profundidade / 2
  fileiras.forEach((fileira, f) => {
    const tipos = fileira.flatMap((g) => Array<TipoPeca>(g.quantidade).fill(g.tipo))
    let x = -medidas[f].largura / 2
    tipos.forEach((tipo, i) => {
      const passo = larguraDe(tipo)
      pecas.push({
        chave: `${f}-${i}`,
        tipo,
        semente: 700 + f * 97 + i * 13,
        posicao: [x + passo / 2, z + medidas[f].profundidade / 2],
        // As peças compridas ficam quase em pé na tábua, levemente inclinadas.
        giro: ehLonga(tipo) ? Math.PI / 2 - 0.35 : (i % 3) * 0.5,
      })
      x += passo
    })
    z += medidas[f].profundidade
  })

  return { pecas, largura: largura + 1.15, profundidade: profundidade + 0.55 }
}
