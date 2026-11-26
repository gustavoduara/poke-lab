import Montador from './components/Montador'

export default function App() {
  return (
    <>
      <header className="topo">
        <p className="marca">Poke Lab</p>
        <h1>Monte seu poke do seu jeito</h1>
        <p>Escolha cada ingrediente e veja seu bowl ganhar forma.</p>
        <a href="#montar">Começar</a>
      </header>
      <main>
        <Montador />
      </main>
      <footer>Poke Lab · projeto de portfólio</footer>
    </>
  )
}
