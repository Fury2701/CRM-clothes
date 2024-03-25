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


    

# Функції робот з базою даних WooCommerce

def get_wc_orders(full_name=None, page=1, per_page=20): # Функція для отримання замовлень з WooCommerce
    orders = get_woocomerce()
    return orders.get_wc_orders(full_name=full_name, page=page, per_page=per_page)

def get_wc_status_orders(status, page=1, per_page=20): # Функція для отримання замовлень з WooCommerce за статусом
    orders = get_woocomerce()
    return orders.get_wc_status_orders(status, page=page, per_page=per_page)

def get_sorted_new_to_old_orders(page=1, per_page=20): # Функція для отримання замовлень з WooCommerce відсортованих від нових до старих
    orders = get_woocomerce()
    return orders.get_sorted_new_to_old_orders(page=page, per_page=per_page)

def get_order(id): # Функція для отримання замовлення з WooCommerce по id
    orders = get_woocomerce()
    return orders.get_order(id)

def create_order(data): # Функція для створення замовлення в WooCommerce
    orders = get_woocomerce()
    return orders.create_order(data)

def update_order(id, data): # Функція для оновлення замовлення в WooCommerce
    orders = get_woocomerce()
    return orders.update_order(id, data)

def delete_order(id): # Функція для видалення замовлення в WooCommerce
    orders = get_woocomerce()
    return orders.delete_order(id)

def get_customers(page=1, per_page=20): # Функція для отримання клієнтів з WooCommerce
    orders = get_woocomerce()
    return orders.get_customers(page=page, per_page=per_page)

def get_customer(id): # Функція для отримання клієнта з WooCommerce по id
    orders = get_woocomerce()
    return orders.get_customer(id)

def create_customer(data): # Функція для створення клієнта в WooCommerce
    orders = get_woocomerce()
    return orders.create_customer(data)

def update_customer(id, data): # Функція для оновлення клієнта в WooCommerce
    orders = get_woocomerce()
    return orders.update_customer(id, data)

def delete_customer(id): # Функція для видалення клієнта в WooCommerce
    orders = get_woocomerce()
    return orders.delete_customer(id)

def get_wc_products(page=1, per_page=20): # Функція для отримання продуктів з WooCommerce
    orders = get_woocomerce()
    return orders.get_wc_products(page=page, per_page=per_page)

def get_wc_product(id): # Функція для отримання продукту з WooCommerce по id
    orders = get_woocomerce()
    return orders.get_wc_product(id)

def create_product(data): # Функція для створення продукту в WooCommerce
    orders = get_woocomerce()
    return orders.create_product(data)

def update_product(id, data): # Функція для оновлення продукту в WooCommerce
    orders = get_woocomerce()
    return orders.update_product(id, data)

def delete_product(id): # Функція для видалення продукту в WooCommerce
    orders = get_woocomerce()
    return orders.delete_product(id)


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

