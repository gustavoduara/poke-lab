import { NavLink } from 'react-router'
import { useCarrinho } from '../estado/carrinho'

// Navegação usada na capa e no cabeçalho das outras páginas.
export default function Menu() {
  const { itens } = useCarrinho()
  const unidades = itens.reduce((soma, item) => soma + item.quantidade, 0)

  return (
    <nav aria-label="Principal">
      <NavLink to="/cardapio">Cardápio</NavLink>
      <NavLink to="/montar">Monte seu poke</NavLink>
      <NavLink to="/sobre">Sobre</NavLink>
      <NavLink to="/carrinho" className="carrinho" aria-label={`Carrinho com ${unidades} itens`}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.2L21 7.5H6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="19.5" r="1.6" fill="currentColor" />
          <circle cx="17" cy="19.5" r="1.6" fill="currentColor" />
        </svg>
        <span>{unidades}</span>
      </NavLink>
    </nav>
  )
}
