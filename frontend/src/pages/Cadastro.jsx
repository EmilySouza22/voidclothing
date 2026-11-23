import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/cadastro.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CampoSenha({ id, name, label, placeholder, value, onChange, erro }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="cadastro__field">
      <label htmlFor={id}>{label}</label>
      <div className="cadastro__password">
        <input
          id={id}
          name={name}
          type={mostrar ? "text" : "password"}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={Boolean(erro)}
          aria-describedby={erro ? `${id}-erro` : undefined}
        />
        <button
          type="button"
          className="cadastro__toggle"
          onClick={() => setMostrar((v) => !v)}
          aria-label={mostrar ? "Ocultar senha" : "Mostrar senha"}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
            {!mostrar && <path d="M4 4l16 16" />}
          </svg>
        </button>
      </div>
      {erro && (
        <span id={`${id}-erro`} className="cadastro__error">
          {erro}
        </span>
      )}
    </div>
  );
}

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmar: "",
    aceito: false,
  });
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((atual) => ({ ...atual, [name]: type === "checkbox" ? checked : value }));
    // limpa o erro do campo assim que a pessoa volta a digitar
    setErros((atual) => ({ ...atual, [name]: "" }));
    setErroApi("");
  }

  // Mesmas regras do back-end (o back é quem vale; aqui é só aviso rápido)
  function validar() {
    const novos = {};

    if (form.nome.trim().length < 3) {
      novos.nome = "Informe seu nome completo.";
    }

    if (!form.email.trim()) {
      novos.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      novos.email = "Digite um e-mail válido, como nome@email.com.";
    }

    if (form.senha.length < 8) {
      novos.senha = "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (form.confirmar !== form.senha) {
      novos.confirmar = "As senhas não são iguais.";
    }

    if (!form.aceito) {
      novos.aceito = "Você precisa aceitar para criar a conta.";
    }

    return novos;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroApi("");

    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return; // dado inválido: pede correção

    setCarregando(true);
    try {
      const { data } = await axios.post("/api/auth/cadastro", {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        aceitouTermos: form.aceito,
      });

      // Conta criada: já entra logado (mesmo padrão do Login.jsx)
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      navigate("/", { replace: true });
    } catch (err) {
      if (!err.response) {
        setErroApi("Não foi possível conectar ao servidor. Tente de novo em instantes.");
      } else if (err.response.status === 409) {
        setErros({ email: err.response.data.erro });
      } else {
        setErroApi(err.response.data?.erro || "Não foi possível criar a conta.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro">
      <section className="cadastro__hero" aria-hidden="true">
        <div className="cadastro__hero-text">
          <h2>
            Crie sua
            <br />
            conta na
            <br />
            VOID.
          </h2>
          <p>Fique por dentro das novidades, lançamentos e ofertas exclusivas.</p>
          <span className="cadastro__hero-line" />
        </div>
      </section>

      <section className="cadastro__panel">
        <form className="cadastro__form" onSubmit={handleSubmit} noValidate>
          <img
            className="cadastro__star"
            src="/assets/img/logo/star-white.png"
            alt=""
            width="36"
            height="36"
          />
          <h1>Cadastro</h1>
          <p className="cadastro__subtitle">
            Crie sua conta e tenha uma experiência completa na VOID.
          </p>

          {erroApi && (
            <p className="cadastro__alert" role="alert">
              {erroApi}
            </p>
          )}

          <div className="cadastro__field">
            <label htmlFor="nome">Nome completo *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Digite seu nome completo"
              value={form.nome}
              onChange={handleChange}
              aria-invalid={Boolean(erros.nome)}
              aria-describedby={erros.nome ? "nome-erro" : undefined}
            />
            {erros.nome && (
              <span id="nome-erro" className="cadastro__error">
                {erros.nome}
              </span>
            )}
          </div>

          <div className="cadastro__field">
            <label htmlFor="email">E-mail *</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Digite seu e-mail"
              value={form.email}
              onChange={handleChange}
              aria-invalid={Boolean(erros.email)}
              aria-describedby={erros.email ? "email-erro" : undefined}
            />
            {erros.email && (
              <span id="email-erro" className="cadastro__error">
                {erros.email}
              </span>
            )}
          </div>

          <div className="cadastro__row">
            <CampoSenha
              id="senha"
              name="senha"
              label="Senha *"
              placeholder="Digite sua senha"
              value={form.senha}
              onChange={handleChange}
              erro={erros.senha}
            />
            <CampoSenha
              id="confirmar"
              name="confirmar"
              label="Confirmar senha *"
              placeholder="Confirme sua senha"
              value={form.confirmar}
              onChange={handleChange}
              erro={erros.confirmar}
            />
          </div>

          <label className="cadastro__check">
            <input
              type="checkbox"
              name="aceito"
              checked={form.aceito}
              onChange={handleChange}
            />
            <span>
              Eu concordo com os <Link to="/termos">Termos de Uso</Link> e a{" "}
              <Link to="/privacidade">Política de Privacidade</Link> da VOID.
            </span>
          </label>
          {erros.aceito && (
            <span className="cadastro__error cadastro__check-erro">{erros.aceito}</span>
          )}

          <button
            type="submit"
            className="cadastro__btn cadastro__btn--primary"
            disabled={carregando}
          >
            {carregando ? "Criando..." : "Criar minha conta →"}
          </button>

          <div className="cadastro__divider">
            <span>ou continue com</span>
          </div>

          {/* Google e Apple não estão nos requisitos do cliente; ficam desativados até serem implementados */}
          <div className="cadastro__social">
            <button
              type="button"
              className="cadastro__btn cadastro__btn--outline"
              disabled
              title="Em breve"
            >
              Cadastrar com Google
            </button>
            <button
              type="button"
              className="cadastro__btn cadastro__btn--outline"
              disabled
              title="Em breve"
            >
              Cadastrar com Apple
            </button>
          </div>

          <p className="cadastro__signup">
            Já tem uma conta? <Link to="/login">Fazer login</Link>
          </p>
        </form>
      </section>
    </div>
  );
}