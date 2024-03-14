from models import *
from config import *


# Створення таблиць
Base.metadata.create_all(engine)

def user_validy(login, password):
        with Session() as db_session:
            user = db_session.query(User).filter(User.login == login, User.password == password).first()
        
            if user:
                session["login"] = login
                session["password"] = password
                return True
            else:
                return False
    



