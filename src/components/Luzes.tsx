import { Environment, Lightformer } from '@react-three/drei'

const telaPequena = window.matchMedia('(max-width: 760px)').matches

// A iluminação usada em todas as cenas do poke.
export default function Luzes({ sombras }: { sombras: boolean }) {
  return (
    <>
      {/* Céu claro e chão quente: as partes de baixo ficam um pouco mais escuras. */}
      <hemisphereLight args={['#fdfbff', '#6b5442', 0.65]} />
      {/* Luz principal, a única que projeta sombras entre os ingredientes. */}
      <directionalLight
        position={[2.6, 5.5, 2.2]}
        intensity={2.3}
        color="#fff3e4"
        castShadow={sombras}
        shadow-mapSize={telaPequena ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-2.3}
        shadow-camera-right={2.3}
        shadow-camera-top={2.3}
        shadow-camera-bottom={-2.3}
        shadow-camera-near={2}
        shadow-camera-far={11}
        shadow-bias={-0.0004}
        shadow-normalBias={0.018}
        shadow-radius={3}
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#ffd9c7" />
      {/* Luz de baixo, para o poke continuar visível quando girado ao contrário. */}
      <directionalLight position={[0, -5, 2]} intensity={0.5} />

      {/* Painéis de luz que aparecem refletidos no plástico, como em um estúdio. */}
      <Environment resolution={256} frames={1} environmentIntensity={0.5}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -2]} scale={[7, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-5, 2, 1]} scale={[1, 5, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1.5, 0]} scale={[0.5, 5, 1]} />
        <Lightformer form="ring" intensity={1.2} position={[2, 3, 5]} scale={1.5} />
      </Environment>
    </>
  )
}
