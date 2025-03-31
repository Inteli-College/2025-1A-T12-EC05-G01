from .db_conexao import engine, Base

from ..backend.models.saida import Saidas
from ..backend.models.logs import Logs
from ..backend.models.prescricao_medicamento import PrescricaoMedicamento
from ..backend.models.prescricao_aceita import PrescricaoAceita
from ..backend.models.prescricao_on_hold import PrescricaoOnHold
from ..backend.models.paciente import Paciente
from ..backend.models.medico import Medico
from ..backend.models.medicamento import Medicamento
from ..backend.models.farmaceuticos import Farmaceutico
from ..backend.models.estoque import Estoque
from ..backend.models.perdas import Perdas

# Create tables in the SQLite database
def initialize_database():
    Base.metadata.create_all(bind=engine)
    print("SQLite database initialized successfully!")

if __name__ == "__main__":
    initialize_database()
