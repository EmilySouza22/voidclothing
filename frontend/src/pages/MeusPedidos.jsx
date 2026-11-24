import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/meus-pedidos.css";

// Status do banco -> texto e visual
const STATUS = {
  aguardando_pagamento: { texto: "Aguardando pagamento", tipo: "pendente" },
  pago: { texto: "Pago", tipo: "pago" },
  em_separacao: { texto: "Separando", tipo: "separando" },
  enviado: { texto: "Em trânsito", tipo: "transito" },
  entregue: { texto: "Entregue", tipo: "entregue" },
  cancelado: { texto: "Cancelado", tipo: "cancelado" },
};

const moeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "");

export default function MeusPedidos() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await axios.get("/api/clientes/me/resumo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelado) setPedidos(data.pedidos ?? []);
      } catch (err) {
        if (cancelado) return;
        if (err.response?.status === 401) {
          logout();
          navigate("/login", { replace: true, state: { from: { pathname: "/meus-pedidos" } } });
          return;
        }
        if (!err.response) setErro("Não foi possível conectar ao servidor. Tente de novo em instantes.");
        else setErro(err.response.data?.erro || "Não foi possível carregar seus pedidos.");
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
    // logout fora de propósito: mudar a referência dele não deve refazer a requisição
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tentativa]);

  const visiveis = filtro === "todos" ? pedidos : pedidos.filter((p) => p.status === filtro);

  let conteudo;
  if (carregando) {
    conteudo = <p className="pedidos__aviso">Carregando pedidos...</p>;
  } else if (erro) {
    conteudo = (
      <div className="pedidos__aviso pedidos__aviso--erro" role="alert">
        <p>{erro}</p>
        <button type="button" className="pedidos__botao" onClick={() => setTentativa((t) => t + 1)}>
          Tentar novamente
        </button>
      </div>
    );
  } else if (pedidos.length === 0) {
    conteudo = (
      <div className="pedidos__aviso">
        <p>Você ainda não fez nenhum pedido.</p>
        <Link to="/catalogo" className="pedidos__botao">
          Ver produtos
        </Link>
      </div>
    );
  } else if (visiveis.length === 0) {
    conteudo = <p className="pedidos__aviso">Nenhum pedido com esse status.</p>;
  } else {
    conteudo = (
      <ul className="pedidos__lista">
        {visiveis.map((p) => {
          const st = STATUS[p.status] || { texto: p.status, tipo: "pago" };
          return (
            <li key={p.id} className="pedidos__item">
              <span className="pedidos__foto">
                {p.imagem_url && (
                  <img
                    src={p.imagem_url}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
              </span>

              <div className="pedidos__info">
                <strong>Pedido #{p.id}</strong>
                <span>
                  Realizado em {dataBR(p.criado_em)} • {moeda(p.total)}
                </span>
              </div>

              <span className={`pedidos__status pedidos__status--${st.tipo}`}>{st.texto}</span>

              <Link to={`/meus-pedidos/${p.id}`} className="pedidos__detalhes">
                Ver detalhes
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <main className="pedidos">
      <div className="pedidos__miolo">
        <header className="pedidos__topo">
          <h1>Meus pedidos</h1>
          <select
            className="pedidos__filtro"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Filtrar pedidos por status"
          >
            <option value="todos">Todos os pedidos</option>
            {Object.entries(STATUS).map(([valor, { texto }]) => (
              <option key={valor} value={valor}>
                {texto}
              </option>
            ))}
          </select>
        </header>

        {conteudo}
      </div>
    </main>
  );
}