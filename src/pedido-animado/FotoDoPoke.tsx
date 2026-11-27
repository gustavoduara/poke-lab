import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { NeutralToneMapping } from 'three'
import Base3D, { type TipoBase } from '../components/Base3D'
import Crocante3D, { type TipoCrocante } from '../components/Crocante3D'
import Luzes from '../components/Luzes'
import Molho3D, { type TipoMolho } from '../components/Molho3D'
import Porcao3D from '../components/Porcao3D'
import { SemAnimacao } from '../components/animacao'
import { receitas } from '../components/receitas'
import { fatiasComplemento, fatiasProteina } from '../components/terreno'
import type { Selecao } from '../data/pedido'

// Mesma inclinação da abertura do bowl na foto da embalagem (cerca de 32 graus).
const INCLINACAO = Math.asin(172 / 322)
const LADO = 800
const LARGURA_VISTA = 3.4 // unidades da cena que cabem na imagem

// Espera alguns quadros, para tudo estar desenhado, e tira a foto.
function Disparo({ aoFotografar }: { aoFotografar: (imagem: string) => void }) {
  const quadros = useRef(0)
  useFrame(({ gl }) => {
    quadros.current += 1
    if (quadros.current === 8) aoFotografar(gl.domElement.toDataURL('image/png'))
  })
  return null
}

type Props = { selecao: Selecao; aoFotografar: (imagem: string) => void }

// Desenha fora da tela o poke que a pessoa montou, para colocá-lo dentro da caixa.
export default function FotoDoPoke({ selecao, aoFotografar }: Props) {
  const base = selecao.base?.[0] as TipoBase | undefined
  const molho = selecao.molho?.[0] as TipoMolho | undefined
  const porcoes = [
    ...(selecao.proteina ?? []).map((id, i) => ({ id, fatia: fatiasProteina[i] })),
    ...(selecao.complementos ?? []).map((id, i) => ({ id, fatia: fatiasComplemento[i] })),
  ]
  const ocupadas = porcoes.map((porcao) => porcao.fatia)

  return (
    <div className="estudio" aria-hidden="true">
      <Canvas
        orthographic
        shadows="percentage"
        dpr={1}
        camera={{
          position: [0, 0.3 + Math.sin(INCLINACAO) * 8, Math.cos(INCLINACAO) * 8],
          zoom: LADO / LARGURA_VISTA,
        }}
        gl={{ preserveDrawingBuffer: true, toneMapping: NeutralToneMapping }}
        onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      >
        <Luzes sombras />
        <SemAnimacao.Provider value={true}>
          {base && <Base3D tipo={base} />}
          {porcoes.map(({ id, fatia }) => (
            <Porcao3D key={id} receita={receitas[id]} fatia={fatia} temBase={!!base} />
          ))}
          {molho && <Molho3D tipo={molho} fatias={ocupadas} temBase={!!base} />}
          {(selecao.crocante ?? []).map((id, i) => (
            <Crocante3D
              key={id}
              tipo={id as TipoCrocante}
              ordem={i}
              fatias={ocupadas}
              temBase={!!base}
            />
          ))}
        </SemAnimacao.Provider>
        <Disparo aoFotografar={aoFotografar} />
      </Canvas>
    </div>
  )
}
