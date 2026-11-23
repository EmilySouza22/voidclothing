import { Link, NavLink } from "react-router-dom";
import "../styles/Header.css";

// Se o usuário já está logado, o ícone de conta leva para "Minha conta".
function getContaLink() {
  try {
    return localStorage.getItem("token") ? "/minha-conta" : "/login";
  } catch {
    return "/login";
  }
}

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header__logo" aria-label="Void Clothing, página inicial">
        <img src="/assets/img/logo/logo-void-black.png" alt="Void Clothing" />
      </Link>

      <nav className="header__nav" aria-label="Principal">
        <NavLink to="/" end>Início</NavLink>
        <NavLink to="/catalogo">Produtos</NavLink>
        <NavLink to="/catalogo">Coleções</NavLink>
        <NavLink to="/catalogo">Sobre</NavLink>
      </nav>

      <div className="header__actions">
        <button type="button" className="header__icon" aria-label="Buscar produtos">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </button>

        <Link to={getContaLink()} className="header__icon" aria-label="Minha conta">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        </Link>

        <Link to="/carrinho" className="header__icon" aria-label="Carrinho">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 8h14l-1 12H6L5 8z" />
            <path d="M9 8V6a3 3 0 016 0v2" />
          </svg>
        </Link>
      </div>
    </header>
  );
}