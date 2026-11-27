import { Link } from 'react-router'

export default function Sobre() {
  return (
    <section className="conteudo texto">
      <h1>Sobre o Poke Lab</h1>
      <p>
        O poke nasceu no Havaí: peixe cru em cubos, temperado e servido de forma simples.
        As versões em bowl, com arroz e vários acompanhamentos, ganharam o mundo.
      </p>
      <p>
        A ideia do Poke Lab é mostrar o pedido enquanto ele é montado. Em vez de apenas
        marcar opções em uma lista, você vê cada ingrediente chegar ao bowl.
      </p>

      <h2>Este é um projeto de portfólio</h2>
      <p>
        O restaurante, o cardápio e os preços são fictícios. Nenhum pedido é enviado e
        nenhum pagamento é cobrado.
      </p>
      <div className="acoes">
        <Link to="/montar" className="botao">
          Experimentar o montador
        </Link>
      </div>
    </section>
  )
}
