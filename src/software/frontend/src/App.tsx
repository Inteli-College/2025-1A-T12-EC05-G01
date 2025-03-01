import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import RecuperarSenha from './pages/RecuperarSenha';
import Dashboard from './pages/Dashboard';
import Verificacao from './pages/Verificacao';
import Prescricoes from './pages/Prescricoes';
import Estoque from './pages/Estoque';
import Montagens from './pages/Montagens';
import './App.css'

function App() {
  return (
    <div className='body'>
    <Router>
      <Routes>
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar_senha" element={<RecuperarSenha />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verificacao" element={<Verificacao />} />
        <Route path="/prescricoes" element={<Prescricoes />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/montagens" element={<Montagens />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
