import { useEffect, useState } from 'react';
import api, { mensagemErro } from '../api/api';

export default function Exemplo() {
  const [resposta, setResposta] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api
      .get('/health')
      .then((res) => setResposta(res.data))
      .catch((err) => setErro(mensagemErro(err)));
  }, []);

  return (
    <section className="secao">
      <div className="container">
        <h2>Página de exemplo</h2>
        <p className="texto-suave" style={{ marginBottom: 'var(--espaco-8)' }}>
          Use este arquivo como modelo para novas telas e depois apague.
        </p>

        <div className="card" style={{ marginBottom: 'var(--espaco-8)' }}>
          <h3 style={{ marginBottom: 'var(--espaco-3)' }}>Conexão com a API</h3>
          {!resposta && !erro && <div className="alerta alerta--aviso">Consultando...</div>}
          {resposta && (
            <div className="alerta alerta--sucesso">
              API e banco conectados: {JSON.stringify(resposta)}
            </div>
          )}
          {erro && <div className="alerta alerta--erro">Falha: {erro}</div>}
        </div>

        <div className="card" style={{ marginBottom: 'var(--espaco-8)' }}>
          <h3 style={{ marginBottom: 'var(--espaco-4)' }}>Componentes</h3>
          <div style={{ display: 'flex', gap: 'var(--espaco-3)', flexWrap: 'wrap', marginBottom: 'var(--espaco-6)' }}>
            <button className="btn">Botão</button>
            <button className="btn btn--contorno">Contorno</button>
            <button className="btn" disabled>Desabilitado</button>
            <span className="badge">Aguardando</span>
            <span className="badge badge--sucesso">Pago</span>
            <span className="badge badge--erro">Cancelado</span>
          </div>
          <div className="campo">
            <label htmlFor="exemplo-email">E-mail</label>
            <input className="input" type="email" id="exemplo-email" placeholder="voce@email.com" />
          </div>
          <div className="alerta alerta--erro">Mensagem de erro</div>
          <div className="alerta alerta--sucesso">Mensagem de sucesso</div>
        </div>

        <div className="grid">
          <div className="card-produto">
            <div className="card-produto__imagem" />
            <div className="card-produto__corpo">
              <h3 className="card-produto__nome">Camiseta Oversized Void</h3>
              <p className="card-produto__preco">R$ 149,90</p>
            </div>
          </div>
          <div className="card-produto">
            <div className="card-produto__imagem" />
            <div className="card-produto__corpo">
              <h3 className="card-produto__nome">Moletom Hoodie Void</h3>
              <p className="card-produto__preco">
                <span className="card-produto__preco-antigo">R$ 279,90</span>R$ 249,90
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
