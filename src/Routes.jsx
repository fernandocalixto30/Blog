import {Routes, Route} from 'react-router-dom'

import Home from './pages/home/home';
import Login from './pages/Login/front/Login.jsx';
import Cadastro from './pages/cadastro/front/';
import Perfil from './pages/Perfil/Perfil';

export const Router = () => {
  return (
<Routes>
    <Route path='/' Component={Home}/>
    <Route path='/perfil' Component={Perfil}/>
    <Route path='/login' Component={Login}/>
    <Route path='/cadastro' Component={Cadastro}/>
</Routes>
  )
}

 