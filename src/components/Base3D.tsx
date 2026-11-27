import { useCallback, useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, InstancedMesh, Mesh, Object3D, Vector2 } from 'three'
import { useAnimacao, useQueda } from './animacao'
import { folha, grao, texturaFolha } from './bases'
import { RAIO_BASE, alturaBase, criarSorteio } from './terreno'

export type TipoBase = 'gohan' | 'integral' | 'folhas'

const perfilMonte = Array.from({ length: 17 }, (_, i) => {
  const raio = (RAIO_BASE * i) / 16
  return new Vector2(raio, alturaBase(raio))
})

const estilos = {
  gohan: { fundo: '#e6dfcc', cores: ['#fffdf4', '#f4efe2', '#ebe4d0'] },
  integral: { fundo: '#a98658', cores: ['#d8b988', '#c9a876', '#b08a57'] },
  folhas: {
    fundo: '#24451d',
    // Verdes de vários tons e algumas folhas roxas, como em um mix de verdade.
    cores: ['#8fd13f', '#3f8a2c', '#6fb52f', '#5a2a45', '#b5e35a', '#2f6e28', '#7a3a55'],
  },
}

export default function Base3D({ tipo }: { tipo: TipoBase }) {
  const ref = useRef<InstancedMesh>(null)
  const ehFolha = tipo === 'folhas'
  const quantidade = ehFolha ? 120 : 2200
  const { fundo, cores } = estilos[tipo]

  // Calcula posição, giro, tamanho e cor de cada grão ou folha.
  const itens = useMemo(() => {
    const sortear = criarSorteio(42)
    return Array.from({ length: quantidade }, (_, i) => {
      // A raiz quadrada espalha os itens por igual no círculo.
      const raio = Math.sqrt(sortear()) * (RAIO_BASE - (ehFolha ? 0.2 : 0.06))
      const angulo = sortear() * Math.PI * 2
      const objeto = new Object3D()
      const x = Math.cos(angulo) * raio
      const z = Math.sin(angulo) * raio
      // Pequenos montinhos deixam o arroz soltinho em vez de liso.
      const relevo = ehFolha ? 0 : Math.max(0, Math.sin(x * 7.5) * Math.cos(z * 6.5)) * 0.055
      objeto.position.set(x, alturaBase(raio) + relevo + sortear() * (ehFolha ? 0.08 : 0.045), z)
      const inclinacao = ehFolha ? 0.75 : 0.8
      objeto.rotation.set(
        (sortear() - 0.5) * inclinacao,
        sortear() * Math.PI * 2,
        (sortear() - 0.5) * inclinacao,
      )
      const tamanho = 0.8 + sortear() * 0.4
      if (ehFolha) objeto.scale.setScalar(0.48 * tamanho)
      else objeto.scale.set(0.072 * tamanho, 0.03 * tamanho, 0.031 * tamanho)
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
      <instancedMesh
        ref={ref}
        args={[ehFolha ? folha : grao, undefined, quantidade]}
        dispose={null}
        frustumCulled={false}
      >
        <meshPhysicalMaterial
          map={ehFolha ? texturaFolha : null}
          roughness={ehFolha ? 0.6 : 0.45}
          clearcoat={ehFolha ? 0.15 : 0.35}
          side={DoubleSide}
        />
      </instancedMesh>
    </group>
  )
}
