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
def print():
    if "login" not in session:
        return redirect(url_for("login_page"))
 
    return render_template("print.html"), 200

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
        products, total_pages = get_wc_products(name=name, category=category, page=page, per_page=20)
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
    # Перевірка чи користувач залогінений в сесії
    if "login" not in session:
        return redirect(url_for("login_page"))  # Повертаємо 401, щоб показати, що користувач не має доступу

    requsted_data=request.get_json()
    ord_id = requsted_data['id']
    phone_number = requsted_data['phone_number']
    message_text = requsted_data['message_text']
    
    if not phone_number or not message_text:
        return jsonify({"error": "Invalid data"}), 400

    # Відправлення SMS
    try:
        response = send_sms(phone_number, message_text)
        history = create_note(ord_id, {"note": f"Замовлення оновлено менеджером {session.get('name')}, відправлене повідомлення: {message_text}"})
    except Exception as e:
        return jsonify({"error":"Internal error"}), 400

    if isinstance(response, tuple) and response[0] == "Well done!":
        # Виклик функції для обробки запису в базу даних
        status = "Not delivered"
        update_sms(phone_number, message_text,response[1],status)  
        return jsonify({"success": "SMS sent successfully and processed in the database.", "message_id": response[1]}), 200
    else:
        return jsonify({"error": response}), 400

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
    with NovaPoshtaClient() as client:
        result = delete_internet_document(client, document_refs)
    return jsonify(result)

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



