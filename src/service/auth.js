import api from './api';

export const login = async (email, senha) => {
    try {
        const response = await api.post('/auth/login', { email, senha });
        const { token } = response.data;
        localStorage.setItem('token', token);
        return token;
    } catch (error) {
        throw new Error('Falha na autenticação');
    }
};

export const signUp = async (nome, email, senha, matricula, cargo) => {
    try {
        const response = await api.post('/auth/cadastro', { nome, email, senha, matricula, cargo });
        return response.data;
    } catch (error) {
        throw new Error('Falha na criação de conta');
    }
};

export const logout = (setAuthenticated) => {
    localStorage.removeItem('token');
    setAuthenticated(false);
};