import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importação para o redirecionamento
import "./style.css";

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState({});
  const navigate = useNavigate(); // Instância do useNavigate

  const handleBlurEmail = () => {
    if (!email) {
      setErros({ ...erros, email: 'Preencha o campo de e-mail' });
    } else {
      setErros({ ...erros, email: '' });
    }
  };

  const handleBlurSenha = () => {
    if (!senha) {
      setErros({ ...erros, senha: 'Preencha o campo de senha' });
    } else {
      setErros({ ...erros, senha: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificando se os campos estão preenchidos
    if (!email || !senha) {
        setErros({ geral: 'Por favor, preencha todos os campos.' });
        return;
    }

    // Enviando a requisição para o backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                senha,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            // Armazenando o token no localStorage após login bem-sucedido
            localStorage.setItem('authToken', data.token); // Armazena o token
            // Navegando para a página inicial
            navigate('/');
        } else {
            // Se falhar, exibe a mensagem de erro
            setErros({ geral: data.mensagem });
        }
    } catch (error) {
        console.error('Erro de rede:', error);
        setErros({ geral: 'Erro de conexão com o servidor' });
    }
};


  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="content-form">
          <label htmlFor="email">E-mail:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleBlurEmail}
          />
          {erros.email && <span className="mensagem-erro">{erros.email}</span>}
        </div>
        <div className="content-form">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onBlur={handleBlurSenha}
          />
          {erros.senha && <span className="mensagem-erro">{erros.senha}</span>}
        </div>
        <div className="button-submit">
          <button type="submit" className="botao-login">Entrar</button>
        </div>
        <div className="links">
          <a href="#" className="link-esqueceu-senha">Esqueceu a senha?</a>
          <p className="link-cadastrar">Não tem conta? <a href="/cadastro">Cadastre-se</a></p>
        </div>
        {erros.geral && <span className="mensagem-erro-cadastro">{erros.geral}</span>}
      </form>
    </div>
  );
}

export default Login;
