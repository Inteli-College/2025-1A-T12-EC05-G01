import '../../styles/navbar.css'

const Sidebar = () => {

  return (
    <div>
      <div className='sidebar'>
      <div className='sidebar-buttons'>
      <a href='/dashboard'><button>Dashboard</button></a>
        <a href='/estoque'><button>Checagem de estoque</button></a>
        <a href='/prescricoes'><button>Prescrições</button></a>
        <a href='/montagens'><button>Montagens realizadas</button></a>
        <a href='/verificacao'><button>Verificação dos medicamentos</button></a>
      </div>
      </div> 
    </div>
  )
}

export default Sidebar
