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

// Cubo levemente torto, para não parecer um dado de plástico.
export function criarCuboIrregular(arredondado: number, torto: number, fase = 0) {
  const forma = new RoundedBoxGeometry(1, 1, 1, 4, arredondado)
  const posicoes = forma.attributes.position
  const ponto = new Vector3()
  for (let i = 0; i < posicoes.count; i++) {
    ponto.fromBufferAttribute(posicoes, i)
    // A deformação depende só da posição, então as faces continuam unidas.
    const onda = Math.sin(ponto.y * 5 + ponto.z * 3 + fase) * torto
    posicoes.setXYZ(
      i,
      ponto.x * (1 + ponto.y * torto * 2.6) + onda,
      ponto.y + Math.sin(ponto.x * 4 - ponto.z * 5 + fase) * torto * 0.8,
      ponto.z * (1 - ponto.x * torto * 2.2) + onda * 0.6,
    )
  }
  forma.computeVertexNormals()
  return forma
}
