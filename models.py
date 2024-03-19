from config import *

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    login = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)

class Sms_history(Base):
    __tablename__ = 'Sms_history'

    id = Column(Integer, primary_key=True)
    user = Column(String(255), nullable=False)
    phone_number = Column(String(255), nullable=False)
    message_text = Column(String(255), nullable=False)
    message_id = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)

