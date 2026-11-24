import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", senha: "" });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [erroApi, setErroApi] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
    // limpa o erro do campo assim que a pessoa volta a digitar
    setErros((atual) => ({ ...atual, [name]: "" }));
    setErroApi("");
  }

  function validar() {
    const novos = {};
    if (!form.email.trim()) {
      novos.email = "Informe seu e-mail.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      novos.email = "Digite um e-mail válido, como nome@email.com.";
    }
    if (!form.senha) {
      novos.senha = "Informe sua senha.";
    }
    return novos;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroApi("");

    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setCarregando(true);
    try {
      // O Vite repassa /api para o backend (http://localhost:3000)
      const { data } = await axios.post("/api/auth/login", {
        email: form.email.trim(),
        senha: form.senha,
      });

      // Grava no localStorage E avisa o contexto (RotaPrivada, cabeçalho etc.)
      login(data.token, data.usuario);

      // volta para a página que a pessoa tentava acessar, se houver
      const origem = location.state?.from?.pathname;
      if (origem) {
        navigate(origem, { replace: true });
      } else if (data.usuario?.perfil === "admin" || data.usuario?.perfil === "funcionario") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (!err.response) {
        setErroApi("Não foi possível conectar ao servidor. Tente de novo em instantes.");
      } else {
        // O back responde { erro: '...' } (e não "mensagem")
        setErroApi(err.response.data?.erro || "Não foi possível entrar. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login">
      <section className="login__hero" aria-hidden="true">
        <div className="login__hero-text">
          <h2>
            Seja parte
            <br />
            da nossa
            <br />
            história.
          </h2>
          <span className="login__hero-line" />
          <p>Vista sua identidade.</p>
        </div>
      </section>

      <section className="login__panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <img
            className="login__star"
            src="/assets/img/logo/star-white.png"
            alt=""
            width="36"
            height="36"
          />
          <h1>Login</h1>
          <p className="login__subtitle">Acesse sua conta para continuar.</p>

          {erroApi && (
            <p className="login__alert" role="alert">
              {erroApi}
            </p>
          )}

          <div className="field">
            <label htmlFor="email">E-mail</label>
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
              <span id="email-erro" className="field__error">
                {erros.email}
              </span>
            )}
          </div>

          <div className="field">
            <label htmlFor="senha">Senha</label>
            <div className="field__password">
              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={handleChange}
                aria-invalid={Boolean(erros.senha)}
                aria-describedby={erros.senha ? "senha-erro" : undefined}
              />
              <button
                type="button"
                className="field__toggle"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                  {!mostrarSenha && <path d="M4 4l16 16" />}
                </svg>
              </button>
            </div>
            {erros.senha && (
              <span id="senha-erro" className="field__error">
                {erros.senha}
              </span>
            )}
          </div>

          <button type="submit" className="login-btn login-btn--primary" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>

          <div className="login__divider">
            <span>ou</span>
          </div>

          {/* Login com Google não está nos requisitos do cliente; fica desativado até ser implementado */}
          <button type="button" className="login-btn login-btn--outline" disabled title="Em breve">
            <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.7 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6.1C12.3 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
              <path fill="#FBBC05" d="M10.4 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C1 16.4 0 20.1 0 24s1 7.6 2.6 10.8l7.8-6.1z" />
              <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.7 2.3-7.7 2.3-6.3 0-11.7-4.1-13.6-9.8l-7.8 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Entrar com Google
          </button>

          <Link to="/recuperar-senha" className="login__link">
            Esqueceu sua senha?
          </Link>

          <p className="login__signup">
            Não tem uma conta? <Link to="/cadastro">Criar conta</Link>
          </p>
        </form>
      </section>
    </div>
  );
}