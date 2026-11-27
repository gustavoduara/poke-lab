import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import Menu from './Menu'

export default function Layout() {
  const { pathname } = useLocation()

  // Ao trocar de página, volta para o topo.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      {/* A página inicial tem o menu dentro da própria capa. */}
      {pathname !== '/' && (
        <header className="topo">
          <div className="cabecalho">
            <Link to="/" className="logo">
              Poke Lab
            </Link>
            <Menu />
          </div>
        </header>
      )}
      <main>
        <Outlet />
      </main>
      <footer>Poke Lab é um restaurante fictício, criado como projeto de portfólio.</footer>
    </>
  )
}
