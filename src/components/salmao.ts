import { CanvasTexture, SRGBColorSpace } from 'three'
import { criarCuboIrregular } from './formas'
import { criarSorteio } from './terreno'

const LADO = 256

// Textura desenhada por código: carne alaranjada, veios de gordura e leve granulado.
function desenharTextura() {
  const tela = document.createElement('canvas')
  tela.width = tela.height = LADO
  const ctx = tela.getContext('2d')!
  const sortear = criarSorteio(2024)

  const fundo = ctx.createLinearGradient(0, 0, LADO, LADO)
  fundo.addColorStop(0, '#fb9a5f')
  fundo.addColorStop(0.5, '#f58448')
  fundo.addColorStop(1, '#fa9258')
  ctx.fillStyle = fundo
  ctx.fillRect(0, 0, LADO, LADO)

  // Fibras: muitos riscos finos e quase transparentes.
  for (let i = 0; i < 700; i++) {
    const x = sortear() * LADO
    const y = sortear() * LADO
    ctx.strokeStyle = sortear() > 0.5 ? 'rgba(255,190,140,0.22)' : 'rgba(214,92,40,0.16)'
    ctx.lineWidth = 1 + sortear() * 2
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + 10 + sortear() * 18, y - 3 - sortear() * 7)
    ctx.stroke()
  }

  // Veios de gordura: faixas curvas e paralelas, com bordas suaves.
  ctx.lineCap = 'round'
  for (let inicio = -40; inicio < LADO + 120; inicio += 38 + sortear() * 18) {
    const largura = 3 + sortear() * 4
    const curva = 22 + sortear() * 14
    const camadas: [number, string][] = [
      [largura * 2.4, 'rgba(255,205,170,0.28)'],
      [largura, 'rgba(255,226,204,0.75)'],
      [largura * 0.35, 'rgba(255,244,232,0.85)'],
    ]
    for (const [espessura, cor] of camadas) {
      ctx.strokeStyle = cor
      ctx.lineWidth = espessura
      ctx.beginPath()
      ctx.moveTo(inicio, -10)
      ctx.quadraticCurveTo(inicio - 20 + curva, LADO / 2, inicio - 70, LADO + 10)
      ctx.stroke()
    }
  }

  const textura = new CanvasTexture(tela)
  textura.colorSpace = SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

export const texturaSalmao = desenharTextura()
export const cuboSalmao = criarCuboIrregular(0.16, 0.045)
