import { useLayoutEffect, useMemo, useRef } from 'react'
import { Color, InstancedMesh, Matrix4, Object3D, Quaternion, Vector3 } from 'three'
import type { Camada, Receita } from './receitas'
import { useQueda } from './animacao'
import { apoio, centroFatia, criarSorteio } from './terreno'

type Props = { receita: Receita; fatia: number; temBase: boolean }

function CamadaRepetida({ camada, pecas }: { camada: Camada; pecas: Matrix4[] }) {
  const ref = useRef<InstancedMesh>(null)

  const matrizes = useMemo(() => {
    const local = new Matrix4().compose(
      new Vector3(...(camada.posicao ?? [0, 0, 0])),
      new Quaternion(),
      new Vector3(...camada.escala),
    )
    return pecas.map((peca) => new Matrix4().multiplyMatrices(peca, local))
  }, [camada, pecas])

  useLayoutEffect(() => {
    const malha = ref.current
    if (!malha) return
    pecas.forEach((_, i) => malha.setColorAt(i, new Color(camada.cores[i % camada.cores.length])))
    if (malha.instanceColor) malha.instanceColor.needsUpdate = true
  }, [camada, pecas])

  useQueda(ref, matrizes)

  return (
    <instancedMesh
      ref={ref}
      args={[camada.forma, undefined, pecas.length]}
      dispose={null}
      frustumCulled={false}
    >
      <meshPhysicalMaterial
        roughness={camada.brilho ?? 0.6}
        map={camada.textura ?? null}
        clearcoat={camada.molhado ? 0.7 : 0}
        clearcoatRoughness={0.25}
      />
    </instancedMesh>
  )
}

// Um punhado de um ingrediente, amontoado em uma fatia do bowl.
export default function Porcao3D({ receita, fatia, temBase }: Props) {
  const pecas = useMemo(() => {
    const sortear = criarSorteio(101 + fatia * 977)
    const [cx, cz] = centroFatia(fatia)
    return Array.from({ length: receita.quantidade }, (_, i) => {
      // O ângulo áureo distribui os pedaços sem empilhar todos no mesmo ponto.
      const distancia = 0.4 * Math.sqrt((i + 0.5) / receita.quantidade)
      const giro = i * 2.4
      const x = cx + Math.cos(giro) * distancia
      const z = cz + Math.sin(giro) * distancia
      const objeto = new Object3D()
      objeto.position.set(
        x,
        apoio(Math.hypot(x, z), temBase) + receita.altura + (i % 3) * 0.025,
        z,
      )
      objeto.rotation.set(
        (sortear() - 0.5) * receita.inclinacao,
        sortear() * Math.PI * 2,
        (sortear() - 0.5) * receita.inclinacao,
      )
      objeto.scale.setScalar(1.1 + sortear() * 0.25)
      objeto.updateMatrix()
      return objeto.matrix.clone()
    })
  }, [receita, fatia, temBase])

  return (
    <group>
      {receita.camadas.map((camada, i) => (
        <CamadaRepetida key={i} camada={camada} pecas={pecas} />
      ))}
    </group>
  )
}
