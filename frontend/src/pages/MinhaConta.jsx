import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/minhaconta.css";

// Ícones em SVG (traço simples, no mesmo estilo do resto do site)
const ICONES = {
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  box: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </>
  ),
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  card: (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <path d="M1 10h22" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </>
  ),
  truck: (
    <>
      <path d="M1 3h15v13H1z" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  x: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </>
  ),
  seta: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </>
  ),
};

function Icone({ nome, tamanho = 18 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONES[nome]}
    </svg>
  );
}

// Status do banco -> texto e visual da tela
const STATUS = {
  aguardando_pagamento: { texto: "Aguardando pagamento", tipo: "pendente", icone: "clock" },
  pago: { texto: "Processando", tipo: "processando", icone: "clock" },
  em_separacao: { texto: "Processando", tipo: "processando", icone: "clock" },
  enviado: { texto: "Em trânsito", tipo: "transito", icone: "truck" },
  entregue: { texto: "Entregue", tipo: "entregue", icone: "check" },
  cancelado: { texto: "Cancelado", tipo: "cancelado", icone: "x" },
};

const FILTROS = [
  { valor: "todos", texto: "Todos os pedidos" },
  { valor: "pendente", texto: "Aguardando pagamento" },
  { valor: "processando", texto: "Processando" },
  { valor: "transito", texto: "Em trânsito" },
  { valor: "entregue", texto: "Entregues" },
  { valor: "cancelado", texto: "Cancelados" },
];

const MENU = [
  { nome: "Meu Perfil", icone: "user", ativo: true },
  { nome: "Meus Pedidos", icone: "box", to: "/meus-pedidos" },
  { nome: "Meus Favoritos", icone: "heart", emBreve: true },
  { nome: "Endereços", icone: "pin", emBreve: true },
  { nome: "Formas de Pagamento", icone: "card", emBreve: true },
];

const moeda = (valor) =>
  Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso) => new Date(iso).toLocaleDateString("pt-BR");

export default function MinhaConta() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, logout } = useAuth();

  const [usuario, setUsuario] = useState(null);
  const [resumo, setResumo] = useState(null);
  const [filtro, setFiltro] = useState("todos");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);

  // O logout do contexto limpa o localStorage (com as chaves certas)
  // e avisa o site inteiro (cabeçalho, RotaPrivada etc.).
  function encerrarSessao() {
    logout();
  }

  useEffect(() => {
    // Sem login: manda para o login e volta para cá depois
    if (!token) {
      navigate("/login", { replace: true, state: { from: { pathname: location.pathname } } });
      return;
    }

    let cancelado = false;

    async function carregar() {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [resUsuario, resResumo] = await Promise.all([
          axios.get("/api/auth/me", config),
          axios.get("/api/clientes/me/resumo", config),
        ]);
        if (cancelado) return;
        setUsuario(resUsuario.data);
        setResumo(resResumo.data);
        setErro("");
      } catch (err) {
        if (cancelado) return;
        if (err.response?.status === 401) {
          // Sessão expirada ou inválida
          encerrarSessao();
          navigate("/login", { replace: true, state: { from: { pathname: location.pathname } } });
          return;
        }
        setErro(
          !err.response
            ? "Não foi possível conectar ao servidor. Tente de novo em instantes."
            : err.response.data?.erro || "Não foi possível carregar sua conta."
        );
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate, location.pathname, tentativa]);

  function tentarDeNovo() {
    setErro("");
    setCarregando(true);
    setTentativa((t) => t + 1);
  }

  function sair() {
    encerrarSessao();
    navigate("/login", { replace: true });
  }

  if (carregando) {
    return (
      <main className="conta">
        <p className="conta__aviso">Carregando sua conta...</p>
      </main>
    );
  }

  if (erro || !usuario || !resumo) {
    return (
      <main className="conta">
        <div className="conta__aviso" role="alert">
          <p>{erro || "Não foi possível carregar sua conta."}</p>
          <button type="button" className="conta__botao" onClick={tentarDeNovo}>
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  const nome = usuario.nome || "";
  const primeiroNome = nome.split(" ")[0];
  const pedidos = resumo.pedidos ?? [];
  const pedidosFiltrados = pedidos.filter(
    (p) => filtro === "todos" || STATUS[p.status]?.tipo === filtro
  );

  return (
    <main className="conta">
      <header className="conta__topo">
        <div>
          <h1>Olá, {primeiroNome}!</h1>
          <p>Gerencie seus dados, pedidos e preferências por aqui.</p>
        </div>
        <button type="button" className="conta__botao" onClick={sair}>
          Sair da conta <Icone nome="seta" tamanho={16} />
        </button>
      </header>

      <div className="conta__corpo">
        <nav className="conta__menu" aria-label="Menu da conta">
          {MENU.map((item) => {
            const conteudo = (
              <>
                <Icone nome={item.icone} />
                {item.nome}
              </>
            );
            if (item.ativo) {
              return (
                <span key={item.nome} className="conta__menu-item conta__menu-item--ativo" aria-current="page">
                  {conteudo}
                </span>
              );
            }
            if (item.to) {
              return (
                <Link key={item.nome} to={item.to} className="conta__menu-item">
                  {conteudo}
                </Link>
              );
            }
            return (
              <span
                key={item.nome}
                className="conta__menu-item conta__menu-item--off"
                title="Em breve"
                aria-disabled="true"
              >
                {conteudo}
              </span>
            );
          })}
        </nav>

        <div className="conta__conteudo">
          <section className="conta__perfil">
            <div className="conta__avatar">
              <Icone nome="user" tamanho={56} />
            </div>

            <div>
              <h2 className="conta__nome">{nome}</h2>
              <p className="conta__email">{usuario.email}</p>
              {/* Edição de perfil fica para a próxima parte */}
              <button type="button" className="conta__editar" disabled title="Em breve">
                Editar perfil
              </button>
            </div>

            <div className="conta__stat">
              <strong>{resumo.totalPedidos ?? pedidos.length}</strong>
              <span>Pedidos realizados</span>
            </div>

            <div className="conta__stat">
              <Icone nome="pin" />
              <strong>{resumo.totalEnderecos ?? 0}</strong>
              <span>Endereços salvos</span>
            </div>
          </section>

          <section className="conta__pedidos">
            <div className="conta__pedidos-topo">
              <h2>Meus pedidos</h2>
              <select
                className="conta__filtro"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                aria-label="Filtrar pedidos por status"
              >
                {FILTROS.map((f) => (
                  <option key={f.valor} value={f.valor}>
                    {f.texto}
                  </option>
                ))}
              </select>
            </div>

            {pedidos.length === 0 ? (
              <div className="conta__aviso">
                <p>Você ainda não fez nenhum pedido.</p>
                <Link to="/catalogo">Ver produtos</Link>
              </div>
            ) : pedidosFiltrados.length === 0 ? (
              <p className="conta__aviso">Nenhum pedido com esse status.</p>
            ) : (
              <ul className="conta__lista">
                {pedidosFiltrados.map((p) => {
                  const st = STATUS[p.status] || { texto: p.status, tipo: "pendente", icone: "clock" };
                  return (
                    <li key={p.id} className="conta__pedido">
                      <div className="conta__pedido-img">
                        {p.imagem_url && (
                          <img
                            src={p.imagem_url}
                            alt=""
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      <div className="conta__pedido-info">
                        <strong>Pedido #{p.id}</strong>
                        <span>
                          Realizado em {dataBR(p.criado_em)} • {moeda(p.total)}
                        </span>
                      </div>

                      <span className={`conta__status conta__status--${st.tipo}`}>
                        <Icone nome={st.icone} tamanho={16} />
                        {st.texto}
                      </span>

                      <Link className="conta__detalhes" to={`/meus-pedidos/${p.id}`}>
                        Ver detalhes <Icone nome="seta" tamanho={16} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}