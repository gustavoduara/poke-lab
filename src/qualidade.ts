import { useSyncExternalStore } from 'react'

// Escolhe entre o 3D completo ('alta') e o modo leve, para aparelhos mais fracos.
export type Nivel = 'alta' | 'leve'

const CHAVE = 'pokelab:qualidade'
const CHAVE_LENTO = 'pokelab:lento'

// Opções de teste no endereço, como ?qualidade=leve, ?fps ou ?sem3d
export const parametro = (nome: string) =>
  new RegExp(`[?&]${nome}(?:=([^&#]*))?(?=[&#]|$)`).exec(window.location.href)

const ehNivel = (valor: unknown): valor is Nivel => valor === 'alta' || valor === 'leve'

function ler(armazem: () => Storage, chave: string) {
  try {
    return armazem().getItem(chave)
  } catch {
    return null
  }
}

function gravar(armazem: () => Storage, chave: string, valor: string) {
  try {
    armazem().setItem(chave, valor)
  } catch {
    // sem armazenamento, a escolha vale só até recarregar
  }
}

// Sinais de um aparelho modesto. Nem todo navegador informa todos eles.
function aparelhoModesto() {
  const aparelho = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  return (
    (aparelho.deviceMemory ?? 8) <= 4 ||
    (aparelho.hardwareConcurrency ?? 8) <= 4 ||
    aparelho.connection?.saveData === true
  )
}

const doEndereco = parametro('qualidade')?.[1]
const salvo = ler(() => localStorage, CHAVE)
let escolha: Nivel | null = ehNivel(doEndereco) ? doEndereco : ehNivel(salvo) ? salvo : null
let ficouLento = ler(() => sessionStorage, CHAVE_LENTO) === 'sim'
const modesto = aparelhoModesto()

const nivelAtual = (): Nivel => escolha ?? (ficouLento || modesto ? 'leve' : 'alta')

const ouvintes = new Set<() => void>()
const avisar = () => ouvintes.forEach((ouvinte) => ouvinte())

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte)
  return () => {
    ouvintes.delete(ouvinte)
  }
}

export const useNivel = () => useSyncExternalStore(assinar, nivelAtual)

// Escolha feita pela pessoa: vale mais que a detecção automática.
export function escolherNivel(nivel: Nivel) {
  escolha = nivel
  gravar(() => localStorage, CHAVE, nivel)
  avisar()
}

// Chamado quando a animação fica lenta. Só muda algo se a pessoa não tiver escolhido.
export function registrarLentidao() {
  if (escolha || ficouLento) return
  ficouLento = true
  gravar(() => sessionStorage, CHAVE_LENTO, 'sim')
  avisar()
}

let suporte: boolean | undefined

// O 3D precisa de WebGL 2.
export function suporta3D() {
  if (suporte === undefined) {
    try {
      const contexto = document.createElement('canvas').getContext('webgl2')
      suporte = !!contexto && !parametro('sem3d')
      // libera o contexto de teste, porque os celulares permitem poucos ao mesmo tempo
      contexto?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      suporte = false
    }
  }
  return suporte
}
