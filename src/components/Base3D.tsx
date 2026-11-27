import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, DoubleSide, InstancedMesh, Object3D, Vector2 } from 'three'
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
    itens.forEach((item, i) => {
      malha.setMatrixAt(i, item.matriz)
      malha.setColorAt(i, item.cor)
    })
    malha.instanceMatrix.needsUpdate = true
    if (malha.instanceColor) malha.instanceColor.needsUpdate = true
  }, [itens])

  return (
    <group>
      <mesh>
        <latheGeometry args={[perfilMonte, 64]} />
        <meshStandardMaterial color={fundo} roughness={0.9} side={DoubleSide} />
      </mesh>
      <instancedMesh ref={ref} args={[undefined, undefined, quantidade]}>
        <sphereGeometry args={[1, 10, 8]} />
        <meshStandardMaterial roughness={ehFolha ? 0.65 : 0.55} />
      </instancedMesh>
    </group>
  )
}
