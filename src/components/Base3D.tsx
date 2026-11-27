import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, InstancedMesh, Mesh, Object3D, Vector2 } from 'three'
import { useAnimacao, useQueda } from './animacao'
import { RAIO_BASE, alturaBase, criarSorteio } from './terreno'

export type TipoBase = 'gohan' | 'integral' | 'folhas'

const perfilMonte = Array.from({ length: 17 }, (_, i) => {
  const raio = (RAIO_BASE * i) / 16
  return new Vector2(raio, alturaBase(raio))
})

const estilos = {
  gohan: { fundo: '#e6dfcc', cores: ['#fffdf4', '#f4efe2', '#ebe4d0'] },
  integral: { fundo: '#a98658', cores: ['#d8b988', '#c9a876', '#b08a57'] },
  folhas: { fundo: '#3f6b2f', cores: ['#8cc152', '#6fa84f', '#4f8a38', '#a8cf6a'] },
}

export default function Base3D({ tipo }: { tipo: TipoBase }) {
  const ref = useRef<InstancedMesh>(null)
  const ehFolha = tipo === 'folhas'
  const quantidade = ehFolha ? 150 : 1100
  const { fundo, cores } = estilos[tipo]

  // Calcula posição, giro, tamanho e cor de cada grão ou folha.
  const itens = useMemo(() => {
    const sortear = criarSorteio(42)
    return Array.from({ length: quantidade }, (_, i) => {
      // A raiz quadrada espalha os itens por igual no círculo.
      const raio = Math.sqrt(sortear()) * (RAIO_BASE - (ehFolha ? 0.2 : 0.06))
      const angulo = sortear() * Math.PI * 2
      const objeto = new Object3D()
      objeto.position.set(
        Math.cos(angulo) * raio,
        alturaBase(raio) + sortear() * (ehFolha ? 0.16 : 0.05),
        Math.sin(angulo) * raio,
      )
      const inclinacao = ehFolha ? 0.9 : 0.5
      objeto.rotation.set(
        (sortear() - 0.5) * inclinacao,
        sortear() * Math.PI * 2,
        (sortear() - 0.5) * inclinacao,
      )
      const tamanho = 0.8 + sortear() * 0.4
      if (ehFolha) objeto.scale.set(0.24 * tamanho, 0.025, 0.15 * tamanho)
      else objeto.scale.set(0.075 * tamanho, 0.035 * tamanho, 0.038 * tamanho)
      objeto.updateMatrix()
      return { matriz: objeto.matrix.clone(), cor: new Color(cores[i % cores.length]) }
    })
  }, [quantidade, ehFolha, cores])

  // Uma única malha repetida desenha todos os itens, o que é leve para o navegador.
  useLayoutEffect(() => {
    const malha = ref.current
    if (!malha) return
    itens.forEach((item, i) => malha.setColorAt(i, item.cor))
    if (malha.instanceColor) malha.instanceColor.needsUpdate = true
  }, [itens])

  const matrizes = useMemo(() => itens.map((item) => item.matriz), [itens])
  useQueda(ref, matrizes, { espalhamento: 0.6 })

  const monte = useRef<Mesh>(null)
  const abrirMonte = useCallback((tempo: number) => {
    // Começa depois que os primeiros grãos chegam ao fundo.
    const progresso = Math.min(1, Math.max(0.001, (tempo - 0.4) / 0.6))
    monte.current?.scale.set(progresso, 1, progresso)
    if (monte.current) monte.current.visible = tempo > 0.4
  }, [])
  useAnimacao(1, abrirMonte)

  return (
    <group>
      <mesh ref={monte}>
        <latheGeometry args={[perfilMonte, 64]} />
        <meshStandardMaterial color={fundo} roughness={0.9} side={DoubleSide} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, quantidade]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial roughness={ehFolha ? 0.65 : 0.55} />
      </instancedMesh>
    </group>
  )
}
