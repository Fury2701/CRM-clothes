from config import *

Base = declarative_base()

class User(Base):
    __tablename__ = 'User'

    id = Column(Integer, primary_key=True)
    login = Column(String(255), nullable=False)
    password = Column(String(255), nullable=False)



