// Funções compartilhadas para posicionar os ingredientes dentro do bowl.

export const RAIO_BASE = 1.5

// Altura do monte da base conforme a distância do centro do bowl.
export const alturaBase = (raio: number) => 0.15 + 0.25 * (1 - (raio / RAIO_BASE) ** 2)

// Parte de dentro do bowl [raio, altura], usada quando não há base.
const fundo: [number, number][] = [
  [0, -0.53], [0.35, -0.52], [0.75, -0.45], [1.17, -0.26], [1.46, 0.05], [1.62, 0.4],
]

function alturaFundo(raio: number) {
  const i = fundo.findIndex(([r]) => r >= raio)
  if (i <= 0) return i === 0 ? fundo[0][1] : fundo[fundo.length - 1][1]
  const [r0, y0] = fundo[i - 1]
  const [r1, y1] = fundo[i]
  return y0 + ((raio - r0) / (r1 - r0)) * (y1 - y0)
}

// Onde um ingrediente se apoia: sobre a base ou direto no fundo do bowl.
export const apoio = (raio: number, temBase: boolean) =>
  temBase ? alturaBase(raio) : alturaFundo(raio)

// Sorteio com semente: o bowl fica igual a cada vez que o item é escolhido.
export function criarSorteio(semente: number) {
  let estado = semente
  return () => {
    estado = (estado * 16807) % 2147483647
    return estado / 2147483647
  }
}

// O bowl é dividido em seis fatias, uma para cada proteína ou complemento.
export const fatiasProteina = [0, 3]
export const fatiasComplemento = [1, 4, 2, 5]
export const RAIO_FATIA = 0.9

export function centroFatia(fatia: number): [number, number] {
  const angulo = (fatia * Math.PI) / 3 + 0.5
  return [Math.cos(angulo) * RAIO_FATIA, Math.sin(angulo) * RAIO_FATIA]
}
