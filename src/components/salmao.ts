import { CanvasTexture, SRGBColorSpace } from 'three'
import { criarCuboIrregular, manchar, pintarFundo, pontilhar, riscar } from './formas'
import { criarSorteio } from './terreno'

const LADO = 256

// Textura desenhada por código: carne alaranjada, veios de gordura e leve granulado.
function desenharTextura() {
  const tela = document.createElement('canvas')
  tela.width = tela.height = LADO
  const ctx = tela.getContext('2d')!
  const sortear = criarSorteio(2024)

  pintarFundo(ctx, LADO, '#f47c43')

  // Manchas suaves: a carne nunca tem uma cor só.
  manchar(ctx, LADO, sortear, 46, ['255,150,92', '226,88,38', '255,178,128'], 0.5)

  // Fibras: muitos riscos finos e quase transparentes.
  riscar(ctx, LADO, sortear, 900, ['rgba(255,196,150,0.22)', 'rgba(196,74,28,0.18)'], 16, -0.34)

  // Veios de gordura: faixas paralelas, irregulares e com bordas suaves.
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (let inicio = -40; inicio < LADO + 130; inicio += 24 + sortear() * 26) {
    const largura = 1.6 + sortear() * 4.6
    const curva = 18 + sortear() * 20
    const forca = 0.55 + sortear() * 0.45
    // O mesmo caminho tremido é usado nas três camadas do veio.
    const caminho = Array.from({ length: 15 }, (_, k) => {
      const t = k / 14
      return [
        inicio - 78 * t + Math.sin(t * Math.PI) * curva + (sortear() - 0.5) * 5,
        -10 + t * (LADO + 20),
      ]
    })
    const camadas: [number, string][] = [
      [largura * 2.8, `rgba(255,184,140,${0.28 * forca})`],
      [largura, `rgba(255,218,192,${0.72 * forca})`],
      [largura * 0.34, `rgba(255,243,232,${0.9 * forca})`],
    ]
    for (const [espessura, cor] of camadas) {
      ctx.strokeStyle = cor
      ctx.lineWidth = espessura
      ctx.beginPath()
      caminho.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      ctx.stroke()
    }
  }

  // Granulado fino, que também vira pequenas irregularidades no relevo.
  pontilhar(ctx, LADO, sortear, 2600, ['rgba(255,214,180,0.2)', 'rgba(160,56,18,0.14)'])

  const textura = new CanvasTexture(tela)
  textura.colorSpace = SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

export const texturaSalmao = desenharTextura()
export const cuboSalmao = criarCuboIrregular(0.15, 0.045, 0, 0.012)
