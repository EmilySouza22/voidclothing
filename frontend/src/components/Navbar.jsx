import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const classeLink = ({ isActive }) => (isActive ? 'ativo' : undefined);

export default function Navbar() {
  const { usuario, estaLogado, ehEquipe, logout } = useAuth();
  const navigate = useNavigate();

  function sair() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__marca">
          <img src="/assets/img/logo/logo-void-white.png" alt="Void Clothing" />
        </Link>

        <nav className="navbar__links">
          <NavLink to="/" end className={classeLink}>Início</NavLink>
          <NavLink to="/catalogo" className={classeLink}>Catálogo</NavLink>
          <NavLink to="/carrinho" className={classeLink}>Carrinho</NavLink>
          {estaLogado && <NavLink to="/meus-pedidos" className={classeLink}>Meus pedidos</NavLink>}
          {ehEquipe && <NavLink to="/admin" className={classeLink}>Painel</NavLink>}
        </nav>

        <div className="navbar__acoes">
          {estaLogado ? (
            <>
              <span className="navbar__usuario">{usuario.nome}</span>
              <button type="button" className="btn btn--contorno" onClick={sair}>Sair</button>
            </>
          ) : (
            <Link to="/login" className="btn btn--contorno">Entrar</Link>
          )}
        </div>
      </div>
    </header>
  );
}
