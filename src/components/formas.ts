import { CanvasTexture, SRGBColorSpace, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { criarSorteio } from './terreno'

type Sorteio = () => number
type Desenho = (ctx: CanvasRenderingContext2D, lado: number, sortear: Sorteio) => void

// Cria uma textura desenhando em um canvas, sem usar arquivos de imagem.
export function criarTextura(semente: number, desenhar: Desenho) {
  const lado = 256
  const tela = document.createElement('canvas')
  tela.width = tela.height = lado
  desenhar(tela.getContext('2d')!, lado, criarSorteio(semente))
  const textura = new CanvasTexture(tela)
  textura.colorSpace = SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

export function pintarFundo(ctx: CanvasRenderingContext2D, lado: number, cor: string) {
  ctx.fillStyle = cor
  ctx.fillRect(0, 0, lado, lado)
}

// Riscos curtos que imitam fibras.
export function riscar(
  ctx: CanvasRenderingContext2D,
  lado: number,
  sortear: Sorteio,
  quantidade: number,
  cores: string[],
  comprimento: number,
  inclinacao: number,
) {
  for (let i = 0; i < quantidade; i++) {
    const x = sortear() * lado
    const y = sortear() * lado
    const tamanho = comprimento * (0.5 + sortear())
    ctx.strokeStyle = cores[i % cores.length]
    ctx.lineWidth = 1 + sortear() * 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + tamanho, y + tamanho * inclinacao)
    ctx.stroke()
  }
}

// Manchas redondas e esfumadas. As cores vêm como "r,g,b".
export function manchar(
  ctx: CanvasRenderingContext2D,
  lado: number,
  sortear: Sorteio,
  quantidade: number,
  cores: string[],
  forca: number,
) {
  for (let i = 0; i < quantidade; i++) {
    const x = sortear() * lado
    const y = sortear() * lado
    const raio = 14 + sortear() * 44
    const mancha = ctx.createRadialGradient(x, y, 0, x, y, raio)
    mancha.addColorStop(0, `rgba(${cores[i % cores.length]},${forca})`)
    mancha.addColorStop(1, `rgba(${cores[i % cores.length]},0)`)
    ctx.fillStyle = mancha
    ctx.fillRect(x - raio, y - raio, raio * 2, raio * 2)
  }
}

// Pontinhos que quebram a aparência lisa.
export function pontilhar(
  ctx: CanvasRenderingContext2D,
  lado: number,
  sortear: Sorteio,
  quantidade: number,
  cores: string[],
) {
  for (let i = 0; i < quantidade; i++) {
    ctx.fillStyle = cores[i % cores.length]
    ctx.fillRect(sortear() * lado, sortear() * lado, 1 + sortear() * 1.6, 1 + sortear() * 1.6)
  }
}

// Cubo levemente torto, para não parecer um dado de plástico.
// A aspereza cria pequenas ondulações na superfície, como em um corte de verdade.
export function criarCuboIrregular(
  arredondado: number,
  torto: number,
  fase = 0,
  aspereza = 0,
) {
  const forma = new RoundedBoxGeometry(1, 1, 1, aspereza ? 7 : 4, arredondado)
  const posicoes = forma.attributes.position
  const ponto = new Vector3()
  for (let i = 0; i < posicoes.count; i++) {
    ponto.fromBufferAttribute(posicoes, i)
    // A deformação depende só da posição, então as faces continuam unidas.
    const onda = Math.sin(ponto.y * 5 + ponto.z * 3 + fase) * torto
    const ruido =
      aspereza * Math.sin(ponto.x * 17 + ponto.z * 11) * Math.sin(ponto.y * 13 - ponto.x * 7)
    posicoes.setXYZ(
      i,
      ponto.x * (1 + ponto.y * torto * 2.6) + onda + ruido,
      ponto.y + Math.sin(ponto.x * 4 - ponto.z * 5 + fase) * torto * 0.8 + ruido,
      ponto.z * (1 - ponto.x * torto * 2.2) + onda * 0.6 + ruido,
    )
  }
  forma.computeVertexNormals()
  return forma
}
