import { createContext, useCallback, useContext } from 'react'
import type { WebGLRenderer } from 'three'

export const AvisoDeFalha = createContext<() => void>(() => {})

// Avisa o plano B se o celular interromper o 3D (falta de memória, por exemplo).
export function useVigiarContexto() {
  const falhar = useContext(AvisoDeFalha)
  return useCallback(
    (gl: WebGLRenderer) => {
      gl.domElement.addEventListener('webglcontextlost', () => {
        // Ao fechar uma cena o contexto também é solto; isso não é uma falha.
        if (gl.domElement.isConnected) falhar()
      })
    },
    [falhar],
  )
}
