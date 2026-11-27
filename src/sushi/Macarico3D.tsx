import type { Ref } from 'react'
import { AdditiveBlending, Group, PointLight } from 'three'

type Props = {
  ref: Ref<Group>
  chama: Ref<Group>
  luz: Ref<PointLight>
}

// Maçarico culinário. A ponta do bico fica na origem e a chama desce a partir dela.
export default function Macarico3D({ ref, chama, luz }: Props) {
  return (
    <group ref={ref} visible={false}>
      {/* o corpo é montado ao longo do eixo vertical e depois inclinado */}
      <group rotation-z={-0.72}>
        {/* bico de metal */}
        <mesh position-y={0.17} castShadow>
          <cylinderGeometry args={[0.085, 0.07, 0.34, 24, 1, true]} />
          <meshStandardMaterial color="#c9d1d6" metalness={0.9} roughness={0.25} side={2} />
        </mesh>
        <mesh position-y={0.36} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.16, 16]} />
          <meshStandardMaterial color="#8d969c" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* cabeça com o botão e o gatilho */}
        <mesh position-y={0.56} castShadow>
          <boxGeometry args={[0.24, 0.28, 0.2]} />
          <meshStandardMaterial color="#171d21" roughness={0.45} />
        </mesh>
        <mesh position={[-0.17, 0.54, 0]} rotation-z={0.5} castShadow>
          <boxGeometry args={[0.06, 0.22, 0.09]} />
          <meshStandardMaterial color="#e2572b" roughness={0.4} />
        </mesh>
        <mesh position={[0.15, 0.58, 0]} rotation-z={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.08, 20]} />
          <meshStandardMaterial color="#00b4d8" roughness={0.4} />
        </mesh>
        <mesh position-y={0.76}>
          <cylinderGeometry args={[0.09, 0.12, 0.14, 24]} />
          <meshStandardMaterial color="#b8c0c5" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* refil de gás, com a faixa da marca */}
        <mesh position-y={1.28} castShadow>
          <cylinderGeometry args={[0.23, 0.23, 0.9, 32]} />
          <meshPhysicalMaterial color="#0f2942" roughness={0.28} clearcoat={0.8} />
        </mesh>
        <mesh position-y={1.28}>
          <cylinderGeometry args={[0.234, 0.234, 0.2, 32, 1, true]} />
          <meshStandardMaterial color="#00b4d8" roughness={0.45} />
        </mesh>
        <mesh position-y={1.74}>
          <sphereGeometry args={[0.23, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c9d1d6" metalness={0.85} roughness={0.3} />
        </mesh>
      </group>

      {/* chama: núcleo azul perto do bico e ponta alaranjada */}
      <group ref={chama} rotation-z={-0.72}>
        <mesh position-y={-0.27} rotation-x={Math.PI}>
          <coneGeometry args={[0.11, 0.54, 20, 1, true]} />
          <meshBasicMaterial color="#ff8a1f" transparent opacity={0.65} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position-y={-0.18} rotation-x={Math.PI}>
          <coneGeometry args={[0.065, 0.36, 18, 1, true]} />
          <meshBasicMaterial color="#2f8dff" transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position-y={-0.07} rotation-x={Math.PI}>
          <coneGeometry args={[0.032, 0.14, 12, 1, true]} />
          <meshBasicMaterial color="#d8f2ff" transparent opacity={0.95} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
        <pointLight ref={luz} position-y={-0.36} color="#ff8c2e" intensity={0} distance={2.4} />
      </group>
    </group>
  )
}
