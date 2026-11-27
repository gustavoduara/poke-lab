import { PlaneGeometry, SphereGeometry } from 'three'
import { criarTextura, pintarFundo } from './formas'

// Grão de arroz: uma esfera que depois é alongada.
export const grao = new SphereGeometry(1, 8, 6)

// Folha com a borda ondulada e o meio levemente curvado.
function criarFolha() {
  const forma = new PlaneGeometry(1, 1, 24, 10).rotateX(-Math.PI / 2)
  const posicoes = forma.attributes.position
  for (let i = 0; i < posicoes.count; i++) {
    const x = posicoes.getX(i) // comprimento, de -0.5 a 0.5
    const lado = posicoes.getZ(i) * 2 // largura, de -1 a 1
    const u = x + 0.5
    const contorno = Math.sin(Math.PI * Math.min(0.98, Math.max(0.02, u))) ** 0.65
    const babado = 1 + 0.13 * Math.sin(u * 34) * Math.abs(lado)
    posicoes.setXYZ(
      i,
      x,
      0.2 * lado ** 2 * contorno + 0.05 * Math.sin(u * 17 + lado * 3) * Math.abs(lado),
      lado * 0.34 * contorno * babado,
    )
  }
  forma.computeVertexNormals()
  return forma
}

export const folha = criarFolha()

// Nervuras claras. A textura é quase branca para a cor de cada folha aparecer.
export const texturaFolha = criarTextura(1973, (ctx, lado) => {
  pintarFundo(ctx, lado, '#d6d6d6')
  ctx.strokeStyle = '#ffffff'
  ctx.lineCap = 'round'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(0, lado / 2)
  ctx.lineTo(lado * 0.94, lado / 2)
  ctx.stroke()
  ctx.lineWidth = 2.5
  for (let x = 24; x < lado * 0.85; x += 30) {
    for (const sentido of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(x, lado / 2)
      ctx.quadraticCurveTo(x + 22, lado / 2 + sentido * 45, x + 52, lado / 2 + sentido * 100)
      ctx.stroke()
    }
  }
})
