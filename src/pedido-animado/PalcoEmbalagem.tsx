import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion'
import embalagem from '../assets/embalagem.jpg'

// Todas as medidas abaixo estão em uma grade de 1932 x 1932 sobre a foto.
const FOTO = 1932

// Contornos usados para separar a foto em camadas.
const TAMPA =
  '1368,857 1668,613 1932,758 1932,1055 1568,1268 1366,1138 1366,976 1548,884 1561,873 1546,862'
const FUNDO_DA_TAMPA =
  '1368,855 1668,606 1940,748 1940,1085 1572,1292 1361,1156 1364,976 1548,884 1561,873 1546,862'
const HASHIS =
  '904,1685 932,1668 1466,1418 1524,1418 1562,1424 1838,1289 1872,1297 1888,1318 1887,1346 1682,1448 1714,1456 1682,1480 1030,1779 999,1782 905,1698'
const FUNDO_DOS_HASHIS =
  '893,1683 1462,1404 1838,1274 1884,1288 1904,1320 1900,1358 1712,1450 1732,1462 1692,1496 1032,1800 990,1800 892,1702'

// Abertura do bowl na foto. A parte de baixo fica escondida pelas abas da caixa.
const BOWL = { x: 806, y: 866, rx: 322, ryCima: 180, ryBaixo: 172 }

const abertura = Array.from({ length: 90 }, (_, i) => {
  const angulo = (i / 90) * Math.PI * 2
  const x = BOWL.x + Math.cos(angulo) * BOWL.rx
  const seno = Math.sin(angulo)
  const y = BOWL.y + seno * (seno < 0 ? BOWL.ryCima : BOWL.ryBaixo)
  const aba =
    x < 715 ? 935 + (x - 470) * (193 / 245) - 5 : 1128 - (x - 715) * (262 / 651) - 5
  return `${x.toFixed(1)},${Math.min(y, aba).toFixed(1)}`
}).join(' ')

// A imagem do poke é quadrada, vista de cima na mesma inclinação do bowl da foto.
const LADO_DO_POKE = 706

const firme = { damping: 200 }

export default function PalcoEmbalagem({ pokeImageUrl }: { pokeImageUrl?: string }) {
  const quadro = useCurrentFrame()
  const { fps } = useVideoConfig()

  const entrada = spring({ frame: quadro, fps, config: firme, durationInFrames: 22 })
  const tampa = spring({ frame: quadro - 18, fps, config: firme, durationInFrames: 24 })
  const selo = spring({
    frame: quadro - 33,
    fps,
    config: { damping: 18, stiffness: 190 },
    durationInFrames: 16,
  })
  const limitar = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const
  // Os hashis dão um pequeno ajuste e param.
  const hashisX = interpolate(quadro, [20, 28, 35, 43], [30, -10, 4, 0], limitar)
  const hashisY = interpolate(quadro, [20, 28, 35, 43], [-14, 5, -2, 0], limitar)
  const brilho = interpolate(quadro, [34, 52], [1150, 2150], {
    ...limitar,
    easing: Easing.inOut(Easing.ease),
  })

  const deslocamento = `translate(${-78 * tampa} ${-58 * tampa})`

  return (
    // O enquadramento deixa de fora a borda cortada da tampa quando ela se move.
    <svg width="100%" height="100%" viewBox="20 120 1830 1872">
      <defs>
        <clipPath id="recorte-tampa">
          <polygon points={TAMPA} />
        </clipPath>
        <clipPath id="recorte-hashis">
          <polygon points={HASHIS} />
        </clipPath>
        <clipPath id="recorte-bowl">
          <polygon points={abertura} />
        </clipPath>
        <linearGradient id="faixa-brilho" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="desfoque" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <g transform={`translate(${(1 - entrada) * -900} 0)`} opacity={Math.min(1, entrada * 1.6)}>
        <image href={embalagem} width={FOTO} height={FOTO} />
        {/* Cobre o lugar original das peças que se movem. */}
        <polygon points={FUNDO_DA_TAMPA} fill="#f6f7f6" />
        <polygon points={FUNDO_DOS_HASHIS} fill="#f5f6f5" />

        {pokeImageUrl && (
          <g clipPath="url(#recorte-bowl)">
            <rect width={FOTO} height={FOTO} fill="#ded8cc" />
            <image
              href={pokeImageUrl}
              x={BOWL.x - LADO_DO_POKE / 2}
              y={BOWL.y - LADO_DO_POKE / 2}
              width={LADO_DO_POKE}
              height={LADO_DO_POKE}
            />
            {/* Sombra por dentro da borda, para o poke parecer encaixado. */}
            <polygon points={abertura} fill="none" stroke="#3b2f22" strokeOpacity="0.3" strokeWidth="26" />
            <polygon points={abertura} fill="none" stroke="#e8e0d0" strokeWidth="9" />
          </g>
        )}

        {/* Sombra da tampa, que se afasta conforme ela sobe. */}
        <ellipse
          cx={1620 - 78 * tampa}
          cy={1175}
          rx={230}
          ry={50}
          fill="#000"
          opacity={0.13 * tampa}
          filter="url(#desfoque)"
        />
        <g transform={deslocamento}>
          <image href={embalagem} width={FOTO} height={FOTO} clipPath="url(#recorte-tampa)" />
          <g clipPath="url(#recorte-tampa)">
            <rect
              x={brilho}
              y={450}
              width={190}
              height={1000}
              fill="url(#faixa-brilho)"
              transform={`rotate(18 ${brilho} 950)`}
            />
          </g>
        </g>

        <g transform={`translate(${hashisX} ${hashisY})`}>
          <image href={embalagem} width={FOTO} height={FOTO} clipPath="url(#recorte-hashis)" />
        </g>

        {/* Selo de pedido fechado. */}
        <g
          transform={`translate(1600 410) rotate(-8) scale(${selo})`}
          opacity={Math.min(1, selo * 2)}
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          <circle r={215} fill="#00b4d8" opacity={0.22} filter="url(#desfoque)" />
          <circle r={190} fill="#0f2942" />
          <circle r={165} fill="none" stroke="#00b4d8" strokeWidth={9} strokeDasharray="14 12" />
          <path
            d="M -48 -62 L -14 -28 L 54 -98"
            fill="none"
            stroke="#00b4d8"
            strokeWidth={24}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text y={38} fill="#fff" fontSize={52} fontWeight={800}>
            FÓRMULA
          </text>
          <text y={98} fill="#fff" fontSize={46} fontWeight={800}>
            FINALIZADA
          </text>
        </g>
      </g>
    </svg>
  )
}
