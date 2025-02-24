-- Ativar suporte a FOREIGN KEYS no SQLite
PRAGMA foreign_keys = ON;

-- Removendo tabelas existentes para evitar erros
DROP TABLE IF EXISTS medico;
DROP TABLE IF EXISTS paciente;
DROP TABLE IF EXISTS farmaceutico;
DROP TABLE IF EXISTS medicamento;
DROP TABLE IF EXISTS estoque;
DROP TABLE IF EXISTS prescricao_on_hold;
DROP TABLE IF EXISTS prescricao_aceita;
DROP TABLE IF EXISTS prescricao_medicamento;
DROP TABLE IF EXISTS saidas;
DROP TABLE IF EXISTS perdas;

-- ---
-- Tabela 'medico'
-- ---
CREATE TABLE medico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  crm TEXT UNIQUE NOT NULL
);

-- ---
-- Tabela 'paciente'
-- ---
CREATE TABLE paciente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hc TEXT UNIQUE NOT NULL, 
  nome TEXT NOT NULL,
  leito TEXT NOT NULL
);

-- ---
-- Tabela 'farmaceutico'
-- ---
CREATE TABLE farmaceutico (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);

-- ---
-- Tabela 'medicamento'
-- ---
CREATE TABLE medicamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  dosagem TEXT NOT NULL,
  peso REAL NOT NULL
);

-- ---
-- Tabela 'estoque'
-- ---
CREATE TABLE estoque (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_medicamento INTEGER NOT NULL,
  lote TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  validade TEXT NOT NULL,  -- TEXT (YYYY-MM-DD)
  bin INTEGER NOT NULL,
  fornecedor TEXT NOT NULL,
  FOREIGN KEY (id_medicamento) REFERENCES medicamento(id) ON DELETE CASCADE
);

-- ---
-- Tabela 'prescricao_on_hold' (Prescrição inicial do médico)
-- ---
CREATE TABLE prescricao_on_hold (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_medico INTEGER NOT NULL,
  id_paciente INTEGER NOT NULL,
  data_prescricao TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (id_medico) REFERENCES medico(id) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
);

-- ---
-- Tabela 'prescricao_aceita' (Validação do farmacêutico)
-- ---
CREATE TABLE prescricao_aceita (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_prescricao_on_hold INTEGER NOT NULL,  -- Relaciona diretamente com a prescrição inicial
  id_farmaceutico INTEGER NOT NULL,
  data_validacao TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (id_prescricao_on_hold) REFERENCES prescricao_on_hold(id) ON DELETE CASCADE,
  FOREIGN KEY (id_farmaceutico) REFERENCES farmaceutico(id) ON DELETE CASCADE
);

-- ---
-- Tabela 'prescricao_medicamento' (Medicamentos de cada prescrição)
-- ---
CREATE TABLE prescricao_medicamento (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_prescricao_on_hold INTEGER NOT NULL,
  id_prescricao_aceita INTEGER,  -- Opcional (caso seja aceita/modificada)
  id_medicamento INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  status_medicamento TEXT NOT NULL,  -- SQLite não suporta CHECK ENUM, validação deve ser na aplicação
  FOREIGN KEY (id_prescricao_on_hold) REFERENCES prescricao_on_hold(id) ON DELETE CASCADE,
  FOREIGN KEY (id_prescricao_aceita) REFERENCES prescricao_aceita(id) ON DELETE SET NULL,
  FOREIGN KEY (id_medicamento) REFERENCES medicamento(id) ON DELETE CASCADE
);

-- ---
-- Tabela 'saidas' (Saída de Medicamentos para Pacientes)
-- ---
CREATE TABLE saidas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estoque INTEGER NOT NULL,
  id_paciente INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  data_saida TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (id_estoque) REFERENCES estoque(id) ON DELETE CASCADE,
  FOREIGN KEY (id_paciente) REFERENCES paciente(id) ON DELETE CASCADE
);

-- ---
-- Tabela 'perdas' (Registro de Medicamentos Perdidos ou Descartados)
-- ---
CREATE TABLE perdas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_estoque INTEGER NOT NULL,
  motivo TEXT NOT NULL,
  data_perda TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (id_estoque) REFERENCES estoque(id) ON DELETE CASCADE
);

