import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="secao">
      <div className="container">
        <p className="texto-suave">Streetwear</p>
        <h1>
          Vista sua<br />identidade.
        </h1>
        <p className="texto-suave" style={{ margin: 'var(--espaco-6) 0' }}>
          Página inicial em construção.
        </p>
        <Link to="/catalogo" className="btn">Ver catálogo</Link>
      </div>
    </section>
  );
}
