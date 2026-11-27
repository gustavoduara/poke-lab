import { BufferGeometry, ConeGeometry, Quaternion, TubeGeometry, Vector3, Curve } from 'three'
import { criarCuboIrregular, criarTextura, pintarFundo, riscar } from './formas'

// Atum cru: vermelho profundo com as linhas suaves do músculo.
export const texturaAtum = criarTextura(311, (ctx, lado, sortear) => {
  pintarFundo(ctx, lado, '#a81f38')
  riscar(ctx, lado, sortear, 800, ['rgba(214,70,86,0.28)', 'rgba(105,10,28,0.28)'], 18, 0.2)
  ctx.strokeStyle = 'rgba(232,130,138,0.4)'
  for (let y = -30; y < lado + 30; y += 36 + sortear() * 20) {
    ctx.lineWidth = 2 + sortear() * 2
    ctx.beginPath()
    ctx.moveTo(-10, y)
    ctx.bezierCurveTo(lado * 0.3, y - 26, lado * 0.7, y + 6, lado + 10, y - 22)
    ctx.stroke()
  }
})
export const cuboAtum = criarCuboIrregular(0.14, 0.035, 2)

// Tofu: creme, fosco, com pequenos furos.
export const texturaTofu = criarTextura(523, (ctx, lado, sortear) => {
  pintarFundo(ctx, lado, '#f3ecd2')
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = i % 2 ? 'rgba(255,253,240,0.5)' : 'rgba(205,190,145,0.22)'
    ctx.beginPath()
    ctx.arc(sortear() * lado, sortear() * lado, 1 + sortear() * 3, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(150,128,82,0.55)'
  for (let i = 0; i < 14; i++) {
    ctx.beginPath()
    ctx.ellipse(sortear() * lado, sortear() * lado, 2 + sortear() * 5, 1.5 + sortear() * 3, sortear() * 3, 0, Math.PI * 2)
    ctx.fill()
  }
})
export const cuboTofu = criarCuboIrregular(0.07, 0.022, 4)

// Camarão cozido: listras laranja sobre a carne clara.
// Na textura, a largura acompanha o corpo, da cabeça até a cauda.
export const texturaCamarao = criarTextura(877, (ctx, lado, sortear) => {
  pintarFundo(ctx, lado, '#ffcdb0')
  const gomos = 6
  for (let i = 0; i < gomos; i++) {
    const x = (i * lado) / gomos
    const faixa = ctx.createLinearGradient(x, 0, x + lado / gomos, 0)
    faixa.addColorStop(0, 'rgba(255,224,204,0.6)')
    faixa.addColorStop(0.35, 'rgba(255,170,120,0.55)')
    faixa.addColorStop(0.85, 'rgba(238,98,38,0.85)')
    faixa.addColorStop(1, 'rgba(255,224,204,0.6)')
    ctx.fillStyle = faixa
    ctx.fillRect(x, 0, lado / gomos, lado)
  }
  riscar(ctx, lado, sortear, 220, ['rgba(232,90,30,0.4)', 'rgba(255,250,244,0.35)'], 6, 1.6)
})

const ABERTURA = Math.PI * 1.25
const GROSSURA = 0.66

class Arco extends Curve<Vector3> {
  constructor() {
    super()
  }

  getPoint(t: number, destino = new Vector3()) {
    return destino.set(Math.cos(t * ABERTURA), 0, Math.sin(t * ABERTURA))
  }
}

// Corpo curvo que afina na direção da cauda e tem os gomos marcados.
function criarCorpo(): BufferGeometry {
  const passos = 60
  const lados = 14
  const curva = new Arco()
  const forma = new TubeGeometry(curva, passos, GROSSURA, lados, false)
  const posicoes = forma.attributes.position
  const ponto = new Vector3()
  for (let i = 0; i <= passos; i++) {
    const t = i / passos
    const centro = curva.getPointAt(t)
    const ponta = Math.sqrt(Math.min(1, t / 0.07)) // fecha a frente arredondada
    const gomo = 1 + 0.045 * Math.sin(t * Math.PI * 12)
    const fator = (1 - 0.68 * t) * ponta * gomo
    for (let j = 0; j <= lados; j++) {
      const indice = i * (lados + 1) + j
      ponto.fromBufferAttribute(posicoes, indice).sub(centro).multiplyScalar(fator).add(centro)
      posicoes.setXYZ(indice, ponto.x, ponto.y, ponto.z)
    }
  }
  forma.computeVertexNormals()
  return forma
}

// Metade do leque da cauda, aberto para um dos lados.
function criarCauda(desvio: number): BufferGeometry {
  const fim = new Vector3(Math.cos(ABERTURA), 0, Math.sin(ABERTURA))
  const direcao = new Vector3(-Math.sin(ABERTURA), 0, Math.cos(ABERTURA))
    .applyAxisAngle(new Vector3(0, 1, 0), desvio)
  const comprimento = 0.55
  const giro = new Quaternion().setFromUnitVectors(
    new Vector3(0, 1, 0),
    direcao.clone().negate(),
  )
  const centro = fim.addScaledVector(direcao, comprimento / 2 - 0.06)
  return new ConeGeometry(0.26, comprimento, 10)
    .scale(1, 1, 0.45)
    .applyQuaternion(giro)
    .translate(centro.x, centro.y, centro.z)
}

export const corpoCamarao = criarCorpo()
export const caudasCamarao = [criarCauda(0.45), criarCauda(-0.45)]
