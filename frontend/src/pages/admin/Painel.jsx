import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "../../styles/painel.css";

// Ícones em SVG (traço simples, mesmo estilo do resto do site)
const ICONES = {
  home: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </>
  ),
  tag: (
    <>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" />
    </>
  ),
  bag: (
    <>
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  box: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05" />
      <path d="M12 22.08V12" />
    </>
  ),
  grade: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </>
  ),
  user: (
    <>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
  dolar: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
      <path d="M12 6v1.5M12 16.5V18" />
    </>
  ),
  engrenagem: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </>
  ),
  sair: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  carrinho: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </>
  ),
  grafico: (
    <>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </>
  ),
  seta: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
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

// Só /admin e as telas que já têm rota ficam clicáveis; o resto aparece como "Em breve"
const MENU = [
  { nome: "Painel", icone: "home", to: "/admin", ativo: true },
  { nome: "Produtos", icone: "tag", to: "/admin/produtos" },
  { nome: "Pedidos", icone: "bag", to: "/admin/pedidos" },
  { nome: "Estoque", icone: "box", to: "/admin/estoque" },
  { nome: "Categorias", icone: "grade", to: "/admin/categorias" },
  { nome: "Clientes", icone: "user", to: "/admin/clientes" },
  { nome: "Equipe", icone: "users", emBreve: true },
  { nome: "Fornecedores", icone: "truck", emBreve: true },
  { nome: "Financeiro", icone: "dolar", emBreve: true },
  { nome: "Configurações", icone: "engrenagem", emBreve: true },
];

// Status do banco -> texto e visual da tela
const STATUS = {
  aguardando_pagamento: { texto: "Aguardando", tipo: "pendente" },
  pago: { texto: "Pago", tipo: "pago" },
  em_separacao: { texto: "Separando", tipo: "separando" },
  enviado: { texto: "Em transporte", tipo: "transito" },
  entregue: { texto: "Entregue", tipo: "entregue" },
  cancelado: { texto: "Cancelado", tipo: "cancelado" },
};

const PERIODOS = [
  { valor: 7, texto: "Últimos 7 dias" },
  { valor: 30, texto: "Últimos 30 dias" },
  { valor: 90, texto: "Últimos 90 dias" },
];

const PERFIS = { admin: "Administrador", funcionario: "Funcionário" };

const moeda = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const numero = (valor) => Number(valor || 0).toLocaleString("pt-BR");
const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "");

function Miniatura({ src }) {
  return (
    <span className="painel__miniatura">
      {src && (
        <img
          src={src}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}
    </span>
  );
}

function Variacao({ valor }) {
  if (valor === null || valor === undefined || Number.isNaN(Number(valor))) return null;
  const n = Number(valor);
  const sobe = n >= 0;
  return (
    <span className={`painel__variacao painel__variacao--${sobe ? "sobe" : "desce"}`}>
      {sobe ? "↑ +" : "↓ "}
      {n.toLocaleString("pt-BR")}%
    </span>
  );
}

// ---------- Gráfico de vendas (SVG puro, sem biblioteca) ----------

// Escolhe um passo "redondo" para o eixo Y (1, 2, 2.5, 5, 10 × potência de 10)
function passoBonito(bruto) {
  if (bruto <= 0) return 1000;
  const potencia = 10 ** Math.floor(Math.log10(bruto));
  const fracao = bruto / potencia;
  const f = fracao <= 1 ? 1 : fracao <= 2 ? 2 : fracao <= 2.5 ? 2.5 : fracao <= 5 ? 5 : 10;
  return f * potencia;
}

// Curva suave passando pelos pontos (Catmull-Rom convertida em Bézier)
function caminhoSuave(p, minY, maxY) {
  if (p.length === 0) return "";
  const limita = (v) => Math.min(maxY, Math.max(minY, v));
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] || p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = limita(p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = limita(p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

function GraficoVendas({ dados }) {
  const LARG = 600;
  const ALT = 230;
  const mEsq = 44;
  const mDir = 16;
  const mTopo = 14;
  const mBase = 30;
  const areaL = LARG - mEsq - mDir;
  const areaA = ALT - mTopo - mBase;

  const valores = dados.map((d) => Number(d.total) || 0);
  const max = Math.max(...valores, 0);
  const passo = passoBonito(max / 3);
  const marcas = Math.max(1, Math.ceil(max / passo));
  const topo = passo * marcas;

  const x = (i) => mEsq + (dados.length === 1 ? areaL / 2 : (areaL * i) / (dados.length - 1));
  const y = (v) => mTopo + areaA - (v / topo) * areaA;
  const base = mTopo + areaA;

  const pontos = valores.map((v, i) => [x(i), y(v)]);
  const linha = caminhoSuave(pontos, mTopo, base);
  const area = `${linha} L ${pontos[pontos.length - 1][0]} ${base} L ${pontos[0][0]} ${base} Z`;

  const rotuloY = (v) =>
    passo >= 1000 ? `${String(v / 1000).replace(".", ",")}k` : String(v);

  return (
    <svg
      className="painel__grafico"
      viewBox={`0 0 ${LARG} ${ALT}`}
      role="img"
      aria-label="Gráfico de linha com as vendas por dia nos últimos 7 dias"
    >
      <defs>
        <linearGradient id="painel-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#111" stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: marcas + 1 }, (_, i) => {
        const v = passo * i;
        return (
          <g key={v}>
            <line className="painel__grade" x1={mEsq} x2={LARG - mDir} y1={y(v)} y2={y(v)} />
            <text className="painel__eixo" x={mEsq - 8} y={y(v) + 4} textAnchor="end">
              {rotuloY(v)}
            </text>
          </g>
        );
      })}

      {dados.map((d, i) => (
        <g key={`${d.dia}-${i}`}>
          <line className="painel__grade" x1={x(i)} x2={x(i)} y1={mTopo} y2={base} />
          <text className="painel__eixo" x={x(i)} y={ALT - 8} textAnchor="middle">
            {d.dia}
          </text>
        </g>
      ))}

      <path d={area} fill="url(#painel-grad)" />
      <path className="painel__linha-grafico" d={linha} />

      {pontos.map(([px, py], i) => (
        <circle key={i} className="painel__ponto" cx={px} cy={py} r="4">
          <title>
            {dados[i].dia}: {moeda(valores[i])}
          </title>
        </circle>
      ))}
    </svg>
  );
}

// ---------- Conteúdo do painel ----------

function Visao({ dados, carregando }) {
  const kpis = [
    { rotulo: "Total de vendas", icone: "carrinho", valor: moeda(dados.totalVendas), variacao: dados.variacaoVendas },
    { rotulo: "Pedidos realizados", icone: "box", valor: numero(dados.pedidosRealizados), variacao: dados.variacaoPedidos },
    { rotulo: "Novos clientes", icone: "users", valor: numero(dados.novosClientes), variacao: dados.variacaoClientes },
    { rotulo: "Ticket médio", icone: "grafico", valor: moeda(dados.ticketMedio), variacao: dados.variacaoTicket },
  ];
  const vendas = dados.vendasSemana ?? [];
  const recentes = dados.pedidosRecentes ?? [];
  const estoqueBaixo = dados.estoqueBaixo ?? [];

  return (
    <div className="painel__visao" aria-busy={carregando}>
      <section className="painel__kpis" aria-label="Indicadores da loja">
        {kpis.map((k) => (
          <article key={k.rotulo} className="painel__kpi">
            <div className="painel__kpi-topo">
              <Icone nome={k.icone} tamanho={20} />
              <span>{k.rotulo}</span>
            </div>
            <strong>{k.valor}</strong>
            <Variacao valor={k.variacao} />
          </article>
        ))}
      </section>

      <div className="painel__linha painel__linha--2">
        <section className="painel__cartao">
          <h2>Vendas nos últimos 7 dias</h2>
          {vendas.length === 0 ? (
            <p className="painel__vazio">Ainda não há vendas para mostrar.</p>
          ) : (
            <GraficoVendas dados={vendas} />
          )}
        </section>

        <section className="painel__cartao">
          <div className="painel__cartao-topo">
            <h2>Pedidos recentes</h2>
            <Link to="/admin/pedidos" className="painel__ver-todos">
              Ver todos <Icone nome="seta" tamanho={14} />
            </Link>
          </div>
          {recentes.length === 0 ? (
            <p className="painel__vazio">Nenhum pedido ainda.</p>
          ) : (
            <ul className="painel__lista">
              {recentes.map((p) => {
                const st = STATUS[p.status] || { texto: p.status, tipo: "pago" };
                return (
                  <li key={p.id}>
                    <Link to="/admin/pedidos" className="painel__pedido">
                      <Miniatura src={p.imagem_url} />
                      <strong>#{p.id}</strong>
                      <span className="painel__data">{dataBR(p.criado_em)}</span>
                      <span className={`painel__status painel__status--${st.tipo}`}>{st.texto}</span>
                      <Icone nome="chevron" tamanho={16} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="painel__linha painel__linha--3">
        <section className="painel__cartao">
          <div className="painel__cartao-topo">
            <h2>Estoque em baixa</h2>
            <Link to="/admin/estoque" className="painel__ver-todos">
              Ver todos <Icone nome="seta" tamanho={14} />
            </Link>
          </div>
          {estoqueBaixo.length === 0 ? (
            <p className="painel__vazio">Nenhum produto com estoque baixo.</p>
          ) : (
            <ul className="painel__lista">
              {estoqueBaixo.map((p) => (
                <li key={p.id ?? p.nome} className="painel__estoque">
                  <Miniatura src={p.imagem_url} />
                  <div>
                    <strong>{p.nome}</strong>
                    {p.tamanho && <span>Tamanho {p.tamanho}</span>}
                  </div>
                  <span className="painel__qtd">Estoque: {p.estoque}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="painel__cartao">
          <h2>Ações rápidas</h2>
          <div className="painel__acoes">
            <Link to="/admin/produtos" className="painel__acao">
              <Icone nome="box" />
              <span>Cadastrar produto</span>
              <Icone nome="seta" tamanho={16} />
            </Link>
            <Link to="/admin/pedidos" className="painel__acao">
              <Icone nome="bag" />
              <span>Ver pedidos</span>
              <Icone nome="seta" tamanho={16} />
            </Link>
            <span className="painel__acao painel__acao--off" title="Em breve" aria-disabled="true">
              <Icone nome="grafico" />
              <span>Relatório financeiro</span>
              <Icone nome="seta" tamanho={16} />
            </span>
          </div>
        </section>

        <section className="painel__banner" aria-label="VOID Clothing">
          <div>
            <p className="painel__banner-marca">VOID</p>
            <p className="painel__banner-texto">Mais que roupas, um estilo de vida.</p>
            <Link to="/" className="painel__banner-btn">
              Ver loja <Icone nome="seta" tamanho={14} />
            </Link>
          </div>
          <img
            className="painel__banner-estrela"
            src="/assets/img/logo/star-white.png"
            alt=""
            width="22"
            height="22"
          />
        </section>
      </div>
    </div>
  );
}

// ---------- Página ----------

export default function Painel() {
  const navigate = useNavigate();
  const { token, usuario, logout } = useAuth();

  const [dias, setDias] = useState(30);
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;

    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const { data } = await axios.get("/api/admin/painel", {
          params: { dias },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelado) return;
        setDados(data);
      } catch (err) {
        if (cancelado) return;
        if (err.response?.status === 401) {
          // Sessão expirada ou inválida
          logout();
          navigate("/login", { replace: true, state: { from: { pathname: "/admin" } } });
          return;
        }
        if (!err.response) {
          setErro("Não foi possível conectar ao servidor. Tente de novo em instantes.");
        } else if (err.response.status === 404) {
          setErro("Os dados do painel ainda não estão disponíveis (rota /api/admin/painel não encontrada no back).");
        } else {
          setErro(err.response.data?.erro || "Não foi possível carregar o painel.");
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregar();
    return () => {
      cancelado = true;
    };
    // logout fica de fora de propósito: mudar a referência dele não deve refazer a requisição
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dias, tentativa]);

  function sair() {
    logout();
    navigate("/login", { replace: true });
  }

  const nome = usuario?.nome || "";
  const primeiroNome = nome.split(" ")[0] || "equipe";
  const inicial = (nome.trim()[0] || "V").toUpperCase();

  let conteudo;
  if (erro) {
    conteudo = (
      <div className="painel__aviso" role="alert">
        <p>{erro}</p>
        <button type="button" className="painel__botao" onClick={() => setTentativa((t) => t + 1)}>
          Tentar novamente
        </button>
      </div>
    );
  } else if (!dados) {
    conteudo = <p className="painel__aviso">Carregando painel...</p>;
  } else {
    conteudo = <Visao dados={dados} carregando={carregando} />;
  }

  return (
    <main className="painel">
      <aside className="painel__lateral">
        <div className="painel__usuario">
          <span className="painel__inicial" aria-hidden="true">
            {inicial}
          </span>
          <div>
            <strong>Olá, {primeiroNome}!</strong>
            <span>{PERFIS[usuario?.perfil] || "Equipe"}</span>
          </div>
        </div>

        <nav className="painel__menu" aria-label="Menu do painel administrativo">
          {MENU.map((item) => {
            const conteudoItem = (
              <>
                <Icone nome={item.icone} />
                {item.nome}
              </>
            );
            if (item.ativo) {
              return (
                <span key={item.nome} className="painel__item painel__item--ativo" aria-current="page">
                  {conteudoItem}
                </span>
              );
            }
            if (item.to) {
              return (
                <Link key={item.nome} to={item.to} className="painel__item">
                  {conteudoItem}
                </Link>
              );
            }
            return (
              <span
                key={item.nome}
                className="painel__item painel__item--off"
                title="Em breve"
                aria-disabled="true"
              >
                {conteudoItem}
              </span>
            );
          })}

          <hr className="painel__divisor" />

          <button type="button" className="painel__item painel__item--sair" onClick={sair}>
            <Icone nome="sair" />
            Sair
          </button>
        </nav>
      </aside>

      <div className="painel__conteudo">
        <header className="painel__topo">
          <div>
            <h1>Painel administrativo</h1>
            <p>Visão geral da sua loja, tudo em um só lugar.</p>
          </div>
          <select
            className="painel__filtro"
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            aria-label="Período dos indicadores"
          >
            {PERIODOS.map((p) => (
              <option key={p.valor} value={p.valor}>
                {p.texto}
              </option>
            ))}
          </select>
        </header>

        {conteudo}
      </div>
    </main>
  );
}