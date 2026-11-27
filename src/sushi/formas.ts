import {
  BufferGeometry,
  CanvasTexture,
  Color,
  ConeGeometry,
  CylinderGeometry,
  Matrix4,
  Object3D,
  SRGBColorSpace,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { criarTextura, manchar, pintarFundo, pontilhar, riscar } from '../components/formas'
import { criarSorteio } from '../components/terreno'

// Fatia de peixe: achatada, que se curva por cima do arroz e afina nas pontas.
export function criarFatia(
  comprimento: number,
  espessura: number,
  largura: number,
  caimento: number,
): BufferGeometry {
  const forma = new RoundedBoxGeometry(comprimento, espessura, largura, 8, espessura * 0.45)
  const posicoes = forma.attributes.position
  const ponto = new Vector3()
  for (let i = 0; i < posicoes.count; i++) {
    ponto.fromBufferAttribute(posicoes, i)
    const u = ponto.x / (comprimento / 2) // de -1 a 1 ao longo da fatia
    const afina = 1 - 0.28 * u ** 4
    posicoes.setXYZ(
      i,
      ponto.x,
      ponto.y * afina - caimento * u ** 2 + Math.sin(ponto.x * 11 + ponto.z * 7) * 0.006,
      ponto.z * afina + Math.sin(ponto.x * 6) * 0.01,
    )
  }
  forma.computeVertexNormals()
  return forma
}

export const fatiaNigiri = criarFatia(1.02, 0.14, 0.46, 0.13)
export const fatiaSashimi = criarFatia(0.66, 0.15, 0.42, 0.04)
export const fatiaCamarao = criarFatia(0.96, 0.12, 0.42, 0.12)
export const blocoDeArroz = new RoundedBoxGeometry(0.76, 0.26, 0.38, 6, 0.12)

// Fatia que dá a volta no arroz do joe: parede ondulada e borda de cima irregular.
export function criarFaixaDoJoe(): BufferGeometry {
  const forma = new CylinderGeometry(0.31, 0.29, 0.42, 72, 8, true)
  const posicoes = forma.attributes.position
  const ponto = new Vector3()
  for (let i = 0; i < posicoes.count; i++) {
    ponto.fromBufferAttribute(posicoes, i)
    const angulo = Math.atan2(ponto.z, ponto.x)
    const alturaRelativa = (ponto.y + 0.21) / 0.42 // 0 embaixo, 1 em cima
    // Um degrau marca o ponto em que uma ponta da fatia passa por cima da outra.
    const volta = ((angulo + Math.PI) / (Math.PI * 2)) * 0.035
    const ondas = Math.sin(angulo * 5 + ponto.y * 9) * 0.014 + Math.sin(angulo * 11) * 0.006
    const barriga = Math.sin(alturaRelativa * Math.PI) * 0.02
    const raio = Math.hypot(ponto.x, ponto.z) + volta + ondas + barriga
    const borda =
      alturaRelativa * (Math.sin(angulo * 3 + 1) * 0.03 + Math.sin(angulo * 7) * 0.012)
    posicoes.setXYZ(i, Math.cos(angulo) * raio, ponto.y + borda, Math.sin(angulo) * raio)
  }
  forma.computeVertexNormals()
  return forma
}

export const faixaDoJoe = criarFaixaDoJoe()

// Metade do leque da cauda do camarão, na ponta esquerda da fatia.
function criarCaudaDoNigiri(abertura: number): BufferGeometry {
  return new ConeGeometry(0.085, 0.26, 12)
    .rotateZ(-Math.PI / 2) // a base larga fica para fora
    .scale(1, 0.35, 1)
    .translate(-0.12, 0, 0)
    .rotateY(abertura)
    .translate(-0.46, -0.11, 0)
}

export const caudasDoNigiri = [criarCaudaDoNigiri(0.42), criarCaudaDoNigiri(-0.42)]

export type Grao = { matriz: Matrix4; cor: Color }

const tonsDeArroz = ['#fffdf6', '#f6f0e2', '#efe8d8'].map((cor) => new Color(cor))

function montarGrao(posicao: Vector3, normal: Vector3, giro: number, tamanho: number, i: number): Grao {
  const objeto = new Object3D()
  objeto.position.copy(posicao)
  // O grão fica deitado na superfície e gira em um ângulo qualquer.
  objeto.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), normal)
  objeto.rotateY(giro)
  objeto.scale.set(0.045 * tamanho, 0.02 * tamanho, 0.022 * tamanho)
  objeto.updateMatrix()
  return { matriz: objeto.matrix.clone(), cor: tonsDeArroz[i % tonsDeArroz.length] }
}

// Grãos sobre o bolinho de arroz do nigiri.
export function graosDoBloco(quantidade: number, semente: number): Grao[] {
  const sortear = criarSorteio(semente)
  const meio = new Vector3(0.38, 0.13, 0.19)
  const miolo = meio.clone().subScalar(0.12)
  return Array.from({ length: quantidade }, (_, i) => {
    // Sorteia um ponto na caixa e o puxa para a superfície arredondada.
    const ponto = new Vector3(sortear() * 2 - 1, sortear() * 2 - 1, sortear() * 2 - 1)
    const eixo = Math.floor(sortear() * 3)
    ponto.setComponent(eixo, ponto.getComponent(eixo) < 0 ? -1 : 1)
    ponto.multiply(meio)
    const dentro = ponto.clone().clamp(miolo.clone().negate(), miolo)
    const normal = ponto.clone().sub(dentro).normalize()
    return montarGrao(
      dentro.addScaledVector(normal, 0.118),
      normal,
      sortear() * Math.PI * 2,
      0.8 + sortear() * 0.35,
      i,
    )
  })
}

// Grãos na face de cima de um rolinho, entre dois raios.
export function graosDoTopo(
  quantidade: number,
  raioInterno: number,
  raioExterno: number,
  altura: number,
  semente: number,
): Grao[] {
  const sortear = criarSorteio(semente)
  const cima = new Vector3(0, 1, 0)
  return Array.from({ length: quantidade }, (_, i) => {
    const raio = Math.sqrt(
      raioInterno ** 2 + sortear() * (raioExterno ** 2 - raioInterno ** 2),
    )
    const angulo = sortear() * Math.PI * 2
    return montarGrao(
      new Vector3(Math.cos(angulo) * raio, altura + sortear() * 0.012, Math.sin(angulo) * raio),
      cima,
      sortear() * Math.PI * 2,
      0.8 + sortear() * 0.3,
      i,
    )
  })
}

// Grãos em volta da lateral de um rolinho.
export function graosDaLateral(
  quantidade: number,
  raio: number,
  altura: number,
  semente: number,
): Grao[] {
  const sortear = criarSorteio(semente)
  return Array.from({ length: quantidade }, (_, i) => {
    const angulo = sortear() * Math.PI * 2
    const normal = new Vector3(Math.cos(angulo), 0, Math.sin(angulo))
    return montarGrao(
      new Vector3(normal.x * raio, (sortear() - 0.5) * altura, normal.z * raio),
      normal,
      sortear() * Math.PI * 2,
      0.8 + sortear() * 0.35,
      i,
    )
  })
}

export const texturaNori = criarTextura(4001, (ctx, lado, sortear) => {
  pintarFundo(ctx, lado, '#0f2418')
  manchar(ctx, lado, sortear, 40, ['28,58,36', '6,18,10'], 0.7)
  riscar(ctx, lado, sortear, 700, ['rgba(70,110,70,0.25)', 'rgba(0,0,0,0.3)'], 9, 0.8)
  pontilhar(ctx, lado, sortear, 1500, ['rgba(110,140,100,0.28)', 'rgba(0,0,0,0.35)'])
})

// Marcas de maçarico: fundo transparente com manchas douradas e pontos tostados.
function criarTostado() {
  const tela = document.createElement('canvas')
  tela.width = tela.height = 256
  const ctx = tela.getContext('2d')!
  const sortear = criarSorteio(5153)
  manchar(ctx, 256, sortear, 34, ['214,104,18', '176,70,8', '232,138,34'], 0.7)
  manchar(ctx, 256, sortear, 22, ['104,38,4', '140,54,6'], 0.75)
  for (let i = 0; i < 60; i++) {
    const x = sortear() * 256
    const y = sortear() * 256
    const raio = 3 + sortear() * 11
    const marca = ctx.createRadialGradient(x, y, 0, x, y, raio)
    marca.addColorStop(0, 'rgba(38,12,0,0.92)')
    marca.addColorStop(0.55, 'rgba(92,32,2,0.65)')
    marca.addColorStop(1, 'rgba(120,48,6,0)')
    ctx.fillStyle = marca
    ctx.fillRect(x - raio, y - raio, raio * 2, raio * 2)
  }
  const textura = new CanvasTexture(tela)
  textura.colorSpace = SRGBColorSpace
  return textura
}

export const texturaTostado = criarTostado()
