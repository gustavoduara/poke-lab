import { BufferGeometry, TorusGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type Trio = [number, number, number]

// Uma camada é uma forma que compõe cada pedaço (ex.: o cubo e o veio do salmão).
export type Camada = {
  forma: BufferGeometry
  cores: string[]
  escala: Trio
  posicao?: Trio
  brilho?: number // quanto menor a aspereza, mais brilhante
}

export type Receita = {
  quantidade: number
  altura: number // distância entre o centro do pedaço e onde ele se apoia
  inclinacao: number
  camadas: Camada[]
}

const cubo = new RoundedBoxGeometry(1, 1, 1, 3, 0.18)

// Pedaço de anel deitado, usado para formas curvas.
const arco = (abertura: number, espessura: number) =>
  new TorusGeometry(1, espessura, 10, 28, abertura).rotateX(Math.PI / 2).center()

const camarao = arco(Math.PI * 1.4, 0.38)

export const receitas: Record<string, Receita> = {
  salmao: {
    quantidade: 13,
    altura: 0.1,
    inclinacao: 0.5,
    camadas: [
      { forma: cubo, cores: ['#fa8a5c', '#f57c4c', '#ff9a6e'], escala: [0.25, 0.2, 0.23], brilho: 0.35 },
      { forma: cubo, cores: ['#ffd7c2'], escala: [0.025, 0.205, 0.232], posicao: [-0.05, 0, 0] },
      { forma: cubo, cores: ['#ffd7c2'], escala: [0.018, 0.205, 0.232], posicao: [0.055, 0, 0] },
    ],
  },
  atum: {
    quantidade: 13,
    altura: 0.1,
    inclinacao: 0.5,
    camadas: [
      { forma: cubo, cores: ['#b3344a', '#9c2a40', '#c23f54'], escala: [0.24, 0.2, 0.23], brilho: 0.3 },
    ],
  },
  camarao: {
    quantidade: 9,
    altura: 0.08,
    inclinacao: 0.4,
    camadas: [
      { forma: camarao, cores: ['#f6a98b', '#f4936f', '#f9bba0'], escala: [0.14, 0.15, 0.14], brilho: 0.4 },
    ],
  },
  tofu: {
    quantidade: 13,
    altura: 0.09,
    inclinacao: 0.4,
    camadas: [
      { forma: cubo, cores: ['#efe3b8', '#f4ebc9', '#e6d6a2'], escala: [0.22, 0.18, 0.22], brilho: 0.8 },
    ],
  },
}
