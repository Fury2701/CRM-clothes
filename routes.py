from config import *
from helpers import *
from api import * 
from nova_api import *

@app.route("/",methods=['GET'])
def login_page():
    return render_template("login.html")


@app.route("/admin", methods=['GET'])
def admin_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = 1 
        orders_json = "orders"
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("main.html", orders=orders_json, current_page=page), 200

    

@app.route("/logout", methods=['GET'])
def logout():
    if "login" not in session:
        return redirect(url_for("login_page"))

    session.pop("id", None)
    session.pop("login", None)
    session.pop("password", None)
    session.pop("name", None)
    session.pop("lvl",None)
    return redirect(url_for("login_page"))

@app.route("/print", methods=['GET'])
def print_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    order_id = request.args.get('id')
    if not order_id:
        return jsonify({"error": "Missing id parameter"}), 400

    try:
        order = get_order(order_id)
        if not order:
            return jsonify({"error": "Order not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("print.html", order=order), 200

@app.route("/user_page", methods=['GET'])
def user_page():
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    return render_template("user.html"), 200


@app.route("/user/create", methods=['POST'])
def create_user_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    name = request.json.get('name')
    login = request.json.get('login')
    password = request.json.get('password')
    lvl = request.json.get('lvl')
    if name and login and password and lvl:
        result = create_user(name, login, password, lvl)
        return jsonify(result), 200
    else:
        return jsonify({"error": "Missing required fields"}), 400  # 400 Bad Request

@app.route("/user/<int:user_id>", methods=['GET'])
def get_user_route(user_id):
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    result = get_user(user_id)
    return jsonify(result), 200 if "error" not in result else 404  # 404 Not Found if user not found

@app.route("/user/<int:user_id>", methods=['PUT'])
def update_user_route(user_id):
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    name = request.json.get('name')
    login = request.json.get('login')
    password = request.json.get('password')
    lvl = request.json.get('lvl')
    result = update_user(user_id, name, login, password, lvl)
    return jsonify(result), 200 if "error" not in result else 404  # 404 Not Found if user not found

@app.route("/user/<int:user_id>", methods=['DELETE'])
def delete_user_route(user_id):
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    result = delete_user(user_id)
    return jsonify(result), 200 if "error" not in result else 404  # 404 Not Found if user not found

@app.route("/user/all", methods=['GET'])
def get_all_users_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403  # 403 Forbidden

    result = get_all_users()
    return jsonify(result), 200 if "error" not in result else 500  # 500 Internal Server Error if database error

@app.route("/dataorders", methods=['GET']) #для отримання даних наступних сторінок(можливе використання фільтрів по ПІБ)
def dataorders():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:

        page = request.args.get('page', 1, type=int)
        full_name = request.args.get('full_name', None, type=str)
        customer= request.args.get('customer_id',None,type=int) 
        orders, total_pages = get_wc_orders(customer=customer, full_name=full_name,page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({'orders': orders, 'current_page': page, 'total_pages':total_pages}), 200

@app.route("/get_orders_by_manager", methods=['GET']) #для отримання даних наступних сторінок по менеджеру
def get_orders_by_manager():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        user_id = request.args.get('manager_id')
        total_pages = get_total_pages(user_id, 5)
        orders = get_manager_orders(manager_id=user_id, page=page)
        json_orders=[]
        for order in orders:
            order_dict = json.loads(order)  # перетворення рядка JSON у словник
            info = get_order(order_dict['order_id'])  # отримання ідентифікатора замовлення
            json_orders.append(info)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return {"orders": json_orders, "current_page": page, "total_pages": total_pages}

@app.route("/dataordersbyid", methods=['GET']) #для отримання даних наступних замовлень по id
def dataordersbyid():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        order_id = request.args.get('id')
        order = get_order(order_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(order), 200

@app.route("/dataordersstatus", methods=['GET']) #для отримання даних наступних сторінок з фільтром по статусу
def dataordersstatus():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        orders, total_pages = get_wc_status_orders(status, page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({'orders': orders, 'current_page': page, 'total_pages':total_pages}), 200

@app.route("/dataordersoldtonew", methods=['GET']) #для отримання даних наступних сторінок відсортованих від нових до старих
def dataordersnewtoold():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        orders, total_pages = get_sorted_old_to_new_orders(page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({'orders': orders, 'current_page': page, 'total_pages':total_pages}), 200

@app.route("/create_order", methods=['POST'])
def create_orders():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_order(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_order", methods=['POST'])
def update_orders():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    if "id" not in data or "data" not in data:
        return jsonify({"error": "Invalid data"}), 400
    try:
        response = update_order(data['id'], data['data'])
        history = create_note(data['id'], {"note": f"Замовлення оновлено менеджером {session.get('name')}, оновлені дані {data['data']}"})
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
 
@app.route("/delete_order", methods=['POST'])
def delete_orders():
    if "login" not in session:
        return redirect(url_for("login_page"))

    order_id= request.args.get('id')
    try:
        response = delete_order(order_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/product", methods=['GET'])
def product_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = request.args.get('page', 1, type=int)
        name = request.args.get('name', 1, type=str)
        category = request.args.get('category', 1, type=int)
        products, total_pages = get_wc_products(name=name, category=category, page=page, per_page=20)
        products_json = json.dumps(products)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("product.html", products=products_json, current_page=page, total_pages=total_pages), 200

@app.route("/productbyid", methods=['GET'])
def product_info_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        product_id = request.args.get('id')
        product = get_wc_product(product_id) 
        product_json = json.dumps(product)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(product_json), 200

# Маршрут для обробки POST запиту на /productbyid
@app.route("/productbyid_extend", methods=['POST'])
def product_info_page_extend():
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    try:
        data = request.get_json()
        ids = data.get('ids', [])
        
        # Список для зберігання інформації про товари
        products_info = []
        
        for product_id in ids:
            try:
                product = get_wc_product(str(product_id))
                if product:
                    products_info.append(product)
                else:
                    products_info.append({"id": product_id, "message": "Product not found"})
            except Exception as e:
                products_info.append({"id": product_id, "error_message": str(e)})
        
        return jsonify(products_info), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/category", methods=['GET'])
def category():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        category = get_category() 
        product_json = json.dumps(category)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(product_json), 200

@app.route("/data_products", methods=['GET'])
def data_products():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        name = request.args.get('name', None, type=str)
        category = request.args.get('category', None, type=int)
        page = request.args.get('page', 1, type=int)
        sku = request.args.get('sku', None)
        products, total_pages = get_wc_products(sku=sku, name=name, category=category, page=page, per_page=20)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"products":products,"current_page":page, "total_pages":total_pages}), 200

@app.route("/create_product", methods=['POST'])
def create_products():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_product(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_product", methods=['POST'])
def update_products():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    if "id" not in data:
        return jsonify({"error": "Invalid data"}), 400
    try:
        response = update_product(data['id'], data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_product", methods=['POST'])
def delete_products():
    if "login" not in session:
        return redirect(url_for("login_page"))

    product_id = request.args.get('id')
    try:
        response = delete_product(product_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/customer", methods=['GET'])
def customer_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = request.args.get('page', 1, type=int)
        customers, total_pages = get_customers(page=page)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return render_template("customer.html", customers=customers, current_page=page, total_pages=total_pages), 200

@app.route("/customerbyid", methods=['GET'])
def customer_info_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        client_id = request.args.get('id')
        customer = get_customer(client_id) 
        customer_json = json.dumps(customer)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(customer_json), 200

@app.route("/data_customers", methods=['GET'])
def data_customers():
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        page = request.args.get('page', 1, type=int)
        full_name = request.args.get('name', None)
        customers, total_pages = get_customers(full_name=full_name,page=page)
        print(customers)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"customers":customers,"current_page":page, "total_pages":total_pages}), 200

@app.route("/create_customer", methods=['POST'])
def create_customers():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_customer(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_customer", methods=['POST'])
def update_customers():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    if "id" not in data:
        return jsonify({"error": "Invalid data"}), 400
    try:
        response = update_customer(data['id'], data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_customer", methods=['GET'])
def delete_customers():
    if "login" not in session:
        return redirect(url_for("login_page"))

    customer_id = request.args.get('id')
    try:
        response = delete_customer(customer_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/notes", methods=['GET'])
def notes_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        id_ord = request.args.get('id')
        page = request.args.get('page', 1, type=int)
        notes = get_wc_notes(id=id_ord, page=page, per_page=20)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(notes)

@app.route("/notebyid", methods=['GET'])
def note_info_page():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        id_ord = request.args.get('id')
        note_id = request.args.get('note_id')
        note = get_wc_note(id_ord, note_id) 
        note_json = json.dumps(note)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify(note_json), 200

@app.route("/create_note", methods=['POST'])
def create_notes():
    if "login" not in session:
        return redirect(url_for("login_page"))

    id_ord = request.args.get('id')
    data = request.get_json()
    try:
        response = create_note(id_ord ,data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_note", methods=['GET'])
def delete_notes():
    if "login" not in session:
        return redirect(url_for("login_page"))

    id_ord = request.args.get('id')
    note_id = request.args.get('note_id')
    try:
        response = delete_note(id_ord, note_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/admin_validy", methods=['POST'])
def admin_validy():
    login = request.form.get("login")
    password = request.form.get("password")

    if not (login and password):
        return jsonify({"error": "Invalid login or password"}), 400

    else:
        user = user_validy(login,password)
        if user== True:
            return redirect(url_for("admin_page"))
        else:
            return jsonify({"error": "Invalid login or password"}), 401 

@app.route("/get_all_sms", methods=['GET'])
def get_all_sms():
    if "login" not in session:
        return redirect(url_for("login_page"))

    number=request.args.get('number')
    try:
        sms= get_sms(number)
        return jsonify({"sms_data":sms}), 200
    except Exception as e:
        return jsonify({"error":"Invalid data"}), 400


@app.route("/send_phone_sms", methods=['POST'])
def send_phone_sms():
    if "login" not in session:
        return redirect(url_for("login_page"))

    requested_data = request.get_json()
    ord_id = requested_data.get('id')
    message_text = requested_data.get('message_text')
    message_type = requested_data.get('message_type')
    
    if message_type == 'sms':
        phone_number = requested_data.get('phone_number')
        if not phone_number or not message_text:
            return jsonify({"error": "Invalid data"}), 400
        
        try:
            response = send_sms(phone_number, message_text)
            history = create_note(ord_id, {"note": f"Замовлення оновлено менеджером {session.get('name')}, відправлене SMS: {message_text}"})
        except Exception as e:
            return jsonify({"error": "Internal error"}), 400
        
        if isinstance(response, tuple) and response[0] == "Well done!":
            status = "Not delivered"
            update_sms(phone_number=phone_number, message_text=message_text, message_id=response[1], status=status, message_type=message_type)  
            return jsonify({"success": "SMS sent successfully and processed in the database.", "message_id": response[1]}), 200
        else:
            return jsonify({"error": response}), 400
    
    elif message_type == 'viber':
        phone_number = requested_data.get('phone_number')
        if not phone_number or not message_text:
            return jsonify({"error": "Invalid data"}), 400
        
        try:
            response = send_viber(phone_number, message_text)
            if isinstance(response, tuple) and response[0] == "Well done!":
                status = "Відправлено"
                history = create_note(ord_id, {"note": f"Замовлення оновлено менеджером {session.get('name')}, відправлене Viber повідомлення: {message_text}"})
                update_sms(phone_number=phone_number, message_text=message_text, message_id=response[1], status=status, message_type=message_type)
                return jsonify({"success": "Viber message sent successfully and processed in the database.", "message_id": response[1]}), 200
            else:
                return jsonify({"error": response}), 400
        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 400
    
    elif message_type == 'email':
        email_address = requested_data.get('email_address')
        subject = requested_data.get('subject', 'Notification')
        if not email_address or not message_text:
            return jsonify({"error": "Invalid data"}), 400
        
        try:
            response = send_email(email_address, subject, message_text)
            if response == "Email sent successfully":
                history = create_note(ord_id, {"note": f"Замовлення оновлено менеджером {session.get('name')}, відправлений Email: {message_text}"})
                status="Відправлено"
                update_sms(phone_number=phone_number, message_text=message_text, status=status, message_type=message_type)
            else:
                return jsonify({"error": response}), 400
        except Exception as e:
            return jsonify({"error": "Internal error"}), 400
        
        return jsonify({"success": response}), 200

    else:
        return jsonify({"error": "Invalid message type"}), 400


@app.route("/custom_status_list", methods=['GET'])
def custom_status():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        status = get_custom_status()
        # Преобразование списка статусов в список словарей
        status_data = [{'key': s.key, 'value': s.value} for s in status]
        return jsonify(status_data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/create_custom_status", methods=['POST'])
def create_custom_statuss():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        requsted_data=request.get_json()
        key = requsted_data['key']
        value = requsted_data['value']
        if not key or not value:
            return jsonify({"error": "Invalid data"}), 400

        response = create_custom_status(key, value)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_custom_status", methods=['POST'])
def delete_custom_statuss():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        requsted_data=request.get_json()
        key = requsted_data['key']
        if not key:
            return jsonify({"error": "Invalid data"}), 400

        response = delete_custom_status(key)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/add_manager_order_info", methods=['POST'])
def add_manager_order_info():
    if "login" not in session:
        return redirect(url_for("login_page"))
    requsted_data=request.get_json()
    user_id = requsted_data['user_id']
    order_id = requsted_data['order_id']

    if not user_id or not order_id:
        return jsonify({"error": "Invalid data"}), 400

    try:
        response = add_manager_to_order(order_id, user_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_manager_order_info", methods=['POST'])
def update_manager_order_info():
    if "login" not in session:
        return redirect(url_for("login_page"))
    requsted_data=request.get_json()
    user_id = requsted_data['user_id']
    order_id = requsted_data['order_id']

    if not user_id or not order_id:
        return jsonify({"error": "Invalid data"}), 400

    try:
        response = update_manager_order(order_id, user_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/get_manager_list", methods=['GET'])
def get_manager_list():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        return jsonify(get_manager_list_info()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_manager_order_info", methods=['GET'])
def delete_manager_order_info():
    if "login" not in session:
        return redirect(url_for("login_page"))

    order_id = request.args.get('order_id')
    try:
        response = delete_manager_order(order_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/update_order_discount", methods=['POST'])
def update_order_discount():
    if "login" not in session:
        return redirect(url_for("login_page"))

    requested_data = request.get_json()
    order_id = requested_data.get('order_id')
    discount_amount = requested_data.get('discount_amount')
    discount_type = requested_data.get('discount_type')

    if not order_id or not discount_amount or not discount_type:
        return jsonify({"error": "Invalid data"}), 400

    try:
        response = apply_discount(order_id, discount_amount, discount_type)
        if response.get("success"):
            create_note(order_id, {"note":f"Замовлення оновлено менеджером {session.get('name')}, знижка застосована: {discount_amount}, ({discount_type})"})
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/get_coupons", methods=['GET'])
def get_coupons():
    if "login" not in session:
        return redirect(url_for("login_page"))
    try:
        page = request.args.get('page', 1, type=int)
        search = request.args.get('search', None, type=str)
        code = request.args.get('code', None, type=str)
        coupons, total_pages = get_discount_coupon(search=search, code=code, page=page)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({'coupons': coupons, 'current_page': page, 'total_pages':total_pages}), 200

@app.route("/create_coupon", methods=['POST'])
def create_coupon():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.get_json()
    try:
        response = create_discount_coupon(data)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delete_coupon", methods=['GET'])
def delete_coupon():
    if "login" not in session:
        return redirect(url_for("login_page"))

    coupon_id = request.args.get('id')
    try:
        response = delete_discount_coupon(coupon_id)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/delivery", methods=['GET', 'POST'])
def delivery():
    if "login" not in session:
        return redirect(url_for("login_page"))

    page = request.args.get('page', 1, type=int)
    order_by = request.args.get('order_by', 'date')
    order = request.args.get('order', 'desc')
    search_value = request.args.get('search_value')
    
    entries, total_pages, current_page = get_entries(page=page, order_by=order_by, order=order, search_value=search_value)
    
    return render_template("delivery.html", entries=entries, total_pages=total_pages, current_page=current_page), 200

@app.route("/delivery_data", methods=['GET'])
def delivery_data():
    if "login" not in session:
        return redirect(url_for("login_page"))

    page = request.args.get('page', 1, type=int)
    order_by = request.args.get('order_by', 'date')
    order = request.args.get('order', 'desc')
    search_value = request.args.get('search_value', None)
    
    entries, total_pages, current_page = get_entries(page=page, order_by=order_by, order=order, search_value=search_value)
    
    entries_data = [
        {
            'id': entry.id,
            'ord_id': entry.ord_id,
            'ttn_ref': entry.ref_code,
            'ttn_id': entry.ttn_id,
            'client_name': entry.client_name,
            'date': entry.date.strftime('%Y-%m-%d %H:%M:%S')
        }
        for entry in entries
    ]
    
    response = {
        'entries': entries_data,
        'total_pages': total_pages,
        'current_page': current_page
    }
    
    return jsonify(response)
#Оновлення статусу SMS

@app.route("/update_viber_status/<message_id>", methods=['GET'])
def update_viber_status_info(message_id):
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    if not message_id:
        return jsonify({"error": "Invalid data"}), 400

    try:
        response = check_viber_status(message_id)
        print(response)
    except Exception as e:
        return jsonify({"error": f"Problem with Kyivstar server: {str(e)}"}), 400

    if "status" in response:
        # Припускаємо, що "delivered" - це статус успішної доставки для Viber
        if response["status"] == "delivered":
            # Оновіть статус в базі даних
            update_sms_status(message_id)
            return jsonify({"Viber message status updated in the database": response}), 200
        else:
            # Якщо статус не "delivered", все одно повертаємо інформацію
            return jsonify({"Viber message status": response}), 200
    else:
        return jsonify({"error": response}), 400

@app.route("/update_sms_status/<message_id>", methods=['GET'])
def update_sms_status_info(message_id):
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page")) # Повертаємо 401, щоб показати, що користувач не має доступу
    
    if not message_id:
        return jsonify({"error": "Invalid data"}), 400

    try:
        print(message_id)
        response = check_sms_status(message_id)
        print(response)
    except Exception as e:
        return jsonify({"error":"Problem with Kyivstar server"}), 400

    if "status" in response:
        if response["status"] == "delivered":
            update_sms_status(message_id)
            return jsonify({"SMS status updated in the database.": response}), 200
        else:
            return jsonify({"error": response}), 400
    else:
        return jsonify({"error": response}), 400


@app.route('/create_internet_document/<ord_id>', methods=['POST'])
def create_document_route(ord_id):
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    data = request.json
    
    try:
        with NovaPoshtaClient() as client:
            result = create_internet_document(**data)
            result_data = result[0]
            IntDocNumber = result_data["IntDocNumber"]
            ref = result_data["Ref"]
            client_ref= data.get("contact_recipient")
        info= add_entry(ord_id,IntDocNumber,ref, client_ref)
        if info==200:
            return jsonify(result_data), 200
        else: 
            return jsonify({"error": "DB error or Novapost error"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_internet_document', methods=['PUT'])
def update_document_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.json
    ref = data.pop('ref')
    with NovaPoshtaClient() as client:
        result = update_internet_document(client, ref, **data)
    return jsonify(result)

@app.route('/delete_internet_document', methods=['DELETE'])
def delete_document_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.json
    document_refs = data['document_refs']
    try:
        with NovaPoshtaClient() as client:
            # Виклик методу для видалення документів у Nova Poshta API
            result = delete_internet_document(client, document_refs)

            # Перевірка успішності видалення
            if result.get('success', False):
                # Якщо видалення по API успішне, викликаємо функцію для видалення з бази даних
                for doc in result.get('data', []):
                    ref_code = doc.get('Ref')
                    if ref_code:
                        deleted = delete_entry(ref_code)
                        if deleted:
                            return jsonify({"success": True, "message": "Entry successfully deleted from database"})
                        else:
                            return jsonify({"error": "Failed to delete entry from database"}), 500
                    else:
                        return jsonify({"error": "Invalid document reference format"}), 400
            else:
                return jsonify({"error": "Failed to delete document in Nova Poshta API"}), 500

    except Exception as e:
        return jsonify({"error": f"Exception occurred: {str(e)}"}), 500


@app.route('/counteragents', methods=['GET'])
def counteragents():
    if "login" not in session:
        return redirect(url_for("login_page"))

    # Отримуємо параметри запиту
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    search_name = request.args.get('search_name', None)
    search_phone = request.args.get('search_phone', None)
    try:
        # Викликаємо функцію get_counteragents з введеними параметрами
        result = get_counteragents(page=page, page_size=page_size, search_name=search_name, search_phone=search_phone)

        
        entries, total_pages, current_page = result
        return jsonify({
            'counteragents': entries, 
            'total_pages': total_pages,
            'current_page': current_page
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create_counterparty', methods=['POST'])
def create_counterparty_route():
    if "login" not in session:
        return redirect(url_for("login_page"))

    data = request.json
    try:
        with NovaPoshtaClient() as client:
            result = create_counterparty(client, **data)
            ref = result['data'][0]['Ref']
            contact_ref=  result['data'][0]['ContactPerson']['data'][0]['Ref']
            name = f"{data.get('last_name')} {data.get('first_name')} {data.get('middle_name')}".strip()
            phone = data.get('phone')
            inf= create_counteragent(name, phone, ref, contact_ref)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/update_counterparty/<ref>', methods=['PUT'])
def update_counterparty_route(ref):
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    data = request.json
    try:
        with NovaPoshtaClient() as client:
            result = update_counterparty(client, ref, **data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_counterparty/<ref>/<id>', methods=['DELETE'])
def delete_counterparty_route(ref,id):
    if "login" not in session:
        return redirect(url_for("login_page"))

    try:
        with NovaPoshtaClient() as client:
            result = delete_counterparty(client, ref)
            delete_counteragent(id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/nova_tracking", methods=['POST'])
def nova_tracking():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))  # Повертаємо 401, щоб показати, що користувач не має доступу

    # Отримати JSON-дані з фронтенду
    data = request.get_json()

    # Створити список словників з даними про посилки
    documents = []
    for item in data:
        document_number = item.get('DocumentNumber')
        phone = item.get('Phone')
        if document_number:
            document = {
                "DocumentNumber": document_number
            }
            if phone:
                document["Phone"] = phone
            documents.append(document)
    
    try:
        # Відстежити посилки
        shipment_info = track_shipments(documents)


        return jsonify(shipment_info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/update_sprav_nova", methods=['POST'])
def update_sprav_nova():
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))  # Повертаємо 401, щоб показати, що користувач не має доступу

    try:
        # Отримання списку міст з API Нової Пошти
        cities = save_cities_to_json()
        return jsonify(cities), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/analytics', methods=['GET'])
def analytics():

    if "login" not in session:
        return redirect(url_for("login_page"))

    if session.get("lvl", 0) < 1:
        return "Access Denied", 403

    # Встановлюємо дати по замовчуванню на останній місяць
    date_max = datetime.today().strftime('%Y-%m-%d')
    date_min = (datetime.today() - timedelta(days=30)).strftime('%Y-%m-%d')
    
    sales_report = get_sales_report(date_min=date_min, date_max=date_max)
    top_sellers = get_top_sellers(date_min=date_min, date_max=date_max)
    
    return render_template('analytics.html', sales_report=sales_report, top_sellers=top_sellers)

@app.route('/sales_report', methods=['GET'])
def sales_report_route():

    if "login" not in session:
        return redirect(url_for("login_page"))

    date_min = request.args.get('date_min')
    date_max = request.args.get('date_max')
    period = request.args.get('period')
    
    try:
        report = get_sales_report(date_min=date_min, date_max=date_max, period=period)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/top_sellers', methods=['GET'])
def top_sellers_route():

    if "login" not in session:
        return redirect(url_for("login_page"))

    period = request.args.get('period')
    date_min = request.args.get('date_min')
    date_max = request.args.get('date_max')
    
    try:
        report = get_top_sellers(period=period, date_min=date_min, date_max=date_max)
        return jsonify(report)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/webhook', methods=['POST'])
def webhook_handler():
    # Перевіряємо наявність нових замовлень та оновлюємо стан
    session['new_orders'] = True  # Приклад: зберігаємо в сесії

    return 'Webhook received and processed'

@app.route('/check_orders', methods=['GET'])
def check_orders_route():
    new_orders_exist = session.get('new_orders', False)  # Отримуємо значення, за замовчуванням False
    
    if new_orders_exist:
        session['new_orders'] = False  # Змінюємо стан на False після перевірки

    return jsonify({'new_orders_exist': new_orders_exist})

def calculate_customer_stats(customer_id):
    page = 1
    per_page = 100
    total_orders = []
    total_amount = 0

    while True:
        orders, total_pages = get_wc_orders(customer=customer_id, full_name=None, page=page, per_page=per_page)
        
        if isinstance(orders, list):
            total_orders.extend(orders)
            
            for order in orders:
                if isinstance(order, dict):
                    total_amount += float(order.get('total', 0))
        
        if page >= total_pages:
            break
        
        page += 1

    order_count = len(total_orders)
    
    return order_count, total_amount

@app.route('/customer/<int:customer_id>', methods=['GET'])
def customer_info(customer_id):
    customer = get_customer(customer_id)
    order_count, total_amount = calculate_customer_stats(customer_id)
    
    return jsonify({
        'customer': customer,
        'order_count': order_count,
        'total_amount': total_amount
    })

def get_all_customers():
    all_customers = []
    page = 1
    per_page = 100
    
    while True:
        customers, total_pages = get_customers(page=page, per_page=per_page)
        all_customers.extend(customers)
        
        if page >= total_pages:
            break
        
        page += 1
    
    return all_customers

@app.route('/customers/sort-by-orders', methods=['GET'])
def customers_sort_by_orders():
    return sort_customers('orders_count')

@app.route('/customers/sort-by-total', methods=['GET'])
def customers_sort_by_total():
    return sort_customers('total_amount')

def sort_customers(sort_key):
    all_customers = get_all_customers()
    
    # Initialize missing keys and calculate statistics
    for customer in all_customers:
        if 'orders_count' not in customer or customer['orders_count'] == 0:
            customer['orders_count'], customer['total_amount'] = calculate_customer_stats(customer['id'])
    
    # Sort customers based on the provided sort_key
    customers_sorted = sorted(all_customers, key=lambda customer: customer.get(sort_key, 0), reverse=True)
    
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    
    start = (page - 1) * per_page
    end = start + per_page
    page_customers = customers_sorted[start:end]
    
    total_pages = (len(customers_sorted) + per_page - 1) // per_page
    
    return jsonify({
        'customers': page_customers,
        'current_page': page,
        'total_pages': total_pages
    })

@app.route('/order/<int:order_id>', methods=['GET'])  # Fixed route parameter
def get_order(order_id):
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    order_data = get_order_by_id(order_id)
    if order_data:
        return jsonify(order_data), 200
    else:
        return jsonify({"error": "Order not found"}), 404

@app.route('/orders', methods=['GET'])
def get_orders_route():
    if "login" not in session:
        return redirect(url_for("login_page"))
    
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 20, type=int)
    search_query = request.args.get('search', '', type=str)
    
    orders_data = get_orders(page=page, limit=limit, search_query=search_query)
    if orders_data:
        return jsonify(orders_data), 200
    else:
        return jsonify({"error": "Failed to retrieve orders"}), 500

@app.route('/prom_page', methods=['GET'])
def orders_page():

    if "login" not in session:
        return redirect(url_for("login_page"))

    return render_template('prom.html')

@app.route('/order/<int:order_id>', methods=['DELETE'])  # Fixed route parameter
def delete_order_route(order_id):
    if delete_order(order_id):
        return jsonify({'success': True, 'message': 'Замовлення видалено успішно.'}), 200
    return jsonify({'success': False, 'message': 'Замовлення не знайдено.'}), 404


@app.route('/order/<int:order_id>', methods=['PUT'])  # Fixed route parameter
def update_order_route(order_id):
    updated_data = request.json
    if update_order(order_id, updated_data):
        return jsonify({'success': True, 'message': 'Замовлення оновлено успішно.'}), 200
    return jsonify({'success': False, 'message': 'Замовлення не знайдено.'}), 404

@app.route('/order/<int:order_id>/product', methods=['POST'])  # Fixed route parameter
def add_product_to_order_route(order_id):
    product_data = request.json
    if add_product_to_order(order_id, product_data):
        return jsonify({'success': True, 'message': 'Товар додано успішно.'}), 201
    return jsonify({'success': False, 'message': 'Замовлення не знайдено.'}), 404

@app.route('/product/<int:product_id>', methods=['DELETE'])  # Fixed route parameter
def delete_product_route(product_id):
    if delete_product(product_id):
        return jsonify({'success': True, 'message': 'Товар видалено успішно.'}), 200
    return jsonify({'success': False, 'message': 'Товар не знайдено.'}), 404

@app.route('/product/<int:product_id>', methods=['PUT'])  # Fixed route parameter
def update_product_route(product_id):
    updated_data = request.json
    if update_product(product_id, updated_data):
        return jsonify({'success': True, 'message': 'Товар оновлено успішно.'}), 200
    return jsonify({'success': False, 'message': 'Товар не знайдено.'}), 404
