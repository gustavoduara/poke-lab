import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { parametro, registrarLentidao, useNivel } from '../qualidade'

const QUADROS_DE_AQUECIMENTO = 30 // o começo é sempre mais lento
const AMOSTRA = 75
const MINIMO_DE_FPS = 24

// Se a animação ficar lenta, passa o site para o modo leve.
function Monitor() {
  const medida = useRef({ quadros: 0, soma: 0 })
  useFrame((_, delta) => {
    // Intervalos muito grandes são pausas (aba escondida), não lentidão.
    if (delta > 0.9) return
    const atual = medida.current
    atual.quadros += 1
    if (atual.quadros <= QUADROS_DE_AQUECIMENTO) return
    atual.soma += delta
    if (atual.quadros < QUADROS_DE_AQUECIMENTO + AMOSTRA) return
    if (AMOSTRA / atual.soma < MINIMO_DE_FPS) registrarLentidao()
    medida.current = { quadros: QUADROS_DE_AQUECIMENTO, soma: 0 }
  })
  return null
}

// Contador opcional para testar em um celular de verdade: acrescente ?fps ao endereço.
function Medidor() {
  const nivel = useNivel()
  const painel = useRef<HTMLDivElement | null>(null)
  const conta = useRef({ quadros: 0, desde: performance.now() })
  const renderizador = useThree((estado) => estado.gl)

  // Um quadro tem várias etapas (sombras, reflexos). Sem zerar sozinho, a conta soma todas.
  useEffect(() => {
    const informacoes = renderizador.info
    informacoes.autoReset = false
    return () => {
      informacoes.autoReset = true
    }
  }, [renderizador])

  useEffect(() => {
    const caixa = document.createElement('div')
    caixa.className = 'medidor-fps'
    caixa.textContent = 'medindo...'
    // dentro de uma janela aberta, o medidor precisa ficar nela para aparecer
    ;(document.querySelector('dialog[open]') ?? document.body).appendChild(caixa)
    painel.current = caixa
    return () => caixa.remove()
  }, [])

  useFrame(({ gl }) => {
    const atual = conta.current
    atual.quadros += 1
    // valores do quadro anterior inteiro
    const { triangles, calls } = gl.info.render
    gl.info.reset()
    const agora = performance.now()
    if (agora - atual.desde < 1000 || !painel.current) return
    const fps = Math.round((atual.quadros * 1000) / (agora - atual.desde))
    painel.current.textContent = `${fps} fps · modo ${nivel} · ${Math.round(triangles / 1000)} mil triângulos · ${calls} desenhos`
    conta.current = { quadros: 0, desde: agora }
  })
  return null
}

export default function Desempenho({ frameloop }: { frameloop: string }) {
  const invalidar = useThree((estado) => estado.invalidate)
  // Retoma o desenho quando o 3D volta a ficar ativo.
  useEffect(() => {
    if (frameloop === 'always') invalidar()
  }, [frameloop, invalidar])

  return (
    <>
      <Monitor />
      {parametro('fps') && <Medidor />}
    </>
  )
}
