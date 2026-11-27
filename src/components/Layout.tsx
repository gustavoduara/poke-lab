import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { useCarrinho } from '../estado/carrinho'

export default function Layout() {
  const { pathname } = useLocation()
  const { itens } = useCarrinho()
  const unidades = itens.reduce((soma, item) => soma + item.quantidade, 0)

  // Ao trocar de página, volta para o topo.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <header className="cabecalho">
        <Link to="/" className="logo">
          Poke Lab
        </Link>
        <nav aria-label="Principal">
          <NavLink to="/cardapio">Cardápio</NavLink>
          <NavLink to="/montar">Monte seu poke</NavLink>
          <NavLink to="/sobre">Sobre</NavLink>
          <NavLink to="/carrinho">Carrinho ({unidades})</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>Poke Lab é um restaurante fictício, criado como projeto de portfólio.</footer>
    </>
  )
}
