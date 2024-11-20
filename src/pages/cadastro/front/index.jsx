import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const validar = {
    email: (value) => {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regexEmail.test(value);
    },
    senha: (value) => {
        return value.length >= 8;
    },
    confirmaSenha: (value, senha) => {
        return value === senha;
    },
};

const Cadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [erros, setErros] = useState({});
    const [sucessoCadastro, setSucessoCadastro] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sucessoCadastro) {
            const timer = setTimeout(() => {
                setSucessoCadastro(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [sucessoCadastro]);

    const handleBlurEmail = () => {
        if (!validar.email(email)) {
            setErros((prevErros) => ({ ...prevErros, email: 'E-mail inválido' }));
        } else {
            setErros((prevErros) => ({ ...prevErros, email: null }));
        }
    };

    const handleBlurSenha = () => {
        if (!validar.senha(senha)) {
            setErros((prevErros) => ({ ...prevErros, senha: 'A senha deve conter no mínimo 8 caracteres' }));
        } else {
            setErros((prevErros) => ({ ...prevErros, senha: null }));
        }
    };

    const handleBlurConfirmaSenha = () => {
        if (!validar.confirmaSenha(confirmaSenha, senha)) {
            setErros((prevErros) => ({ ...prevErros, confirmaSenha: 'Senhas não coincidem' }));
        } else {
            setErros((prevErros) => ({ ...prevErros, confirmaSenha: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const erros = {};
    
        if (!nome) erros.nome = 'O nome é obrigatório';
        if (!validar.email(email)) erros.email = 'E-mail inválido';
        if (!validar.senha(senha)) erros.senha = 'A senha deve conter no mínimo 8 caracteres';
        if (!validar.confirmaSenha(confirmaSenha, senha)) erros.confirmaSenha = 'Senhas não coincidem';
    
        if (Object.keys(erros).length > 0) {
            setErros(erros);
            setSucessoCadastro(false);
            return;
        }
    
        setErros({});
    
        try {
            // Envia os dados de cadastro para o back-end na porta 5000
            const responseCadastro = await fetch('http://localhost:5000/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nome, email, senha }),
            });
    
            // Verifica se o cadastro foi bem-sucedido
            if (!responseCadastro.ok) {
                const text = await responseCadastro.text();  // Pega o corpo da resposta como texto
                console.error('Erro na resposta do cadastro:', text);
                setErros({ geral: 'Erro ao cadastrar usuário' });
                setSucessoCadastro(false);
                return;
            }
    
            // Faz login imediatamente após o cadastro bem-sucedido
            const responseLogin = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });
    
            // Verifica se o login foi bem-sucedido
            if (!responseLogin.ok) {
                const text = await responseLogin.text();
                console.error('Erro na resposta do login:', text);
                setErros({ geral: 'Erro ao realizar login após cadastros' });
                return;
            }
    
            const dataLogin = await responseLogin.json();  // Recebe o JSON com o token
            if (dataLogin.token) {
                // Salva o token no localStorage
                localStorage.setItem('authToken', dataLogin.token);
    
                // Redireciona para a página inicial
                navigate('/perfil');
            } else {
                setErros({ geral: 'Erro ao realizar login após cadastro no token' });
            }
    
        } catch (error) {
            console.error('Erro na conexão com o servidor');
            setErros({ geral: 'Erro ao enviar dados: ' + error.message });
            setSucessoCadastro(false);
        }
    };
    

    return (
        <form id="login-form" onSubmit={handleSubmit}>
            <div className="container">
                <h1>Cadastro</h1>
                <div className="content-form">
                    <label htmlFor="nome">Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        minLength={3}
                        required
                    />
                </div>
                <div className="content-form">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlurEmail}
                        required
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
                        required
                    />
                    {erros.senha && <span className="mensagem-erro">{erros.senha}</span>}
                </div>
                <div className="content-form">
                    <label htmlFor="confirme-senha">Digite sua senha novamente:</label>
                    <input
                        type="password"
                        id="confirme-senha"
                        value={confirmaSenha}
                        onChange={(e) => setConfirmaSenha(e.target.value)}
                        onBlur={handleBlurConfirmaSenha}
                        required
                    />
                    {erros.confirmaSenha && <span className="mensagem-erro">{erros.confirmaSenha}</span>}
                </div>
                <div className="button-submit">
                    <button type="submit">Inscrever-se</button>
                </div>
                {erros.geral && <span className="mensagem-erro-cadastro">{erros.geral}</span>}
                {sucessoCadastro && <span className="mensagem-sucesso">Cadastro realizado com sucesso!</span>}
            </div>
        </form>
    );
};

export default Cadastro;
