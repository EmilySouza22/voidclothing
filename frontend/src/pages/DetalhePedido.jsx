import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/detalhe-pedido.css";

// Status do banco -> texto e visual
const STATUS = {
    aguardando_pagamento: { texto: "Aguardando pagamento", tipo: "pendente" },
    pago: { texto: "Pago", tipo: "pago" },
    em_separacao: { texto: "Separando", tipo: "separando" },
    enviado: { texto: "Em trânsito", tipo: "transito" },
    entregue: { texto: "Entregue", tipo: "entregue" },
    cancelado: { texto: "Cancelado", tipo: "cancelado" },
};

// Etapas do acompanhamento, na ordem em que acontecem
const ETAPAS = [
    { chave: "pago", titulo: "Pagamento aprovado" },
    { chave: "em_separacao", titulo: "Pedido em separação" },
    { chave: "enviado", titulo: "Pedido em trânsito" },
    { chave: "entregue", titulo: "Entregue" },
];

const FORMAS_PAGAMENTO = {
    cartao_credito: "Cartão de crédito",
    cartao_debito: "Cartão de débito",
    pix: "Pix",
    boleto: "Boleto",
};

const moeda = (valor) =>
    Number(valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dataBR = (iso) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "");

function Icone({ children, tamanho = 18 }) {
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
            {children}
        </svg>
    );
}

function Acompanhamento({ status, datas }) {
    if (status === "cancelado") {
        return <p className="detalhe__cancelado">Este pedido foi cancelado.</p>;
    }

    // aguardando_pagamento não está na lista, então nenhuma etapa fica concluída
    const atual = ETAPAS.findIndex((e) => e.chave === status);

    return (
        <ol className="detalhe__etapas">
            {ETAPAS.map((etapa, i) => {
                const feita = i <= atual;
                const data = datas?.[etapa.chave];
                return (
                    <li key={etapa.chave} className={feita ? "detalhe__etapa detalhe__etapa--feita" : "detalhe__etapa"}>
                        <span className="detalhe__bolinha" aria-hidden="true">
                            {feita && (
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12l5 5 9-10" />
                                </svg>
                            )}
                        </span>
                        <div>
                            <strong>{etapa.titulo}</strong>
                            {data && <span>{dataBR(data)}</span>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function textoEndereco(e) {
    if (!e) return null;
    const rua = [e.logradouro || e.rua, e.numero].filter(Boolean).join(", ");
    const linha1 = [rua, e.complemento].filter(Boolean).join(" - ");
    const linha2 = [e.bairro, [e.cidade, e.estado || e.uf].filter(Boolean).join(" / ")].filter(Boolean).join(" - ");
    return {
        nome: e.destinatario || e.nome || "",
        linha1,
        linha2,
        cep: e.cep ? `CEP: ${e.cep}` : "",
    };
}

export default function DetalhePedido() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, logout } = useAuth();

    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        let cancelado = false;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const { data } = await axios.get(`/api/pedidos/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!cancelado) setDados(data);
            } catch (err) {
                if (cancelado) return;
                if (err.response?.status === 401) {
                    logout();
                    navigate("/login", { replace: true, state: { from: { pathname: `/meus-pedidos/${id}` } } });
                    return;
                }
                if (!err.response) setErro("Não foi possível conectar ao servidor. Tente de novo em instantes.");
                else if (err.response.status === 404) setErro("Pedido não encontrado.");
                else setErro(err.response.data?.erro || "Não foi possível carregar o pedido.");
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
    }, [id, token]);

    const voltar = (
        <Link to="/meus-pedidos" className="detalhe__voltar">
            <Icone tamanho={16}>
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
            </Icone>
            Voltar para Meus Pedidos
        </Link>
    );

    if (carregando) {
        return (
            <main className="detalhe">
                <div className="detalhe__miolo">
                    {voltar}
                    <p className="detalhe__aviso">Carregando pedido...</p>
                </div>
            </main>
        );
    }

    if (erro || !dados) {
        return (
            <main className="detalhe">
                <div className="detalhe__miolo">
                    {voltar}
                    <p className="detalhe__aviso detalhe__aviso--erro" role="alert">
                        {erro || "Não foi possível carregar o pedido."}
                    </p>
                </div>
            </main>
        );
    }

    const st = STATUS[dados.status] || { texto: dados.status, tipo: "pago" };
    const itens = dados.itens ?? [];
    const qtdItens = itens.reduce((soma, i) => soma + i.quantidade, 0);
    const endereco = textoEndereco(dados.endereco);
    const pagamento = dados.pagamento;
    const formaTexto = pagamento?.forma ? FORMAS_PAGAMENTO[pagamento.forma] || pagamento.forma : "";

    return (
        <main className="detalhe">
            <div className="detalhe__miolo">
                {voltar}

                <header className="detalhe__topo">
                    <h1>Detalhes do pedido</h1>
                    <p className="detalhe__linha-pedido">
                        <strong>Pedido #{dados.id}</strong>
                        <span className={`detalhe__status detalhe__status--${st.tipo}`}>{st.texto}</span>
                    </p>
                    <p className="detalhe__sub">
                        Realizado em {dataBR(dados.criado_em)} • {moeda(dados.total)}
                    </p>
                </header>

                <div className="detalhe__grade">
                    <div className="detalhe__coluna">
                        <section className="detalhe__cartao">
                            <h2>Produtos do pedido</h2>
                            <ul className="detalhe__itens">
                                {itens.map((item) => (
                                    <li key={item.id} className="detalhe__item">
                                        <span className="detalhe__foto">
                                            {item.imagem_url && (
                                                <img
                                                    src={item.imagem_url}
                                                    alt=""
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />
                                            )}
                                        </span>
                                        <div className="detalhe__item-info">
                                            <strong>{item.nome}</strong>
                                            {item.tamanho && <span>Tamanho {item.tamanho}</span>}
                                        </div>
                                        <span className="detalhe__qtd">Qtd: {item.quantidade}</span>
                                        <strong className="detalhe__preco">{moeda(item.preco * item.quantidade)}</strong>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {(endereco || formaTexto) && (
                            <section className="detalhe__cartao detalhe__info">
                                {endereco && (
                                    <div className="detalhe__bloco">
                                        <h3>
                                            <Icone tamanho={16}>
                                                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </Icone>
                                            Endereço de entrega
                                        </h3>
                                        {endereco.nome && <strong>{endereco.nome}</strong>}
                                        {endereco.linha1 && <p>{endereco.linha1}</p>}
                                        {endereco.linha2 && <p>{endereco.linha2}</p>}
                                        {endereco.cep && <p>{endereco.cep}</p>}
                                    </div>
                                )}

                                {formaTexto && (
                                    <div className="detalhe__bloco">
                                        <h3>
                                            <Icone tamanho={16}>
                                                <rect x="1" y="4" width="22" height="16" rx="2" />
                                                <path d="M1 10h22" />
                                            </Icone>
                                            Forma de pagamento
                                        </h3>
                                        <p>{formaTexto}</p>
                                        {pagamento.final && <p>•••• {pagamento.final}</p>}
                                    </div>
                                )}
                            </section>
                        )}
                    </div>

                    <div className="detalhe__coluna">
                        <section className="detalhe__cartao">
                            <h2>Resumo do pedido</h2>
                            <dl className="detalhe__resumo">
                                <div>
                                    <dt>Subtotal ({qtdItens} {qtdItens === 1 ? "item" : "itens"})</dt>
                                    <dd>{moeda(dados.subtotal)}</dd>
                                </div>
                                <div>
                                    <dt>Frete</dt>
                                    <dd>{dados.frete > 0 ? moeda(dados.frete) : "Grátis"}</dd>
                                </div>
                                {dados.desconto > 0 && (
                                    <div>
                                        <dt>Desconto</dt>
                                        <dd>- {moeda(dados.desconto)}</dd>
                                    </div>
                                )}
                                <div className="detalhe__total">
                                    <dt>Total</dt>
                                    <dd>{moeda(dados.total)}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className="detalhe__cartao">
                            <h2>Acompanhamento do pedido</h2>
                            <Acompanhamento status={dados.status} datas={dados.datas} />
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}