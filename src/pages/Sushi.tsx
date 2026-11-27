import { useState } from 'react'
import { sushis, type SushiProduto } from '../data/sushi'
import CartaoSushi from '../sushi/CartaoSushi'
import VitrineSushi from '../sushi/VitrineSushi'

const grupos = [
  { id: 'combinados', titulo: 'Combinados' },
  { id: 'pecas', titulo: 'Escolha as peças' },
] as const

export default function Sushi() {
  const [aberto, setAberto] = useState<SushiProduto | null>(null)

  return (
    <div className="faixa-central pagina-sushi">
      <h1>Sushi</h1>
      <p className="suave">
        Toque em uma opção para ver as peças em 3D. No combinado maçaricado, a chama passa na
        sua frente.
      </p>

      {grupos.map((grupo) => (
        <section key={grupo.id} className="secao">
          <h2>{grupo.titulo}</h2>
          <ul className="produtos">
            {sushis
              .filter((sushi) => sushi.grupo === grupo.id)
              .map((sushi) => (
                <li key={sushi.id}>
                  <CartaoSushi sushi={sushi} aoAbrir={() => setAberto(sushi)} />
                </li>
              ))}
          </ul>
        </section>
      ))}

      {aberto && <VitrineSushi sushi={aberto} aoFechar={() => setAberto(null)} />}
    </div>
  )
}
