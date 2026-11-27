import { MeshPhysicalMaterial, type Side } from 'three'

// Plástico fino: quase invisível de frente e mais visível nas curvas e nos reflexos.
export function criarPlastico(lado: Side, opacidade: number) {
  const material = new MeshPhysicalMaterial({
    color: '#dcebf0',
    roughness: 0.06,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.5,
    transparent: true,
    opacity: opacidade,
    depthWrite: false,
    side: lado,
  })
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `#include <opaque_fragment>
      float inclinado = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 2.4);
      float reflexo = smoothstep(0.45, 1.3, dot(outgoingLight, vec3(0.333)));
      gl_FragColor.a = clamp(diffuseColor.a + inclinado * 0.38 + reflexo * 0.45, 0.0, 0.9);`,
    )
  }
  return material
}
