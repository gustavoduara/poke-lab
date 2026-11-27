import {
  BufferGeometry,
  CylinderGeometry,
  SphereGeometry,
  Texture,
  TorusGeometry,
} from 'three'
import { cuboSalmao, texturaSalmao } from './salmao'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

type Trio = [number, number, number]

// Uma camada é uma forma que compõe cada pedaço (ex.: o cubo e o veio do salmão).
export type Camada = {
  forma: BufferGeometry
  cores: string[]
  escala: Trio
  posicao?: Trio
  brilho?: number // quanto menor a aspereza, mais brilhante
  textura?: Texture
  molhado?: boolean // adiciona uma película brilhante por cima
}

export type Receita = {
  quantidade: number
  altura: number // distância entre o centro do pedaço e onde ele se apoia
  inclinacao: number
  camadas: Camada[]
}

const cubo = new RoundedBoxGeometry(1, 1, 1, 3, 0.18)
const esfera = new SphereGeometry(1, 14, 10)
const disco = new CylinderGeometry(1, 1, 1, 28)

// Pedaço de anel deitado, usado para formas curvas.
const arco = (abertura: number, espessura: number) =>
  new TorusGeometry(1, espessura, 10, 28, abertura).rotateX(Math.PI / 2).center()

const camarao = arco(Math.PI * 1.4, 0.38)
const fatiaAbacate = arco(Math.PI * 0.75, 0.24)
const tiraRepolho = arco(Math.PI * 0.8, 0.09)

export const receitas: Record<string, Receita> = {
  salmao: {
    quantidade: 12,
    altura: 0.11,
    inclinacao: 0.55,
    camadas: [
      {
        forma: cuboSalmao,
        // Tons quase brancos: só variam um pouco a cor da textura de cada cubo.
        cores: ['#ffffff', '#fff0e6', '#ffe9dc'],
        escala: [0.26, 0.21, 0.24],
        brilho: 0.45,
        textura: texturaSalmao,
        molhado: true,
      },
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
  manga: {
    quantidade: 18,
    altura: 0.08,
    inclinacao: 0.6,
    camadas: [
      { forma: cubo, cores: ['#ffb627', '#ffa817', '#ffc445'], escala: [0.17, 0.15, 0.17], brilho: 0.35 },
    ],
  },
  abacate: {
    quantidade: 9,
    altura: 0.08,
    inclinacao: 0.35,
    camadas: [
      { forma: fatiaAbacate, cores: ['#c5d96f', '#b8d063', '#d0e07f'], escala: [0.24, 0.2, 0.24], brilho: 0.45 },
      { forma: fatiaAbacate, cores: ['#4f7a2a'], escala: [0.285, 0.1, 0.285] },
    ],
  },
  pepino: {
    quantidade: 11,
    altura: 0.07,
    inclinacao: 0.7,
    camadas: [
      { forma: disco, cores: ['#3f7d3c'], escala: [0.16, 0.05, 0.16] },
      { forma: disco, cores: ['#d5ecb0', '#c9e5a1'], escala: [0.135, 0.056, 0.135], brilho: 0.35 },
      { forma: disco, cores: ['#b3d889'], escala: [0.06, 0.06, 0.06] },
    ],
  },
  edamame: {
    quantidade: 28,
    altura: 0.06,
    inclinacao: 1,
    camadas: [
      { forma: esfera, cores: ['#8cbf3f', '#7fb136', '#9dcc52'], escala: [0.095, 0.065, 0.07], brilho: 0.4 },
    ],
  },
  cenoura: {
    quantidade: 34,
    altura: 0.06,
    inclinacao: 0.5,
    camadas: [
      { forma: cubo, cores: ['#f2711c', '#ff8429', '#e46412'], escala: [0.36, 0.035, 0.035] },
    ],
  },
  repolho: {
    quantidade: 30,
    altura: 0.05,
    inclinacao: 0.8,
    camadas: [
      { forma: tiraRepolho, cores: ['#7b3f8c', '#8f4fa1', '#693278'], escala: [0.18, 0.22, 0.18] },
    ],
  },
}
