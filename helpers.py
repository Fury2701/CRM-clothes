from models import *
from config import *



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


def update_sms(phone_number, message_text, status, message_type, message_id="-"):
    try:
        with Session() as db_session:
            sms = Sms_history(user=session["login"], phone_number=phone_number, message_text=message_text, message_id=message_id, status=status, message_type=message_type, date=datetime.now())
            db_session.add(sms)
            db_session.commit()
    except Exception as e:
        return "Database error" + str(e)

def update_sms_status(message_id):
    try:
        with Session() as db_session:
            sms = db_session.query(Sms_history).filter(Sms_history.message_id == message_id).first()
            sms.status = "Відправлено"
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
                    'status': sms.status,
                    'type': sms.message_type
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

def get_wc_products(sku=None, name=None, category=None, page=1, per_page=20): # Функція для отримання продуктів з WooCommerce
    orders = get_woocomerce()
    return orders.get_products(sku=sku, name=name, category=category, page=page, per_page=per_page)

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

# Функція для відправки Viber повідомлення (заглушка)
def send_viber(phone_number, message_text):
    # Заглушка для Viber
    return "Viber message sent successfully"

# Функція для відправки Email
def send_email(email_address, subject, message_text):
    try:
        msg = MIMEMultipart()
        msg['From'] = 'a95.mail.ru@gmail.com'
        msg['To'] = email_address
        msg['Subject'] = subject

        msg.attach(MIMEText(message_text, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('a95.mail.ru@gmail.com', 'jptg fnyr szwd qrzp')
        text = msg.as_string()
        server.sendmail('a95.mail.ru@gmail.com', email_address, text)
        server.quit()
        return "Email sent successfully"
    except Exception as e:
        return str(e)

def add_order(order_data: dict, products_data: list):
    with Session() as session:
        try:
            # Перевіряємо, чи існує замовлення з тим самим order_id
            existing_order = session.query(exists().where(Order.order_id == order_data['order_id'])).scalar()
            
            if existing_order:
                print(f"Order {order_data['order_id']} already exists in the database. Skipping...")
                return False
            
            # Створюємо новий об'єкт замовлення
            new_order = Order(**order_data)
            
            # Додаємо продукти до замовлення
            for product_data in products_data:
                new_product = OrderProduct(**product_data)
                new_order.products.append(new_product)
            
            session.add(new_order)
            session.commit()
            return True
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to add order: {e}")
            return False

def delete_order(order_id: int):
    with Session() as session:
        try:
            # Знаходимо замовлення за order_id
            order = session.query(Order).filter_by(order_id=order_id).first()
            
            if order:
                session.delete(order)
                session.commit()
                return True
            else:
                print("Order not found.")
                return False
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to delete order: {e}")
            return False

def update_order(order_id: int, updated_data: dict):
    with Session() as session:
        try:
            # Знаходимо замовлення за order_id
            order = session.query(Order).filter_by(order_id=order_id).first()
            
            if order:
                # Оновлюємо поля замовлення
                for key, value in updated_data.items():
                    setattr(order, key, value)
                
                session.commit()
                return True
            else:
                print("Order not found.")
                return False
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to update order: {e}")
            return False

def add_product_to_order(order_id: int, product_data: dict):
    with Session() as session:
        try:
            # Знаходимо замовлення за order_id
            order = session.query(Order).filter_by(order_id=order_id).first()
            
            if order:
                new_product = OrderProduct(**product_data)
                order.products.append(new_product)
                
                session.commit()
                return True
            else:
                print("Order not found.")
                return False
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to add product to order: {e}")
            return False

def delete_product(product_id: int):
    with Session() as session:
        try:
            # Знаходимо продукт за product_id
            product = session.query(OrderProduct).filter_by(id=product_id).first()
            
            if product:
                session.delete(product)
                session.commit()
                return True
            else:
                print("Product not found.")
                return False
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to delete product: {e}")
            return False

def update_product(product_id: int, updated_data: dict):
    with Session() as session:
        try:
            # Знаходимо продукт за product_id
            product = session.query(OrderProduct).filter_by(id=product_id).first()
            
            if product:
                # Оновлюємо поля продукту
                for key, value in updated_data.items():
                    setattr(product, key, value)
                
                session.commit()
                return True
            else:
                print("Product not found.")
                return False
        except SQLAlchemyError as e:
            session.rollback()
            print(f"Failed to update product: {e}")
            return False


def get_order_by_id(order_id: int):
    with Session() as session:
        try:
            # Отримуємо замовлення з товарами за order_id
            order = session.query(Order).filter_by(order_id=order_id).first()
            
            if order:
                # Перетворюємо дані замовлення в словник
                order_data = {
                    'order_id': order.order_id,
                    'date_created': order.date_created,
                    'client_first_name': order.client_first_name,
                    'client_second_name': order.client_second_name,
                    'client_last_name': order.client_last_name,
                    'client_id': order.client_id,
                    'client_notes': order.client_notes,
                    'phone': order.phone,
                    'email': order.email,
                    'price': order.price,
                    'full_price': order.full_price,
                    'delivery_option_id': order.delivery_option_id,
                    'delivery_option_name': order.delivery_option_name,
                    'delivery_shipping_service': order.delivery_shipping_service,
                    'delivery_provider': order.delivery_provider,
                    'delivery_type': order.delivery_type,
                    'delivery_sender_warehouse_id': order.delivery_sender_warehouse_id,
                    'delivery_recipient_warehouse_id': order.delivery_recipient_warehouse_id,
                    'delivery_declaration_number': order.delivery_declaration_number,
                    'delivery_unified_status': order.delivery_unified_status,
                    'delivery_address': order.delivery_address,
                    'delivery_cost': order.delivery_cost,
                    'payment_option_id': order.payment_option_id,
                    'payment_option_name': order.payment_option_name,
                    'payment_type': order.payment_type,
                    'payment_status': order.payment_status,
                    'payment_status_modified': order.payment_status_modified,
                    'status': order.status,
                    'status_name': order.status_name,
                    'source': order.source,
                    'has_order_promo_free_delivery': order.has_order_promo_free_delivery,
                    'cpa_commission_amount': order.cpa_commission_amount,
                    'cpa_commission_is_refunded': order.cpa_commission_is_refunded,
                    'utm_medium': order.utm_medium,
                    'utm_source': order.utm_source,
                    'utm_campaign': order.utm_campaign,
                    'dont_call_customer_back': order.dont_call_customer_back,
                    'ps_promotion_name': order.ps_promotion_name,
                    'ps_promotion_conditions': order.ps_promotion_conditions,
                    'cancellation_title': order.cancellation_title,
                    'cancellation_initiator': order.cancellation_initiator
                }
                
                # Додаємо інформацію про продукти
                order_data['products'] = []
                for product in order.products:
                    product_data = {
                        'product_id': product.product_id,
                        'product_external_id': product.product_external_id,
                        'product_image': product.product_image,
                        'product_quantity': product.product_quantity,
                        'product_price': product.product_price,
                        'product_url': product.product_url,
                        'product_name': product.product_name,
                        'product_name_ru': product.product_name_ru,
                        'product_name_uk': product.product_name_uk,
                        'product_total_price': product.product_total_price,
                        'product_measure_unit': product.product_measure_unit,
                        'product_sku': product.product_sku,
                        'product_cpa_commission_amount': product.product_cpa_commission_amount
                    }
                    order_data['products'].append(product_data)
                
                return order_data
            else:
                print("Order not found.")
                return None
        except SQLAlchemyError as e:
            print(f"Failed to retrieve order: {e}")
            return None

def get_orders(page: int = 1, limit: int = 20, search_query: str = None):
    with Session() as session:
        try:
            query = session.query(Order)
            
            if search_query:
                search_pattern = f"%{search_query}%"
                query = query.filter(or_(
                    Order.client_first_name.ilike(search_pattern),
                    Order.client_last_name.ilike(search_pattern),
                    cast(Order.phone, String).ilike(search_pattern),
                    cast(Order.order_id, String).ilike(search_pattern)
                ))

            query = query.order_by(Order.date_created.desc())
            
            total_orders = query.count()
            orders = query.offset((page - 1) * limit).limit(limit).all()
            
            orders_data = []
            for order in orders:
                order_data = {
                    'order_id': order.order_id,
                    'date_created': order.date_created,
                    'client_first_name': order.client_first_name,
                    'client_last_name': order.client_last_name,
                    'phone': order.phone,
                    'email': order.email,
                    'price': order.price,
                    'status': order.status,
                    'status_name': order.status_name,
                }
                orders_data.append(order_data)
            
            return {
                'total_orders': total_orders,
                'orders': orders_data,
                'page': page,
                'pages': (total_orders + limit - 1) // limit
            }
        except SQLAlchemyError as e:
            print(f"Failed to retrieve orders: {e}")
            return None



def get_last_order_created_time():
    with Session() as session:
        try:
            # Отримуємо час створення останнього замовлення
            last_order = session.query(Order.date_created).order_by(Order.date_created.desc()).first()
            
            if last_order:
                # Додаємо часовий пояс UTC до дати
                timezone = pytz.UTC
                return timezone.localize(last_order.date_created)
            else:
                print("No orders found.")
                return None
        except SQLAlchemyError as e:
            print(f"Failed to retrieve last order creation time: {e}")
            return None



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

