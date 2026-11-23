import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CHAVE_TOKEN, CHAVE_USUARIO } from '../api/api';

const AuthContext = createContext(null);

function lerToken() {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch (erro) {
    return null;
  }
}

function lerUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO));
  } catch (erro) {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(lerToken);
  const [usuario, setUsuario] = useState(lerUsuario);

  const login = useCallback((novoToken, novoUsuario) => {
    localStorage.setItem(CHAVE_TOKEN, novoToken);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(novoUsuario));
    setToken(novoToken);
    setUsuario(novoUsuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
    setToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(() => {
    const estaLogado = Boolean(token && usuario);
    const ehEquipe = estaLogado && ['admin', 'funcionario'].includes(usuario.perfil);
    return { token, usuario, estaLogado, ehEquipe, login, logout };
  }, [token, usuario, login, logout]);

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
