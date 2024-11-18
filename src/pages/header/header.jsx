import './style.css';
import { Link } from 'react-router-dom';

// Função para verificar se o token de autenticação existe
const isAuthenticated = () => {
    // Verifica se o token está presente no localStorage
    const token = localStorage.getItem('authToken');
    return !!token; // Retorna true se o token existir, caso contrário, false
};

export const Header = () => {
    return (
        <header>
            <div className="Menu">
                <h1>Blog</h1>
            </div>

            <div className="group">
                <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
                    <g>
                        <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                    </g>
                </svg>
                <input type="search" placeholder="Search" className="input" />
            </div>

            <div className="perfil">
                {isAuthenticated() ? (
                    // Se o token existir, exibe a foto do perfil
                    <a href="/perfil"><img src="https://github.com/fernandocalixto30.png" alt="User Profile" />
                        </a>
                ) : (
                    // Caso contrário, exibe o link para login
                    <Link to="/login" className="login">Login</Link>
                )}
            </div>
        </header>
    );
};

