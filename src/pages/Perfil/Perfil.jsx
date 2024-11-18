import { useState, useEffect } from 'react';
import './style.css';

const Perfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState('');
  const [newFoto, setNewFoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Carregar os dados do usuário (nome, e-mail e foto de perfil) quando a página for carregada
    const token = localStorage.getItem('authToken');
    if (!token) {
    
      window.location.href = '/login';
    } else {
      fetch('http://localhost:3000/perfil', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setNome(data.nome);
          setEmail(data.email);
          setFotoPerfil(data.fotoPerfil || 'default-avatar.png');
        })
        .catch(error => {
          console.error('Erro ao carregar dados do perfil', error);
        });
    }
  }, []);

  const handleFileChange = (e) => {
    setNewFoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const token = localStorage.getItem('authToken');
    
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    if (newFoto) {
      formData.append('foto', newFoto);
    }

    try {
      const response = await fetch('http://localhost:3000/perfil/atualizar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Perfil atualizado com sucesso!');
        setFotoPerfil(data.fotoPerfil); // Atualizar foto de perfil após sucesso
      } else {
        setMessage(data.mensagem || 'Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil', error);
      setMessage('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Editar Perfil</h1>
      
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Foto de perfil */}
        <div className="profile-image-container">
          <img 
            src={fotoPerfil} 
            alt="Foto de Perfil" 
            className="profile-image"
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="profile-image-input"
          />
        </div>

        {/* Nome */}
        <div className="form-group">
          <label htmlFor="nome">Nome:</label>
          <input 
            type="text" 
            id="nome" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
            className="form-input" 
          />
        </div>

        {/* E-mail */}
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="form-input" 
          />
        </div>

        {/* Mensagens de sucesso ou erro */}
        {message && <div className="message">{message}</div>}

        {/* Botão de submit */}
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Atualizando...' : 'Atualizar Perfil'}
        </button>
      </form>
    </div>
  );
};

export default Perfil;
