import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import Menu from './Menu'
import { SemQuebrar } from './Protegido3D'
import { escolherNivel, useNivel } from '../qualidade'
import logo from '../assets/logo-simbolo.png'

export default function Layout() {
  const { pathname } = useLocation()
  const nivel = useNivel()

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
              <img src={logo} alt="" width={38} height={38} />
              Poke Lab
            </Link>
            <Menu />
          </div>
        </header>
      )}
      <main>
        <SemQuebrar
          key={pathname}
          reserva={
            <section className="conteudo texto centro">
              <h1>Algo deu errado nesta página</h1>
              <button type="button" className="botao" onClick={() => window.location.reload()}>
                Recarregar
              </button>
            </section>
          }
        >
          <Outlet />
        </SemQuebrar>
      </main>
      <footer>
        <p>Poke Lab é um restaurante fictício, criado como projeto de portfólio.</p>
        <button
          type="button"
          className="modo-leve"
          aria-pressed={nivel === 'leve'}
          onClick={() => escolherNivel(nivel === 'leve' ? 'alta' : 'leve')}
        >
          Modo leve do 3D: <strong>{nivel === 'leve' ? 'ligado' : 'desligado'}</strong>
        </button>
      </footer>
    </>
  )
}
