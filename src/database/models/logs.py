from sqlalchemy import Column, Integer, String, DateTime, Text, func, CheckConstraint
from datetime import datetime
from db_conexao import Base, engine

class Logs(Base):
    __tablename__ = "logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, server_default=func.now(), nullable=False)
    level = Column(String(20), CheckConstraint("level IN ('INFO', 'WARNING', 'ERROR', 'DEBUG')"), nullable=False)
    origin = Column(String(100), nullable=False)
    action = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(20), CheckConstraint("status IN ('SUCCESS', 'FAILED', 'PENDING')"), nullable=False, default="SUCCESS")
    log_data = Column(Text)

    __table_args__ = (
        CheckConstraint("level IN ('INFO', 'WARNING', 'ERROR', 'DEBUG')"),
        CheckConstraint("status IN ('SUCCESS', 'FAILED', 'PENDING')"),
    )

    def __repr__(self):
        return f"<Log [{self.level}] {self.timestamp} | {self.origin} | {self.action} | {self.status}>"
