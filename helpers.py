from models import *
from config import *
import time


# Створення таблиць
Base.metadata.create_all(engine)
Base_second.metadata.create_all(engine_second)


def user_validy(login, password):
        with Session() as db_session:
            user = db_session.query(User).filter(User.login == login, User.password == password).first()
        
            if user:
                session["login"] = login
                session["password"] = password
                return True
            else:
                return False


def update_sms(phone_number, message_text, message_id, status):
    try:
        with Session() as db_session:
            sms = Sms_history(user=session["login"], phone_number=phone_number, message_text=message_text, message_id=message_id, status=status, date=datetime.now())
            db_session.add(sms)
            db_session.commit()
    except Exception as e:
        return "Database error" + str(e)

def update_sms_status(message_id):
    try:
        with Session() as db_session:
            sms = db_session.query(Sms_history).filter(Sms_history.message_id == message_id).first()
            sms.status = "Delivered"
            db_session.commit()
    except Exception as e:
        return "Database error" + str(e)


    



# Функції прослуховання бази даних Events


@event.listens_for(wp_wc_orders, 'after_update')
def after_update_listener_wp_wc_orders(mapper, connection, target):
    pass

@event.listens_for(wp_wc_orders, 'after_insert')
def after_insert_listener_wp_wc_orders(mapper, connection, target):
    pass

@event.listens_for(wp_wc_orders, 'after_delete')
def after_delete_listener_wp_wc_orders(mapper, connection, target):
    pass

