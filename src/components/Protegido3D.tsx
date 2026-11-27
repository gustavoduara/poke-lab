import { Component, useCallback, useEffect, useState, type ReactNode } from 'react'
import { AvisoDeFalha } from './falha3d'
import { suporta3D } from '../qualidade'

type PropsCerca = { reserva: ReactNode; aoQuebrar?: () => void; children: ReactNode }

// Impede que um erro em um pedaço da página derrube o site inteiro.
export class SemQuebrar extends Component<PropsCerca, { quebrou: boolean }> {
  state = { quebrou: false }

  static getDerivedStateFromError() {
    return { quebrou: true }
  }

  componentDidCatch() {
    this.props.aoQuebrar?.()
  }

  render() {
    return this.state.quebrou ? this.props.reserva : this.props.children
  }
}

type Props = {
  children: ReactNode
  reserva: ReactNode // o que aparece quando o 3D não funciona
  aoMudar?: (semTresD: boolean) => void
}

export default function Protegido3D({ children, reserva, aoMudar }: Props) {
  const [falhou, setFalhou] = useState(false)
  const [tentativa, setTentativa] = useState(0)
  const semTresD = falhou || !suporta3D()

  useEffect(() => {
    aoMudar?.(semTresD)
  }, [semTresD, aoMudar])

  const falhar = useCallback(() => setFalhou(true), [])

  if (semTresD) {
    return (
      <div className="reserva-3d">
        {reserva}
        <p>O 3D não abriu neste aparelho, mas você pode pedir normalmente.</p>
        {suporta3D() && (
          <button
            type="button"
            onClick={() => {
              setFalhou(false)
              setTentativa((atual) => atual + 1)
            }}
          >
            Tentar de novo
          </button>
        )}
      </div>
    )
  }

  return (
    <SemQuebrar key={tentativa} reserva={null} aoQuebrar={falhar}>
      <AvisoDeFalha.Provider value={falhar}>{children}</AvisoDeFalha.Provider>
    </SemQuebrar>
  )
}
