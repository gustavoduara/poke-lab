import { useMemo, type Ref } from 'react'
import { CanvasTexture, DoubleSide, Group, LatheGeometry, Mesh, SRGBColorSpace, Vector2 } from 'three'

const pontos = (lista: [number, number][]) => lista.map(([x, y]) => new Vector2(x, y))

// A bisnaga é desenhada de cabeça para baixo: o bico fica na origem.
const formaTampa = new LatheGeometry(
  pontos([[0, 0], [0.032, 0], [0.05, 0.13], [0.13, 0.15], [0.14, 0.31], [0.1, 0.33]]),
  40,
)
const formaCorpo = new LatheGeometry(
  pontos([
    [0.1, 0.31], [0.12, 0.38], [0.15, 0.48], [0.22, 0.6], [0.31, 0.76],
    [0.355, 0.94], [0.35, 1.12], [0.29, 1.23], [0.12, 1.27], [0, 1.27],
  ]),
  48,
)
const formaRotulo = new LatheGeometry(
  pontos([[0.268, 0.68], [0.318, 0.76], [0.36, 0.9], [0.364, 1.0], [0.358, 1.11]]),
  48,
)

export type EstiloBisnaga = {
  nome: string
  corpo: string
  rotulo: string
  letra: string
}

// Rótulo próprio do Poke Lab, escrito duas vezes para aparecer de qualquer lado.
function criarRotulo({ nome, rotulo, letra }: EstiloBisnaga) {
  const tela = document.createElement('canvas')
  tela.width = 1024
  tela.height = 256
  const ctx = tela.getContext('2d')!
  ctx.fillStyle = rotulo
  ctx.fillRect(0, 0, 1024, 256)
  ctx.fillStyle = '#00b4d8'
  ctx.fillRect(0, 0, 1024, 22)
  ctx.fillRect(0, 234, 1024, 22)
  ctx.textAlign = 'center'
  ctx.fillStyle = letra
  for (const x of [256, 768]) {
    ctx.font = '700 44px system-ui, sans-serif'
    ctx.fillText('POKE LAB', x, 90)
    ctx.font = '900 96px system-ui, sans-serif'
    ctx.fillText(nome, x, 190, 440)
  }
  const textura = new CanvasTexture(tela)
  textura.colorSpace = SRGBColorSpace
  textura.anisotropy = 4
  return textura
}

type Props = {
  estilo: EstiloBisnaga
  ref: Ref<Group>
  filete: Ref<Mesh>
  corMolho: string
}

export default function Bisnaga3D({ estilo, ref, filete, corMolho }: Props) {
  const rotulo = useMemo(() => criarRotulo(estilo), [estilo])

  return (
    <>
      <group ref={ref} visible={false}>
        <mesh geometry={formaTampa} castShadow dispose={null}>
          <meshStandardMaterial color="#14181a" roughness={0.45} side={DoubleSide} />
        </mesh>
        <mesh geometry={formaCorpo} castShadow dispose={null}>
          <meshPhysicalMaterial color={estilo.corpo} roughness={0.18} clearcoat={1} side={DoubleSide} />
        </mesh>
        <mesh geometry={formaRotulo} dispose={null}>
          <meshStandardMaterial map={rotulo} roughness={0.55} side={DoubleSide} />
        </mesh>
      </group>
      {/* O filete que liga o bico ao molho que está caindo. */}
      <mesh ref={filete} visible={false}>
        <cylinderGeometry args={[1, 1, 1, 10]} />
        <meshStandardMaterial color={corMolho} roughness={0.15} />
      </mesh>
    </>
  )
}
