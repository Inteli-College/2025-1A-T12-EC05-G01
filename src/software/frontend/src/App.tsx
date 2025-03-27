import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import RecuperarSenha from './pages/RecuperarSenha';
import Dashboard from './pages/Dashboard';
import Verificacao from './pages/Selagem';
import Prescricoes from './pages/Triagem';
import Estoque from './pages/Estoque';
import Montagens from './pages/Montagens';
import Fita from './pages/Fita';
import Adicionar_prescricao from './pages/Adicionar_prescricao';
import AdicionarBin from './pages/AdicionarBin';

function App() {
  return (
    <div className='body'>
      <Router>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verificacao" element={<Verificacao />} />
          <Route path="/prescricoes" element={<Prescricoes />} />
          <Route path="/estoque" element={<Estoque />} />
          <Route path="/montagens" element={<Montagens />} />
          <Route path="/" element={<Login />} />
          <Route path="/fita" element={<Fita />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
