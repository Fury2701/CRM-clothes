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
                session["id"] = user.id
                session["name"] = user.name
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
            sms.status = "Доставлено"
            db_session.commit()
    except Exception as e:
        return "Database error" + str(e)


def get_sms(number):
    try:
        with Session() as db_session:
            sms_records = db_session.query(Sms_history).filter(Sms_history.phone_number == number).all()
            
            # Преобразование записей в словари для формирования JSON
            sms_data = []
            for sms in sms_records:
                sms_dict = {
                    'id': sms.id,
                    'phone_number': sms.phone_number,
                    'message_id': sms.message_id,
                    'text': sms.message_text,
                    'status': sms.status
                }
                sms_data.append(sms_dict)
            
            # Формирование JSON из списка словарей
            return sms_data
            
    except Exception as e:
        return ({"error": "Number error", "message": str(e)})

    

# Функції робот з базою даних WooCommerce

def get_wc_orders(full_name=None, page=1, per_page=20): # Функція для отримання замовлень з WooCommerce
    orders = get_woocomerce()
    return orders.get_wc_orders(full_name=full_name, page=page, per_page=per_page)

def get_wc_status_orders(status, page=1, per_page=20): # Функція для отримання замовлень з WooCommerce за статусом
    orders = get_woocomerce()
    return orders.get_wc_status_orders(status=status, page=page, per_page=per_page)

def get_sorted_old_to_new_orders(page=1, per_page=20): # Функція для отримання замовлень з WooCommerce відсортованих від нових до старих
    orders = get_woocomerce()
    return orders.get_sorted_old_to_new_orders(page=page, per_page=per_page)

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

def get_wc_products(name=None, category=None, page=1, per_page=20): # Функція для отримання продуктів з WooCommerce
    orders = get_woocomerce()
    return orders.get_products(name=name, category=category, page=page, per_page=per_page)

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

def get_wc_notes(id, page=1, per_page=20): # Функція для отримання нотаток з WooCommerce
    orders = get_woocomerce()
    return orders.get_notes(id=id, page=page, per_page=per_page)

def get_wc_note(id, note_id): # Функція для отримання нотатки з WooCommerce по id
    orders = get_woocomerce()
    return orders.get_note(id, note_id)

def create_note(id, data): # Функція для створення нотатки в WooCommerce
    orders = get_woocomerce()
    return orders.create_note(id, data)

def delete_note(id, note_id): # Функція для видалення нотатки в WooCommerce
    orders = get_woocomerce()
    return orders.delete_note(id, note_id)

def get_custom_status(): # Функція для отримання кастомних статусів
    with Session() as db_session:
        status = db_session.query(custom_status).all()
        return status

def create_custom_status(key, value):
    try:
        with Session() as db_session:
            status = custom_status(key=key, value=value)
            db_session.add(status)
            db_session.commit()
            return "Status created"
    except Exception as e:
        return "Database error" + str(e)

def delete_custom_status(key):
    try:
        with Session() as db_session:
            status = db_session.query(custom_status).filter(custom_status.key == key).first()
            db_session.delete(status)
            db_session.commit()
            return "Status deleted"
    except Exception as e:
        return "Database error" + str(e)

def add_manager_to_order(order_id, manager_id):
    try:
        with Session() as db_session:
            order = manager_order(order_id=order_id, manager_id=manager_id)
            db_session.add(order)
            db_session.commit()
            return "Manager added to order"
    except Exception as e:
        return "Database error" + str(e)

def get_manager_orders(manager_id, page=1, per_page=5):
    try:
        with Session() as db_session:
            # Обчислюємо значення offset для поточної сторінки
            offset = (page - 1) * per_page
            # Вибираємо замовлення для поточної сторінки
            orders = db_session.query(manager_order).filter(manager_order.manager_id == manager_id).offset(offset).limit(per_page).all()
            json_orders_list = []
            for order in orders:
                json_order = json.dumps({
                    "order_id": order.order_id,
                    # Додайте інші поля замовлення за потреби
                })
                json_orders_list.append(json_order)
            return json_orders_list
    except Exception as e:
        return "Database error" + str(e)

def update_manager_order(order_id:int, manager_id:int):
    try:
        with Session() as db_session:
            # Перевіряємо чи існує запис з вказаним order_id
            order = db_session.query(manager_order).filter(manager_order.order_id == order_id).first()
            if order is None:
                # Якщо запис не існує, створюємо новий
                order = manager_order(order_id=order_id, manager_id=manager_id)
                db_session.add(order)
            else:
                # Якщо запис існує, оновлюємо manager_id
                order.manager_id = manager_id
            db_session.commit()
            return "Manager updated"
    except Exception as e:
        return "Database error" + str(e)

def get_manager_list_info():
    try:
        with Session() as db_session:
            managers = db_session.query(User).all()
            json_managers_list = []
            for manager in managers:
                json_manager = json.dumps({
                    "id": manager.id,
                    "name": manager.name,
                    "login": manager.login,
                    # Додайте інші поля менеджера за потреби
                },ensure_ascii=False)
                json_managers_list.append(json_manager)
            return json_managers_list
    except Exception as e:
        return "Database error" + str(e)

def delete_manager_order(order_id):
    try:
        with Session() as db_session:
            order = db_session.query(manager_order).filter(manager_order.order_id == order_id).first()
            db_session.delete(order)
            db_session.commit()
            return "Manager deleted from order"
    except Exception as e:
        return "Database error" + str(e)
    
def apply_discount(order_id, discount_amount, discount_type):
    try:
        with Session() as db_session:
            order = db_session.query(wp_wc_orders).filter(wp_wc_orders.id == order_id).first()
            if order:
                if discount_type == 'percentage':
                    new_total = order.total_amount * (1 - discount_amount / 100)
                else:  # fixed amount in UAH
                    new_total = order.total_amount - discount_amount
                order.total_amount = new_total
                db_session.commit()
                return {"success": True, "message": "Discount applied successfully"}
            else:
                return {"error": "Order not found"}
    except Exception as e:
        return {"error": "Database error" + str(e)}

def get_discount_coupon(search=None, code=None, page=1, per_page=20):
    orders = get_woocomerce()
    return orders.get_discout_coupons(search=search, code=code, page=page, per_page=per_page)

def create_discount_coupon(data):
    orders = get_woocomerce()
    return orders.create_discount_coupon(data)

def delete_discount_coupon(id):
    orders = get_woocomerce()
    return orders.delete_discount_coupon(id)

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

