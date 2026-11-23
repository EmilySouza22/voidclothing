import axios from 'axios';

export const CHAVE_TOKEN = 'voidclothing_token';
export const CHAVE_USUARIO = 'voidclothing_usuario';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    const status = erro.response && erro.response.status;
    const ehLogin = erro.config && erro.config.url && erro.config.url.includes('/auth/login');

    if (status === 401 && !ehLogin) {
      localStorage.removeItem(CHAVE_TOKEN);
      localStorage.removeItem(CHAVE_USUARIO);
      window.location.href = '/login';
    }
    return Promise.reject(erro);
  }
);

export function mensagemErro(erro) {
  if (erro.response && erro.response.data && erro.response.data.erro) {
    return erro.response.data.erro;
  }
  return 'Não foi possível conectar ao servidor';
}

export default api;
