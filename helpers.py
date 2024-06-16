from models import *
from config import *
import time


# Створення таблиць
Base.metadata.create_all(engine)
Base_second.metadata.create_all(engine_second)

# Функції для роботи з користувачами
def create_user(name, login, password, lvl):
    try:
        with Session() as session:
            new_user = User(name=name, login=login, password=password, lvl=lvl)
            session.add(new_user)
            session.commit()
            return {
                "id": new_user.id,
                "name": new_user.name,
                "login": new_user.login,
                "password": new_user.password,
                "lvl": new_user.lvl
            }
    except Exception as e:
        return {"error": "Failed to create user", "message": str(e)}

def get_user(user_id):
    try:
        with Session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                return {
                    "id": user.id,
                    "name": user.name,
                    "login": user.login,
                    "password": user.password,
                    "lvl": user.lvl
                }
            else:
                return {"error": "User not found"}
    except Exception as e:
        return {"error": "Failed to get user", "message": str(e)}

def update_user(user_id, name=None, login=None, password=None, lvl=None):
    try:
        with Session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                if name:
                    user.name = name
                if login:
                    user.login = login
                if password:
                    user.password = password
                if lvl is not None:
                    user.lvl = lvl
                session.commit()
                return {
                    "id": user.id,
                    "name": user.name,
                    "login": user.login,
                    "password": user.password,
                    "lvl": user.lvl
                }
            return {"error": "User not found"}
    except Exception as e:
        return {"error": "Failed to update user", "message": str(e)}

def delete_user(user_id):
    try:
        with Session() as session:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                session.delete(user)
                session.commit()
                return {"message": "User deleted successfully"}
            return {"error": "User not found"}
    except Exception as e:
        return {"error": "Failed to delete user", "message": str(e)}

def get_all_users():
    try:
        with Session() as session:
            users = session.query(User).all()
            return [{"id": user.id, "name": user.name, "login": user.login, "password": user.password, "lvl": user.lvl} for user in users]
    except Exception as e:
        return {"error": "Failed to get users", "message": str(e)}



def user_validy(login, password):
        with Session() as db_session:
            user = db_session.query(User).filter(User.login == login, User.password == password).first()
        
            if user:
                session["id"] = user.id
                session["name"] = user.name
                session["login"] = login
                session["password"] = password
                session["lvl"] = user.lvl
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

def get_wc_orders(customer=None, full_name=None, page=1, per_page=20): # Функція для отримання замовлень з WooCommerce
    orders = get_woocomerce()
    return orders.get_wc_orders(customer=customer, full_name=full_name, page=page, per_page=per_page)

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

def get_customers(full_name=None,page=1, per_page=20): # Функція для отримання клієнтів з WooCommerce
    orders = get_woocomerce()
    return orders.get_customers(name=full_name, page=page, per_page=per_page)

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
    return orders.get_product(id)

def get_category(): # Функція для отримання продукту з WooCommerce по id
    orders = get_woocomerce()
    return orders.get_categotry()

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
    
def get_total_pages(manager_id, per_page=5):
    try:
        with Session() as db_session:
            total_records = db_session.query(manager_order).filter(manager_order.manager_id == manager_id).count()
            total_pages = ceil(total_records / per_page)
            return total_pages
    except Exception as e:
        return 0

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
        with Session_second() as db_session:
            order = db_session.query(wp_wc_orders).filter(wp_wc_orders.id == order_id).first()
            if order:
                if discount_type == 'percentage':
                    new_total = order.total_amount * (1 - discount_amount / 100)
                else:  # fixed amount in UAH
                    new_total = order.total_amount - discount_amount
                order.total_amount = new_total
                db_session.commit()
                return {"success": True, "message": "Discount applied successfully", "new_total":new_total}
            else:
                return {"error": "Order not found"}
    except Exception as e:
        return {"error": "Database error" + str(e)}

def add_entry(ord_id: str, ttn_id: str, ref_code: str, client_ref: str):
    try:
        with Session() as db_session:
            # Знайти клієнта за contact_ref
            client = db_session.query(counteragents).filter_by(contact_ref=client_ref).first()
            
            if client is None:
                return {"error": "Client not found"}
            
            # Створити новий запис у таблиці nova_poshta
            new_entry = nova_poshta(
                ord_id=ord_id,
                ttn_id=ttn_id,
                ref_code=ref_code,
                client_name=client.name,  # Додаємо ім'я клієнта
                date=datetime.now().date()
            )
            db_session.add(new_entry)
            db_session.commit()
            return 200
    except Exception as e:
        return {"error": "DB error with NP: " + str(e)}



def delete_entry(ref_code):
    try:
        with Session() as db_session:
            entry = db_session.query(nova_poshta).filter(nova_poshta.ref_code == ref_code).first()
            if entry:
                db_session.delete(entry)
                db_session.commit()
                return True
            return False
    except Exception as e:
        return {"error": "DB error with NP" + str(e)}


def update_entry(entry_id, ord_id=None, ttn_id=None):
    try:
        with Session() as db_session:
            entry = db_session.query(nova_poshta).filter(nova_poshta.id == entry_id).first()
            if entry:
                if ord_id is not None:
                    entry.ord_id = ord_id
                if ttn_id is not None:
                    entry.ttn_id = ttn_id
                entry.date = datetime.utcnow()
                db_session.commit()
                return True
            return False
    except Exception as e:
        return {"error": "DB error with NP" + str(e)}


def get_entries(page=1, page_size=20, order_by='date', order='desc', search_value=None):
    """
    Отримує сторінку записів з таблиці з можливістю сортування і фільтрації.
    :param page: Номер сторінки (починається з 1).
    :param page_size: Кількість записів на сторінку (максимум 20).
    :param order_by: Поле для сортування ('date' або 'ord_id').
    :param order: Порядок сортування ('asc' або 'desc').
    :param search_value: Значення для пошуку по ord_id або ttn_id.
    :return: Кортеж (список записів, кількість сторінок, поточна сторінка).
    """
    with Session() as db_session:
        query = db_session.query(nova_poshta)
        
        if search_value is not None:
            search_value_str = f"%{search_value}%"
            query = query.filter(
                or_(
                    nova_poshta.ord_id.like(search_value_str),
                    nova_poshta.ttn_id.like(search_value_str)
                )
            )
        
        total_entries = query.count()
        total_pages = (total_entries + page_size - 1) // page_size  # Обчислюємо кількість сторінок

        if order == 'asc':
            order_criteria = getattr(nova_poshta, order_by).asc()
        else:
            order_criteria = getattr(nova_poshta, order_by).desc()

        entries = query.order_by(order_criteria).offset((page - 1) * page_size).limit(page_size).all()
        
        return entries, total_pages, page

def create_counteragent(name: str, phone: str, ref: str, contact_ref: str):
    try:
        with Session() as db_session:
            new_counteragent = counteragents(name=name, phone=phone, ref=ref, contact_ref=contact_ref)
            db_session.add(new_counteragent)
            db_session.commit()
            db_session.refresh(new_counteragent)
            return new_counteragent
    except Exception as e:
        return{"error": "DB error with NP" + str(e)}
        

# Функція для отримання запису за ID
def get_counteragent_by_id(counteragent_id: int):
    try:
        with Session() as db_session:
            return db_session.query(counteragents).filter(counteragents.id == counteragent_id).first()
    except Exception as e:
        return{"error": "DB error with NP" + str(e)}
        

# Функція для оновлення запису за ID
def update_counteragent(counteragent_id: int, name: str = None, phone: str = None):
    try:
        with Session() as db_session:
            counteragent = db_session.query(counteragents).filter(counteragents.id == counteragent_id).first()
            if counteragent:
                if name:
                    counteragent.name = name
                if phone:
                    counteragent.phone = phone
                db_session.commit()
                db_session.refresh(counteragent)
                return counteragent
            else:
                return(f"No counteragent found with ID: {counteragent_id}")
                return None
    except Exception as e:
        return{"error": "DB error with NP" + str(e)}
        

# Функція для видалення запису за ID
def delete_counteragent(counteragent_id: int):
    try:
        with Session() as db_session:
            counteragent = db_session.query(counteragents).filter(counteragents.id == counteragent_id).first()
            if counteragent:
                db_session.delete(counteragent)
                db_session.commit()
                return True
            else:
                print(f"No counteragent found with ID: {counteragent_id}")
                return False
    except Exception as e:
        return{"error": "DB error with NP" + str(e)}

def get_counteragents(page=1, page_size=20, search_name=None, search_phone=None):
    """
    Отримує сторінку записів з таблиці з можливістю фільтрації.
    :param page: Номер сторінки (починається з 1).
    :param page_size: Кількість записів на сторінку (максимум 20).
    :param search_name: Значення name для пошуку.
    :param search_phone: Значення phone для пошуку.
    :return: Кортеж (список записів, кількість сторінок, поточна сторінка).
    """
    if page_size > 20:
        page_size = 20
    
    try:
        with Session() as db_session:
            query = db_session.query(counteragents)
            
            if search_name:
                search_pattern = f"%{search_name}%"
                query = query.filter(counteragents.name.ilike(search_pattern))
            
            if search_phone:
                search_pattern = f"%{search_phone}%"
                query = query.filter(counteragents.phone.ilike(search_pattern))
            
            total_entries = query.count()
            total_pages = (total_entries + page_size - 1) // page_size  # Обчислюємо кількість сторінок

            entries = query.order_by(counteragents.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
            
            # Конвертація записів у словники
            entries = [entry.to_dict() for entry in entries]
            
            return entries, total_pages, page
    except Exception as e:
        return {"error": "DB error with NP: " + str(e)}

def get_sales_report(date_min=None, date_max=None, period=None):
    woo_api = get_woocomerce()
    return woo_api.get_sales_report(date_min=date_min, date_max=date_max, period=period)

def get_top_sellers(period=None, date_min=None, date_max=None):
    woo_api = get_woocomerce()
    return woo_api.get_top_sellers(period=period, date_min=date_min, date_max=date_max)
        
        

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

