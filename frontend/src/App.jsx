import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import RotaPrivada from './components/RotaPrivada';

import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import MeusPedidos from './pages/MeusPedidos';
import MinhaConta from './pages/MinhaConta';
import Exemplo from './pages/Exemplo';
import NotFound from './pages/NotFound';

import AdminPainel from './pages/admin/Painel';
import AdminProdutos from './pages/admin/Produtos';
import AdminCategorias from './pages/admin/Categorias';
import AdminEstoque from './pages/admin/Estoque';
import AdminPedidos from './pages/admin/Pedidos';
import AdminClientes from './pages/admin/Clientes';

const EQUIPE = ['admin', 'funcionario'];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produto/:id" element={<ProdutoDetalhe />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/exemplo" element={<Exemplo />} />

        <Route element={<RotaPrivada />}>
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          <Route path="/minha-conta" element={<MinhaConta />} />
        </Route>

        <Route element={<RotaPrivada perfis={EQUIPE} />}>
          <Route path="/admin" element={<AdminPainel />} />
          <Route path="/admin/produtos" element={<AdminProdutos />} />
          <Route path="/admin/categorias" element={<AdminCategorias />} />
          <Route path="/admin/estoque" element={<AdminEstoque />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          <Route path="/admin/clientes" element={<AdminClientes />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
