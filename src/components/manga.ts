import { criarCuboIrregular, criarTextura, pintarFundo, riscar } from './formas'

// Manga: amarelo vivo, com fibras finas e manchas mais alaranjadas.
export const texturaManga = criarTextura(1409, (ctx, lado, sortear) => {
  pintarFundo(ctx, lado, '#ffb608')
  for (let i = 0; i < 18; i++) {
    const x = sortear() * lado
    const y = sortear() * lado
    const raio = 20 + sortear() * 55
    const mancha = ctx.createRadialGradient(x, y, 0, x, y, raio)
    mancha.addColorStop(0, i % 2 ? 'rgba(255,208,40,0.7)' : 'rgba(245,138,0,0.6)')
    mancha.addColorStop(1, 'rgba(255,182,8,0)')
    ctx.fillStyle = mancha
    ctx.fillRect(x - raio, y - raio, raio * 2, raio * 2)
  }
  riscar(ctx, lado, sortear, 420, ['rgba(255,226,90,0.45)', 'rgba(232,128,0,0.3)'], 34, 0.12)
})

// Dois cortes diferentes, para os pedaços não ficarem todos iguais.
export const cuboManga = criarCuboIrregular(0.08, 0.075, 1)
