import { HashRouter, Navigate, Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Montador from './components/Montador'
import Cardapio from './pages/Cardapio'
import Inicio from './pages/Inicio'
import Sobre from './pages/Sobre'
import Carrinho from './pages/Carrinho'
import Finalizar from './pages/Finalizar'
import Confirmacao from './pages/Confirmacao'
import CarrinhoProvider from './estado/CarrinhoProvider'

// O HashRouter funciona em hospedagens estáticas, como o GitHub Pages.
export default function App() {
  return (
    <CarrinhoProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="cardapio" element={<Cardapio />} />
            <Route path="montar" element={<Montador />} />
            <Route path="sobre" element={<Sobre />} />
            <Route path="carrinho" element={<Carrinho />} />
            <Route path="finalizar" element={<Finalizar />} />
            <Route path="confirmacao" element={<Confirmacao />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </CarrinhoProvider>
  )
}
