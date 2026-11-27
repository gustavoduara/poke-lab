import { useLayoutEffect, useMemo, useRef } from 'react'
import {
  BoxGeometry,
  Color,
  DoubleSide,
  IcosahedronGeometry,
  InstancedMesh,
  Object3D,
  SphereGeometry,
} from 'three'
import { alturaSuperficie, criarSorteio } from './terreno'
import { useQueda } from './animacao'

export type TipoCrocante = 'gergelim' | 'nori' | 'couve'

const estilos = {
  gergelim: {
    forma: new SphereGeometry(1, 8, 6),
    cores: ['#f2e2b6', '#e8d6a8', '#d9bf85', '#3a2e22'],
    escala: [0.042, 0.018, 0.027],
    quantidade: 170,
    aspereza: 0.5,
  },
  nori: {
    forma: new BoxGeometry(1, 1, 1),
    cores: ['#1f3d2b', '#152e20', '#2a4d36'],
    escala: [0.2, 0.012, 0.035],
    quantidade: 75,
    aspereza: 0.4,
  },
  couve: {
    // Poucas faces dão o aspecto irregular e quebradiço.
    forma: new IcosahedronGeometry(1, 0),
    cores: ['#2f5d34', '#3f7a3a', '#244a29'],
    escala: [0.1, 0.035, 0.075],
    quantidade: 55,
    aspereza: 0.85,
  },
}

type Props = { tipo: TipoCrocante; ordem: number; fatias: number[]; temBase: boolean }

// Os crocantes são salpicados por cima de tudo.
export default function Crocante3D({ tipo, ordem, fatias, temBase }: Props) {
  const ref = useRef<InstancedMesh>(null)
  const { forma, cores, escala, quantidade, aspereza } = estilos[tipo]

  const itens = useMemo(() => {
    const sortear = criarSorteio(7001 + ordem * 3571)
    return Array.from({ length: quantidade }, (_, i) => {
      const raio = Math.sqrt(sortear()) * 1.28
      const angulo = sortear() * Math.PI * 2
      const x = Math.cos(angulo) * raio
      const z = Math.sin(angulo) * raio
      const objeto = new Object3D()
      objeto.position.set(
        x,
        alturaSuperficie(x, z, fatias, temBase) + sortear() * 0.04 + ordem * 0.015,
        z,
      )
      objeto.rotation.set(
        (sortear() - 0.5) * 0.8,
        sortear() * Math.PI * 2,
        (sortear() - 0.5) * 0.8,
      )
      objeto.scale.set(escala[0], escala[1], escala[2])
      objeto.updateMatrix()
      return { matriz: objeto.matrix.clone(), cor: new Color(cores[i % cores.length]) }
    })
  }, [ordem, fatias, temBase, quantidade, cores, escala])

  useLayoutEffect(() => {
    const malha = ref.current
    if (!malha) return
    itens.forEach((item, i) => malha.setColorAt(i, item.cor))
    if (malha.instanceColor) malha.instanceColor.needsUpdate = true
  }, [itens])

  const matrizes = useMemo(() => itens.map((item) => item.matriz), [itens])
  useQueda(ref, matrizes, { espalhamento: 0.8 })

  return (
    <instancedMesh ref={ref} args={[forma, undefined, quantidade]} dispose={null} frustumCulled={false}>
      <meshStandardMaterial roughness={aspereza} side={DoubleSide} />
    </instancedMesh>
  )
}
